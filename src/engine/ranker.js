// ============================================
// TalentLens — Hybrid Ranker & Shortlist Generator
// Local scoring (primary) + LLM enhancement (optional)
// ============================================

import { parseJobDescription } from './jd-parser.js';
import { scoreCandidate, DEFAULT_WEIGHTS } from './scorer.js';
import { candidateService } from '../data/candidate-service.js';
import { llmClient } from './llm-api.js';

// Re-export DEFAULT_WEIGHTS for any module that imports from ranker
export { DEFAULT_WEIGHTS };

/**
 * Rank all candidates against a job description.
 * Uses local scorer as the base, optionally enhanced by LLM evaluation.
 */
export async function rankCandidates(jdText, customWeights = null) {
    // Convert UI slider values (integers like 30) to weights
    // The scorer expects raw integer percentages
    const weights = customWeights || Object.fromEntries(
        Object.entries(DEFAULT_WEIGHTS).map(([k, v]) => [k, v.weight])
    );

    // 1. Parse JD (async — uses LLM if available, falls back to local)
    const parsedJD = await parseJobDescription(jdText);

    if (!parsedJD) {
        return { results: [], parsedJD: null, insights: {}, error: 'Could not parse job description. Please try again.' };
    }

    // 2. Score all candidates using the local scorer
    const scoredCandidates = [];
    const candidatesToRank = candidateService.getCandidates();

    for (const candidate of candidatesToRank) {
        const scores = scoreCandidate(candidate, parsedJD, weights);

        scoredCandidates.push({
            candidate,
            scores: {
                composite: scores.composite,
                dimensions: scores.dimensions,
                strengths: scores.strengths || [],
                gaps: scores.gaps || [],
                hiddenGems: scores.hiddenGems || [],
                skillDetails: scores.skillDetails || { missingSkills: [], matchDetails: [] },
                // Keep insights as an alias for backward compat
                insights: {
                    strengths: scores.strengths || [],
                    gaps: scores.gaps || [],
                    hiddenGems: scores.hiddenGems || []
                }
            }
        });
    }

    // 3. Optionally enhance with LLM evaluation
    if (llmClient.hasApiKey()) {
        try {
            await enhanceWithLLM(scoredCandidates, parsedJD);
        } catch (error) {
            console.warn("LLM enhancement failed, using local scores only:", error.message);
        }
    }

    // 4. Sort by composite score (descending)
    scoredCandidates.sort((a, b) => b.scores.composite - a.scores.composite);

    // 5. Assign ranks
    scoredCandidates.forEach((item, index) => {
        item.rank = index + 1;
    });

    // 6. Generate pool insights
    const insights = generatePoolInsights(scoredCandidates, parsedJD);

    return {
        results: scoredCandidates,
        parsedJD,
        insights,
        error: null
    };
}

/**
 * Enhance local scores with LLM evaluation in batches
 */
async function enhanceWithLLM(scoredCandidates, parsedJD) {
    const batchSize = 5;

    for (let i = 0; i < scoredCandidates.length; i += batchSize) {
        const batch = scoredCandidates.slice(i, i + batchSize);
        const candidates = batch.map(item => item.candidate);

        try {
            const llmResults = await evaluateCandidatesBatch(candidates, parsedJD);

            // Merge LLM results into local scores
            for (const item of batch) {
                const llmEval = llmResults.find(r => r.candidateId === item.candidate.id);
                if (llmEval) {
                    mergeScores(item, llmEval);
                }
            }
        } catch (error) {
            console.warn(`LLM batch ${i / batchSize + 1} failed:`, error.message);
            // Continue with local scores for this batch
        }
    }
}

/**
 * Merge LLM evaluation into the local scored item.
 * LLM insights (strengths/gaps/gems) are blended with local ones.
 * Dimension scores are weighted: 60% local + 40% LLM.
 */
function mergeScores(scoredItem, llmEval) {
    const scores = scoredItem.scores;
    const llmDims = llmEval.dimensions || {};

    // Blend dimension scores: 60% local, 40% LLM
    const LOCAL_WEIGHT = 0.6;
    const LLM_WEIGHT = 0.4;

    for (const key of Object.keys(scores.dimensions)) {
        if (llmDims[key] !== undefined && typeof llmDims[key] === 'number') {
            scores.dimensions[key] = Math.round(
                (scores.dimensions[key] * LOCAL_WEIGHT + llmDims[key] * LLM_WEIGHT) * 10
            ) / 10;
        }
    }

    // Recalculate composite
    // Note: using equal weighting for simplicity since the original weights
    // were already applied in the local scorer
    const dimValues = Object.values(scores.dimensions);
    const avg = dimValues.reduce((a, b) => a + b, 0) / dimValues.length;
    scores.composite = Math.round(avg * 10) / 10;

    // Merge insights — combine unique items, LLM insights first
    const llmStrengths = llmEval.strengths || [];
    const llmGaps = llmEval.gaps || [];
    const llmGems = llmEval.hiddenGems || [];

    scores.strengths = deduplicateStrings([...llmStrengths, ...scores.strengths]).slice(0, 5);
    scores.gaps = deduplicateStrings([...llmGaps, ...scores.gaps]).slice(0, 4);
    scores.hiddenGems = deduplicateStrings([...llmGems, ...scores.hiddenGems]).slice(0, 3);

    // Keep insights alias in sync
    scores.insights = {
        strengths: scores.strengths,
        gaps: scores.gaps,
        hiddenGems: scores.hiddenGems
    };
}

