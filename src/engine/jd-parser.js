// ============================================
// TalentLens — Job Description Semantic Parser
// Hybrid: LLM-powered (primary) + Local NLP (fallback)
// ============================================

import { llmClient } from './llm-api.js';
import { extractSkillsFromText, getSkillName } from './skill-ontology.js';
import {
    extractYearsOfExperience,
    extractEducation,
    detectSeniority,
    tokenize,
    removeStopWords
} from './nlp-utils.js';

/**
 * Parse a job description into a structured Role Requirements Model.
 * Uses the LLM if an API key is configured, otherwise falls back to local NLP.
 * Always returns a consistent structure.
 */
export async function parseJobDescription(text) {
    if (!text || text.trim().length < 20) {
        return null;
    }

    // Try LLM-powered parsing first
    if (llmClient.hasApiKey()) {
        try {
            const result = await parseWithLLM(text);
            if (result) return result;
        } catch (error) {
            console.warn("LLM parsing failed, falling back to local NLP:", error.message);
        }
    }

    // Local NLP fallback
    return parseLocally(text);
}

/**
 * Parse JD using Gemini LLM
 */
async function parseWithLLM(text) {
    const systemInstruction = `
You are an expert technical recruiter and AI systems analyst.
Extract structured requirements from the provided job description.
Return ONLY valid JSON matching this schema:
{
  "requiredSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill3"],
  "yearsRequired": number (integer, default 0 if not specified),
  "educationLevels": ["Bachelors", "Masters", etc],
  "seniority": { "level": "junior|mid|senior|lead|principal|director|executive" },
  "roleType": ["frontend", "backend", "fullstack", "mobile", "devops", "ml", "data_engineering", "management"],
  "softSkills": {
    "leadership": float 0.0-1.0,
    "communication": float 0.0-1.0,
    "autonomy": float 0.0-1.0,
    "innovation": float 0.0-1.0,
    "collaboration": float 0.0-1.0
  },
  "domainContext": ["fintech", "healthcare", "ecommerce", "saas", "startup", etc],
  "teamContext": {
    "teamSize": number (optional),
    "requiresManagement": boolean,
    "remote": boolean,
    "hybrid": boolean,
    "onsite": boolean
  },
  "responsibilities": ["resp1", "resp2"]
}
Limit responsibilities to max 5 bullet points.
`;

    const prompt = `Job Description:\n${text}`;
    const parsed = await llmClient.generateContent(prompt, systemInstruction);

    // Ensure defaults if missing
    return {
        requiredSkills: parsed.requiredSkills || [],
        niceToHaveSkills: parsed.niceToHaveSkills || [],
        yearsRequired: parsed.yearsRequired || 0,
        educationLevels: parsed.educationLevels || [],
        seniority: parsed.seniority || { level: "mid" },
        roleType: parsed.roleType || ["general"],
        softSkills: parsed.softSkills || {},
        domainContext: parsed.domainContext || [],
        teamContext: parsed.teamContext || {},
        responsibilities: parsed.responsibilities || [],
        rawText: text,
        parsedBy: 'llm'
    };
}

/**
 * Parse JD using local NLP utilities (no API key needed)
 */
function parseLocally(text) {
    // Extract skills using the skill ontology
    const skillResult = extractSkillsFromText(text);

    // Extract years of experience
    const yearsRequired = extractYearsOfExperience(text) || 0;

    // Detect seniority
    const seniority = detectSeniority(text);

    // Extract education levels
    const educationLevels = extractEducation(text);

    // Detect role type
    const roleType = detectRoleType(text);

    // Detect domain context
    const domainContext = detectDomainContext(text);

    // Detect soft skills signals
    const softSkills = detectSoftSkills(text);

    // Detect team context
    const teamContext = detectTeamContext(text);

    return {
        requiredSkills: skillResult.required,
        niceToHaveSkills: skillResult.niceToHave,
        yearsRequired,
        educationLevels,
        seniority: { level: seniority.level },
        roleType,
        softSkills,
        domainContext,
        teamContext,
        responsibilities: [],
        rawText: text,
        parsedBy: 'local'
    };
}

/**
 * Detect role type from text
 */
