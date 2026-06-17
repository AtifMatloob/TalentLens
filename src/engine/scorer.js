// ============================================
// TalentLens — Multi-Dimensional Scoring Engine
// ============================================

import { calculateSkillMatchScore, getSkillName } from './skill-ontology.js';
import { analyzeCandidate } from './candidate-analyzer.js';
import { normalizeScore } from './nlp-utils.js';

// Default scoring weights
export const DEFAULT_WEIGHTS = {
    skillMatch: { label: 'Skill Match', icon: '🎯', weight: 30, description: 'How well skills align semantically' },
    experienceRelevance: { label: 'Experience', icon: '💼', weight: 25, description: 'Quality & relevance of past roles' },
    careerTrajectory: { label: 'Trajectory', icon: '📈', weight: 15, description: 'Growth pattern & career momentum' },
    educationFit: { label: 'Education', icon: '🎓', weight: 10, description: 'Degree & institution relevance' },
    behavioralSignals: { label: 'Behavioral', icon: '🧠', weight: 10, description: 'Leadership, autonomy, innovation' },
    culturalFit: { label: 'Cultural Fit', icon: '🤝', weight: 10, description: 'Team size, domain, work style match' }
};

/**
 * Score a candidate against parsed JD requirements
 * Returns multi-dimensional scores (0-100 each) and composite
 */
export function scoreCandidate(candidate, parsedJD, weights = null) {
    const w = weights || Object.fromEntries(
        Object.entries(DEFAULT_WEIGHTS).map(([k, v]) => [k, v.weight])
    );
    
    const analyzed = analyzeCandidate(candidate);
    
    // 1. Skill Match Score
    const skillResult = calculateSkillMatchScore(
        parsedJD.requiredSkills,
        parsedJD.niceToHaveSkills,
        candidate.skills
    );
    const skillScore = skillResult.score;
    
    // 2. Experience Relevance Score
    const expScore = scoreExperience(analyzed.experience, parsedJD);
    
    // 3. Career Trajectory Score
    const trajectoryScore = scoreTrajectory(analyzed.trajectory, parsedJD);
    
    // 4. Education Fit Score
    const eduScore = scoreEducation(candidate.education, parsedJD);
    
    // 5. Behavioral Signals Score
    const behavioralScore = scoreBehavioral(analyzed.behavioral, parsedJD);
    
    // 6. Cultural Fit Score
    const culturalScore = scoreCultural(analyzed, parsedJD);
    
    // Composite weighted score
    const totalWeight = Object.values(w).reduce((a, b) => a + b, 0);
    const composite = (
        (skillScore * w.skillMatch +
         expScore * w.experienceRelevance +
         trajectoryScore * w.careerTrajectory +
         eduScore * w.educationFit +
         behavioralScore * w.behavioralSignals +
         culturalScore * w.culturalFit) / totalWeight
    );
    
    // Generate strengths and gaps
    const { strengths, gaps, hiddenGems } = generateInsights(
        candidate, parsedJD, skillResult, analyzed,
        { skillScore, expScore, trajectoryScore, eduScore, behavioralScore, culturalScore }
    );
    
    return {
        candidateId: candidate.id,
        composite: Math.round(composite * 10) / 10,
        dimensions: {
            skillMatch: Math.round(skillScore * 10) / 10,
            experienceRelevance: Math.round(expScore * 10) / 10,
            careerTrajectory: Math.round(trajectoryScore * 10) / 10,
            educationFit: Math.round(eduScore * 10) / 10,
            behavioralSignals: Math.round(behavioralScore * 10) / 10,
            culturalFit: Math.round(culturalScore * 10) / 10
        },
        skillDetails: skillResult,
        strengths,
        gaps,
        hiddenGems,
        analyzed
    };
}

/**
 * Score experience relevance
 */
function scoreExperience(experience, parsedJD) {
    let score = 0;
    
    // Years of experience fit
    if (parsedJD.yearsRequired) {
        const ratio = experience.totalYears / parsedJD.yearsRequired;
        if (ratio >= 1.0 && ratio <= 1.8) score += 35; // sweet spot
        else if (ratio >= 0.7 && ratio < 1.0) score += 25; // slightly under
        else if (ratio > 1.8 && ratio <= 2.5) score += 28; // overqualified but ok
        else if (ratio > 2.5) score += 18; // very overqualified
        else score += ratio * 30; // underqualified
    } else {
        score += 25; // no requirement, give baseline
    }
    
    // Top-tier company experience
    score += experience.topTierRatio * 25;
    
    // Company diversity
    score += experience.diversityScore * 15;
    
    // Tenure health
    score += experience.tenureScore * 15;
    
    // Management experience if role requires it
    if (parsedJD.teamContext?.requiresManagement) {
        const teamSize = experience.companies.reduce((max, c) => Math.max(max, 0), 0);
        // This is based on candidate's teamSizeManaged from the original data
        score += 10; // baseline if they have management exp
    }
    
    return Math.min(100, score);
}