/**
 * Deduplicate similar strings (simple lowercase comparison)
 */
function deduplicateStrings(arr) {
    const seen = new Set();
    return arr.filter(s => {
        if (!s) return false;
        const key = s.toLowerCase().trim();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });
}

/**
 * Evaluate a batch of candidates using the Gemini API
 */
async function evaluateCandidatesBatch(candidates, parsedJD) {
    const systemInstruction = `
You are an expert AI Recruitment Evaluator.
You will be provided with a Role Requirements Model and a list of Candidate Profiles.
Evaluate EACH candidate's fit for the role.

For each candidate, return a JSON object inside an array matching this EXACT schema:
[
  {
    "candidateId": "string",
    "dimensions": {
      "skillMatch": number 0-100,
      "experienceRelevance": number 0-100,
      "careerTrajectory": number 0-100,
      "educationFit": number 0-100,
      "behavioralSignals": number 0-100,
      "culturalFit": number 0-100
    },
    "strengths": ["string", "string", "string"],
    "gaps": ["string", "string"],
    "hiddenGems": ["string"]
  }
]

Evaluate deeply. Consider skill transferability, trajectory (promotions), and leadership signals.
Provide realistic 0-100 scores. Do NOT give everyone 100.
`;

    const prompt = `
=== ROLE REQUIREMENTS ===
${JSON.stringify(parsedJD, null, 2)}

=== CANDIDATES TO EVALUATE ===
${JSON.stringify(candidates.map(c => ({
    id: c.id,
    name: c.name,
    title: c.currentTitle,
    skills: c.skills,
    experience: c.experience,
    education: c.education,
    yearsOfExperience: c.yearsOfExperience,
    behavioralSignals: c.behavioralSignals
})), null, 2)}
`;

    const result = await llmClient.generateContent(prompt, systemInstruction);

    if (Array.isArray(result)) return result;
    if (result.evaluations && Array.isArray(result.evaluations)) return result.evaluations;
    if (result.candidates && Array.isArray(result.candidates)) return result.candidates;

    return [];
}

/**
 * Generate insights about the overall candidate pool
 */
function generatePoolInsights(rankedCandidates, parsedJD) {
    if (rankedCandidates.length === 0) return {};

    const scores = rankedCandidates.map(r => r.scores.composite);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const topScore = scores[0];
    const medianScore = scores[Math.floor(scores.length / 2)];

    // Score distribution
    const excellent = scores.filter(s => s >= 80).length;
    const good = scores.filter(s => s >= 60 && s < 80).length;
    const average = scores.filter(s => s >= 40 && s < 60).length;
    const below = scores.filter(s => s < 40).length;

    // Hardest to find skills — count how many candidates are missing each required skill
    const hardestToFindSkills = [];
    if (parsedJD.requiredSkills && parsedJD.requiredSkills.length > 0) {
        const missingCounts = {};
        for (const item of rankedCandidates) {
            const missingSkills = item.scores.skillDetails?.missingSkills || [];
            for (const skill of missingSkills) {
                missingCounts[skill] = (missingCounts[skill] || 0) + 1;
            }
        }
        // Sort by most missing
        const sorted = Object.entries(missingCounts).sort((a, b) => b[1] - a[1]);
        hardestToFindSkills.push(...sorted.slice(0, 5));
    }

    // Top candidates overview
    const shortlist = rankedCandidates.slice(0, 5);

    // Dimension averages across top candidates
    const topDims = {};
    const dimKeys = Object.keys(shortlist[0]?.scores?.dimensions || {});
    for (const key of dimKeys) {
        topDims[key] = shortlist.reduce((sum, r) => sum + (r.scores.dimensions[key] || 0), 0) / shortlist.length;
    }

    // Diversity metrics
    const locations = [...new Set(rankedCandidates.map(r => r.candidate.location))];
    const avgExperience = rankedCandidates.reduce((sum, r) => sum + r.candidate.yearsOfExperience, 0) / rankedCandidates.length;

    return {
        poolSize: rankedCandidates.length,
        avgScore: Math.round(avgScore * 10) / 10,
        topScore: Math.round(topScore * 10) / 10,
        medianScore: Math.round(medianScore * 10) / 10,
        distribution: { excellent, good, average, below },
        hardestToFindSkills,
        shortlistSize: Math.min(5, excellent + Math.min(3, good)),
        topDimensionAverages: topDims,
        locationDiversity: locations.length,
        avgExperience: Math.round(avgExperience * 10) / 10,
    };
}