function detectRoleType(text) {
    const lower = text.toLowerCase();
    const types = [];

    if (/front[\s-]?end|ui\s+engineer|react|vue|angular|css/i.test(lower)) types.push('frontend');
    if (/back[\s-]?end|server[\s-]?side|api\s+develop|django|flask|spring|express/i.test(lower)) types.push('backend');
    if (/full[\s-]?stack|fullstack/i.test(lower)) types.push('fullstack');
    if (/mobile|ios|android|react\s+native|flutter|swift|kotlin/i.test(lower)) types.push('mobile');
    if (/devops|sre|site\s+reliability|infrastructure|platform\s+engineer|terraform|ci\/cd/i.test(lower)) types.push('devops');
    if (/machine\s+learning|ml\s+engineer|data\s+scien|deep\s+learning|ai\s+engineer|nlp|computer\s+vision/i.test(lower)) types.push('ml');
    if (/data\s+engineer|etl|data\s+pipeline|airflow|spark|big\s+data/i.test(lower)) types.push('data_engineering');
    if (/engineering\s+manager|vp\s+of\s+eng|director\s+of\s+eng|head\s+of\s+eng|managing\s+team/i.test(lower)) types.push('management');

    return types.length > 0 ? types : ['general'];
}

/**
 * Detect domain context from text
 */
function detectDomainContext(text) {
    const lower = text.toLowerCase();
    const domains = [];

    const domainPatterns = {
        fintech: /fintech|financial|payment|banking|trading|crypto|blockchain/i,
        healthcare: /healthcare|health\s+tech|medical|clinical|pharma|biotech/i,
        ecommerce: /e[\s-]?commerce|retail|marketplace|shopping|merchant/i,
        saas: /saas|b2b|subscription|platform/i,
        startup: /startup|early[\s-]?stage|seed|series\s+[a-c]/i,
        gaming: /gaming|game\s+dev|entertainment/i,
        adtech: /advertising|ad\s+tech|programmatic/i,
        edtech: /education|edtech|learning/i,
        social: /social\s+media|social\s+network|community/i,
        security: /cyber[\s-]?security|infosec|security/i,
    };

    for (const [domain, pattern] of Object.entries(domainPatterns)) {
        if (pattern.test(lower)) domains.push(domain);
    }

    return domains;
}

/**
 * Detect soft skill signals from text
 */
function detectSoftSkills(text) {
    const lower = text.toLowerCase();

    const measure = (patterns) => {
        let score = 0;
        for (const p of patterns) {
            if (p.test(lower)) score += 0.3;
        }
        return Math.min(1.0, score);
    };

    return {
        leadership: measure([/leader/i, /mentor/i, /guide\s+team/i, /lead\s+team/i, /manage\s+team/i]),
        communication: measure([/communicat/i, /present/i, /stakeholder/i, /cross[\s-]?functional/i]),
        autonomy: measure([/self[\s-]?start/i, /independen/i, /autonomy/i, /self[\s-]?direct/i]),
        innovation: measure([/innovat/i, /creative/i, /novel/i, /research/i, /experiment/i]),
        collaboration: measure([/collaborat/i, /team[\s-]?work/i, /cross[\s-]?team/i, /partner/i])
    };
}

/**
 * Detect team context from text
 */
function detectTeamContext(text) {
    const lower = text.toLowerCase();

    // Team size
    const teamMatch = lower.match(/team\s+of\s+(\d+)/i);
    const teamSize = teamMatch ? parseInt(teamMatch[1]) : null;

    return {
        teamSize,
        requiresManagement: /manage|lead\s+a?\s*team|direct\s+report|people\s+management/i.test(lower),
        remote: /remote|work\s+from\s+home|distributed/i.test(lower),
        hybrid: /hybrid/i.test(lower),
        onsite: /on[\s-]?site|in[\s-]?office|office[\s-]?based/i.test(lower)
    };
}

/**
 * Generate a human-readable summary of parsed requirements
 */
export function summarizeParsedJD(parsed) {
    if (!parsed) return '';

    const parts = [];

    parts.push(`**Role Type:** ${(parsed.roleType || []).join(', ')}`);
    parts.push(`**Seniority:** ${parsed.seniority?.level || 'Unknown'}`);

    if (parsed.yearsRequired) {
        parts.push(`**Experience:** ${parsed.yearsRequired}+ years`);
    }

    if (parsed.requiredSkills?.length > 0) {
        parts.push(`**Required Skills:** ${parsed.requiredSkills.join(', ')}`);
    }

    if (parsed.niceToHaveSkills?.length > 0) {
        parts.push(`**Nice to Have:** ${parsed.niceToHaveSkills.join(', ')}`);
    }

    if (parsed.educationLevels?.length > 0) {
        parts.push(`**Education:** ${parsed.educationLevels.join(', ')}`);
    }

    return parts.join('\n');
}