/**
 * Score career trajectory
 */
function scoreTrajectory(trajectory, parsedJD) {
    let score = 0;
    
    // Growth rate
    score += trajectory.growthRate * 40;
    
    // Momentum (recent upward trend)
    score += trajectory.momentum * 30;
    
    // Current level vs. required level
    const seniorityMap = { junior: 1, mid: 2, senior: 3, lead: 4, principal: 4.5, director: 5, executive: 6 };
    const requiredLevel = seniorityMap[parsedJD.seniority?.level] || 2;
    const currentLevel = trajectory.currentLevel || 2;
    
    const levelDiff = currentLevel - requiredLevel;
    if (levelDiff >= -0.5 && levelDiff <= 1.0) {
        score += 30; // Good match
    } else if (levelDiff > 1.0) {
        score += 20; // Overqualified
    } else {
        score += Math.max(0, 30 + levelDiff * 15); // Underqualified
    }
    
    return Math.min(100, score);
}

/**
 * Score education fit
 */
function scoreEducation(education, parsedJD) {
    if (!education) return 40; // No education info, neutral
    
    let score = 40; // baseline
    
    const requiredLevels = parsedJD.educationLevels || [];
    const degreeRank = { 'bachelors': 1, 'masters': 2, 'phd': 3 };
    
    // Degree level
    const candidateLevel = education.degree?.toLowerCase().includes('ph.d') ? 3 :
                           education.degree?.toLowerCase().includes('m.') ? 2 : 1;
    
    const maxRequired = requiredLevels.reduce((max, l) => Math.max(max, degreeRank[l] || 0), 0);
    
    if (maxRequired > 0) {
        if (candidateLevel >= maxRequired) score += 30;
        else if (candidateLevel === maxRequired - 1) score += 15;
        else score += 5;
    } else {
        score += 20; // No specific requirement
    }
    
    // Institution quality (rough proxy)
    const topInstitutions = [
        'stanford', 'mit', 'carnegie mellon', 'cmu', 'berkeley', 'caltech',
        'harvard', 'oxford', 'cambridge', 'eth zurich', 'imperial college',
        'university of toronto', 'georgia tech', 'university of michigan',
        'tu munich', 'uc berkeley', 'columbia', 'princeton'
    ];
    
    const instLower = (education.institution || '').toLowerCase();
    if (topInstitutions.some(t => instLower.includes(t))) {
        score += 20;
    } else {
        score += 10;
    }
    
    // Field relevance
    const techDegrees = ['computer science', 'software', 'data science', 'machine learning',
                         'artificial intelligence', 'information technology', 'computer engineering',
                         'statistics', 'mathematics', 'electrical engineering', 'distributed'];
    
    const degreeLower = (education.degree || '').toLowerCase();
    if (techDegrees.some(t => degreeLower.includes(t))) {
        score += 10;
    }
    
    return Math.min(100, score);
}

/**
 * Score behavioral signals
 */
function scoreBehavioral(behavioral, parsedJD) {
    if (!behavioral) return 50;
    
    const jdSoftSkills = parsedJD.softSkills || {};
    let score = 0;
    let totalWeight = 0;
    
    const dimensions = {
        leadership: { weight: 1.0, candidateVal: behavioral.leadership || 0 },
        communication: { weight: 0.8, jdKey: 'communication', candidateVal: (behavioral.collaboration || 0) * 0.7 + (behavioral.leadership || 0) * 0.3 },
        autonomy: { weight: 0.7, candidateVal: behavioral.autonomy || 0 },
        innovation: { weight: 0.6, candidateVal: behavioral.innovation || 0 },
        collaboration: { weight: 0.9, candidateVal: behavioral.collaboration || 0 }
    };
    
    for (const [key, dim] of Object.entries(dimensions)) {
        const jdSignal = jdSoftSkills[key] || 0.3; // default importance
        const weight = dim.weight * (0.5 + jdSignal * 0.5); // weight by JD importance
        
        score += dim.candidateVal * 100 * weight;
        totalWeight += weight;
    }
    
    return totalWeight > 0 ? Math.min(100, score / totalWeight) : 50;
}

/**
 * Score cultural fit
 */
