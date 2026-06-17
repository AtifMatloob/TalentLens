// ============================================
// TalentLens — Candidate Analyzer
// Extracts features from candidate profiles
// ============================================

/**
 * Analyze a candidate profile and extract feature vectors
 */
export function analyzeCandidate(candidate) {
    return {
        id: candidate.id,
        name: candidate.name,
        skills: candidate.skills,
        experience: analyzeExperience(candidate),
        trajectory: analyzeTrajectory(candidate),
        education: candidate.education,
        behavioral: candidate.behavioralSignals,
        extras: {
            certifications: candidate.certifications || [],
            openSourceContributions: candidate.openSourceContributions || 0,
            publications: candidate.publications || 0,
            teamSizeManaged: candidate.teamSizeManaged || 0,
        }
    };
}

/**
 * Analyze candidate's experience
 */
function analyzeExperience(candidate) {
    const exp = candidate.experience || [];

    // Total years
    const totalYears = candidate.yearsOfExperience || 0;

    // Company tier scoring
    const topTierCompanies = new Set([
        'google', 'meta', 'facebook', 'apple', 'amazon', 'microsoft', 'netflix',
        'stripe', 'airbnb', 'uber', 'coinbase', 'snowflake', 'databricks',
        'openai', 'deepmind', 'twitter', 'linkedin', 'spotify', 'figma',
        'vercel', 'shopify', 'cloudflare', 'hashicorp', 'datadog', 'gitlab',
        'square', 'bloomberg', 'goldman sachs', 'notion', 'duolingo'
    ]);

    let topTierYears = 0;
    let totalExpYears = 0;
    const companies = [];

    for (const role of exp) {
        const companyLower = role.company.toLowerCase();
        const years = role.years || 1;
        totalExpYears += years;

        if (topTierCompanies.has(companyLower)) {
            topTierYears += years;
        }

        companies.push({
            company: role.company,
            role: role.role,
            years,
            isTier1: topTierCompanies.has(companyLower)
        });
    }

    // Diversity of companies (not stuck in one place)
    const companyCount = new Set(exp.map(e => e.company.toLowerCase())).size;
    const diversityScore = Math.min(1, companyCount / 3);

    // Average tenure (too short = red flag, too long = stagnation risk)
    const avgTenure = totalExpYears / Math.max(companyCount, 1);
    let tenureScore = 0;
    if (avgTenure >= 1.5 && avgTenure <= 4) tenureScore = 1.0;
    else if (avgTenure >= 1 && avgTenure < 1.5) tenureScore = 0.6;
    else if (avgTenure > 4 && avgTenure <= 6) tenureScore = 0.8;
    else if (avgTenure < 1) tenureScore = 0.3;
    else tenureScore = 0.6;

    return {
        totalYears,
        topTierYears,
        topTierRatio: totalExpYears > 0 ? topTierYears / totalExpYears : 0,
        companies,
        companyCount,
        diversityScore,
        avgTenure,
        tenureScore,
    };
}

/**
 * Analyze career trajectory — growth pattern and momentum
 */
function analyzeTrajectory(candidate) {
    const exp = candidate.experience || [];
    if (exp.length < 2) return { growthRate: 0.5, momentum: 0.5, progression: [] };

    const seniorityLevels = {
        'intern': 0, 'junior': 1, 'associate': 1, 'software engineer': 2,
        'engineer': 2, 'developer': 2, 'full-stack': 2, 'frontend': 2, 'backend': 2,
        'mid': 2.5, 'senior': 3, 'sr': 3, 'staff': 4, 'senior staff': 4.5,
        'principal': 5, 'distinguished': 5.5, 'lead': 3.5, 'manager': 4,
        'director': 5, 'vp': 6, 'vice president': 6, 'head': 5, 'chief': 7, 'founding': 4
    };

    function getRoleLevel(roleTitle) {
        const lower = roleTitle.toLowerCase();
        let bestLevel = 2; // default

        for (const [key, level] of Object.entries(seniorityLevels)) {
            if (lower.includes(key)) {
                bestLevel = Math.max(bestLevel, level);
            }
        }
        return bestLevel;
    }

    // Calculate progression
    const progression = exp.map(e => ({
        role: e.role,
        company: e.company,
        level: getRoleLevel(e.role),
        years: e.years
    })).reverse(); // chronological order

    // Growth rate: how fast did they climb?
    const firstLevel = progression[0].level;
    const lastLevel = progression[progression.length - 1].level;
    const totalYears = candidate.yearsOfExperience || 1;
    
    const levelGrowth = lastLevel - firstLevel;
    const growthRate = levelGrowth / totalYears;

    // Normalize: 0.5/year is excellent, 0.3/year is good, 0.1/year is slow
    const normalizedGrowth = Math.min(1.0, growthRate / 0.5);

    // Momentum: are they on an upward trend recently?
    let recentGrowth = 0;
    if (progression.length >= 2) {
        const recent = progression.slice(-2);
        recentGrowth = recent[1].level - recent[0].level;
    }
    const momentum = Math.min(1.0, Math.max(0, 0.5 + recentGrowth * 0.3));

    return {
        growthRate: normalizedGrowth,
        momentum,
        progression,
        currentLevel: lastLevel,
        startLevel: firstLevel
    };
}
