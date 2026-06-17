// ============================================
// TalentLens — Hybrid Ranker & Shortlist Generator
// ============================================

import { scoreCandidate, DEFAULT_WEIGHTS } from './scorer.js';
import { parseJobDescription } from './jd-parser.js';
import { CANDIDATES } from '../data/candidates.js';

/**
 * Rank all candidates against a job description
 * Returns sorted array of scored candidates
 */
export function rankCandidates(jdText, customWeights = null) {
    const parsedJD = parseJobDescription(jdText);
    
    if (!parsedJD) {
        return { results: [], parsedJD: null, error: 'Could not parse job description' };
    }
    
    // Score each candidate
    const scoredCandidates = CANDIDATES.map(candidate => {
        const scores = scoreCandidate(candidate, parsedJD, customWeights);
        return {
            candidate,
            scores
        };
    });
    
    // Sort by composite score (descending)
    scoredCandidates.sort((a, b) => b.scores.composite - a.scores.composite);
    
    // Assign ranks
    scoredCandidates.forEach((item, index) => {
        item.rank = index + 1;
    });
    
    // Generate pool insights
    const insights = generatePoolInsights(scoredCandidates, parsedJD);
    
    return {
        results: scoredCandidates,
        parsedJD,
        insights,
        error: null
    };
}

/**
 * Generate insights about the overall candidate pool
 */
function generatePoolInsights(rankedCandidates, parsedJD) {
    const scores = rankedCandidates.map(r => r.scores.composite);
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const topScore = scores[0];
    const medianScore = scores[Math.floor(scores.length / 2)];
    
    // Score distribution
    const excellent = scores.filter(s => s >= 80).length;
    const good = scores.filter(s => s >= 60 && s < 80).length;
    const average = scores.filter(s => s >= 40 && s < 60).length;
    const below = scores.filter(s => s < 40).length;
    
    // Skill gap analysis
    const allMissingSkills = {};
    for (const r of rankedCandidates) {
        for (const skill of (r.scores.skillDetails?.missingSkills || [])) {
            allMissingSkills[skill] = (allMissingSkills[skill] || 0) + 1;
        }
    }
    
    const hardestToFind = Object.entries(allMissingSkills)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    // Top candidates overview
    const shortlist = rankedCandidates.slice(0, 5);
    
    // Dimension averages across top candidates
    const topDims = {};
    for (const key of Object.keys(DEFAULT_WEIGHTS)) {
        topDims[key] = shortlist.reduce((sum, r) => sum + r.scores.dimensions[key], 0) / shortlist.length;
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
        hardestToFindSkills: hardestToFind,
        shortlistSize: Math.min(5, excellent + Math.min(3, good)),
        topDimensionAverages: topDims,
        locationDiversity: locations.length,
        avgExperience: Math.round(avgExperience * 10) / 10,
    };
}