function scoreCultural(analyzed, parsedJD) {
    let score = 50; // baseline
    
    // Domain alignment
    const domains = parsedJD.domainContext || [];
    if (domains.length > 0) {
        const candidateSkillSet = new Set(analyzed.skills);
        for (const domain of domains) {
            if (candidateSkillSet.has(domain) || candidateSkillSet.has(domain.replace(/ /g, '_'))) {
                score += 15;
                break;
            }
        }
    }
    
    // Management alignment
    if (parsedJD.teamContext?.requiresManagement) {
        if (analyzed.extras.teamSizeManaged > 5) score += 15;
        else if (analyzed.extras.teamSizeManaged > 0) score += 8;
    }
    
    // Open source / community engagement
    if (analyzed.extras.openSourceContributions > 10) score += 10;
    else if (analyzed.extras.openSourceContributions > 3) score += 5;
    
    // Certifications
    if (analyzed.extras.certifications.length > 0) score += 5;
    
    // Publications (for research-heavy roles)
    if (parsedJD.roleType?.includes('ml') && analyzed.extras.publications > 0) {
        score += Math.min(15, analyzed.extras.publications * 3);
    }
    
    return Math.min(100, score);
}

/**
 * Generate human-readable insights
 */
function generateInsights(candidate, parsedJD, skillResult, analyzed, scores) {
    const strengths = [];
    const gaps = [];
    const hiddenGems = [];
    
    // Skill strengths
    if (scores.skillScore >= 80) {
        strengths.push(`Excellent skill alignment with ${skillResult.directMatches} direct matches`);
    } else if (scores.skillScore >= 60) {
        strengths.push(`Good skill coverage with ${skillResult.directMatches} direct + ${skillResult.semanticMatches} related matches`);
    }
    
    // Experience strengths
    if (analyzed.experience.topTierRatio > 0.5) {
        strengths.push(`Strong pedigree with ${Math.round(analyzed.experience.topTierRatio * 100)}% experience at top-tier companies`);
    }
    
    if (analyzed.experience.totalYears >= (parsedJD.yearsRequired || 0)) {
        strengths.push(`Meets experience requirement with ${analyzed.experience.totalYears} years`);
    }
    
    // Trajectory strengths
    if (analyzed.trajectory.growthRate > 0.6) {
        strengths.push('Rapid career growth trajectory');
    }
    if (analyzed.trajectory.momentum > 0.7) {
        strengths.push('Strong recent upward career momentum');
    }
    
    // Behavioral strengths
    if (candidate.behavioralSignals?.leadership > 0.8 && parsedJD.softSkills?.leadership > 0.3) {
        strengths.push('Strong leadership signals');
    }
    if (candidate.behavioralSignals?.innovation > 0.85) {
        strengths.push('High innovation capacity');
    }
    
    // Open source
    if (candidate.openSourceContributions > 10) {
        strengths.push(`Active open-source contributor (${candidate.openSourceContributions} contributions)`);
    }
    
    // Publications
    if (candidate.publications > 3) {
        strengths.push(`Published researcher (${candidate.publications} publications)`);
    }
    
    // Gaps
    if (skillResult.missingSkills.length > 0) {
        const missingNames = skillResult.missingSkills.slice(0, 3).map(getSkillName);
        gaps.push(`Missing required skills: ${missingNames.join(', ')}`);
    }
    
    if (parsedJD.yearsRequired && analyzed.experience.totalYears < parsedJD.yearsRequired) {
        gaps.push(`Below experience requirement (${analyzed.experience.totalYears} vs ${parsedJD.yearsRequired}+ years needed)`);
    }
    
    if (parsedJD.teamContext?.requiresManagement && analyzed.extras.teamSizeManaged === 0) {
        gaps.push('No management experience (role requires team leadership)');
    }
    
    if (scores.behavioralScore < 50) {
        gaps.push('Behavioral signals below expectations for this role');
    }
    
    // Hidden gems (non-obvious strengths)
    if (skillResult.semanticMatches > 2) {
        hiddenGems.push(`${skillResult.semanticMatches} semantically related skills that translate well`);
    }
    
    if (analyzed.extras.certifications.length > 1) {
        hiddenGems.push(`Multiple relevant certifications: ${analyzed.extras.certifications.join(', ')}`);
    }
    
    if (candidate.behavioralSignals?.mentoring > 0.8 && analyzed.extras.teamSizeManaged > 3) {
        hiddenGems.push('Strong mentoring signal with team leadership experience');
    }
    
    return { strengths: strengths.slice(0, 5), gaps: gaps.slice(0, 4), hiddenGems: hiddenGems.slice(0, 3) };
}
