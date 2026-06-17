// ============================================
// TalentLens — Job Description Semantic Parser
// Understands WHAT a role actually needs
// ============================================

import { extractSkillsFromText, getSkillName } from './skill-ontology.js';
import { extractYearsOfExperience, extractEducation, detectSeniority, tokenize, removeStopWords, sentenceSplit } from './nlp-utils.js';

/**
 * Parse a job description into a structured Role Requirements Model
 */
export function parseJobDescription(text) {
    if (!text || text.trim().length < 20) {
        return null;
    }

    const { required, niceToHave } = extractSkillsFromText(text);
    const yearsRequired = extractYearsOfExperience(text);
    const educationLevels = extractEducation(text);
    const seniority = detectSeniority(text);
    const roleType = detectRoleType(text);
    const softSkills = detectSoftSkills(text);
    const domainContext = detectDomainContext(text);
    const teamContext = detectTeamContext(text);
    const responsibilities = extractResponsibilities(text);

    return {
        requiredSkills: required,
        niceToHaveSkills: niceToHave,
        yearsRequired,
        educationLevels,
        seniority,
        roleType,
        softSkills,
        domainContext,
        teamContext,
        responsibilities,
        rawText: text
    };
}

/**
 * Detect the type of role
 */
function detectRoleType(text) {
    const lower = text.toLowerCase();
    const types = [];

    if (/full[- ]?stack|fullstack/i.test(lower)) types.push('fullstack');
    if (/front[- ]?end|frontend|ui engineer|ui developer/i.test(lower)) types.push('frontend');
    if (/back[- ]?end|backend|server[- ]?side|api engineer/i.test(lower)) types.push('backend');
    if (/mobile|ios|android|react native|flutter/i.test(lower)) types.push('mobile');
    if (/devops|sre|site reliability|platform engineer|infrastructure/i.test(lower)) types.push('devops');
    if (/data scien|machine learn|ml engineer|ai engineer|deep learning/i.test(lower)) types.push('ml');
    if (/data engineer|etl|data pipeline|data platform/i.test(lower)) types.push('data_engineering');
    if (/manager|management|lead.*team|director/i.test(lower)) types.push('management');
    if (/architect|principal|staff/i.test(lower)) types.push('architecture');
    if (/security|infosec|cybersec/i.test(lower)) types.push('security');
    if (/qa|test|quality assurance|sdet/i.test(lower)) types.push('qa');
    if (/design|ux|ui\/ux/i.test(lower)) types.push('design');

    return types.length > 0 ? types : ['general'];
}

/**
 * Detect soft skill requirements
 */
function detectSoftSkills(text) {
    const lower = text.toLowerCase();
    const signals = {};

    // Leadership signals
    signals.leadership = calcSignalStrength(lower, [
        /lead/i, /mentor/i, /drive/i, /own/i, /champion/i, /influence/i,
        /strategic/i, /vision/i, /guide.*team/i, /grow.*team/i
    ]);

    // Communication signals
    signals.communication = calcSignalStrength(lower, [
        /communicat/i, /present/i, /collaborat/i, /stakeholder/i, /articulate/i,
        /write|written/i, /document/i, /cross[- ]?functional/i
    ]);

    // Autonomy signals
    signals.autonomy = calcSignalStrength(lower, [
        /independent/i, /self[- ]?start/i, /autonomy|autonomous/i, /own.*end.*to.*end/i,
        /self[- ]?direct/i, /initiative/i, /proactive/i, /ambiguity/i
    ]);

    // Innovation signals
    signals.innovation = calcSignalStrength(lower, [
        /innovat/i, /creative/i, /novel/i, /cutting[- ]?edge/i, /state[- ]?of[- ]?the[- ]?art/i,
        /research/i, /experiment/i, /explore/i, /push.*boundar/i
    ]);

    // Collaboration signals
    signals.collaboration = calcSignalStrength(lower, [
        /team/i, /collaborat/i, /cross[- ]?functional/i, /partner/i, /work.*closely/i,
        /agile/i, /pair/i, /code review/i
    ]);

    return signals;
}

function calcSignalStrength(text, patterns) {
    let matches = 0;
    for (const p of patterns) {
        if (p.test(text)) matches++;
    }
    return Math.min(1.0, matches / 3);
}

/**
 * Detect domain context
 */
function detectDomainContext(text) {
    const lower = text.toLowerCase();
    const domains = [];

    if (/fintech|financial|banking|payment|trading/i.test(lower)) domains.push('fintech');
    if (/health|medical|clinical|hipaa|patient/i.test(lower)) domains.push('healthcare');
    if (/e-?commerce|retail|shopping|marketplace|merchant/i.test(lower)) domains.push('ecommerce');
    if (/saas|b2b|enterprise/i.test(lower)) domains.push('saas');
    if (/startup|early[- ]?stage|series [a-c]/i.test(lower)) domains.push('startup');
    if (/gaming|game dev|player/i.test(lower)) domains.push('gaming');
    if (/media|content|streaming|video/i.test(lower)) domains.push('media');
    if (/education|edtech|learning/i.test(lower)) domains.push('education');

    return domains;
}

/**
 * Detect team context
 */
function detectTeamContext(text) {
    const lower = text.toLowerCase();
    const context = {};

    // Team size mentions
    const sizeMatch = lower.match(/team\s+of\s+(\d+)/i) || lower.match(/(\d+)[\s-]+(?:person|member|engineer)/i);
    if (sizeMatch) {
        context.teamSize = parseInt(sizeMatch[1]);
    }

    // Management requirement
    context.requiresManagement = /manag|lead.*team|hire|recruit|mentor/i.test(lower);
    
    // Remote/Hybrid
    if (/remote/i.test(lower)) context.remote = true;
    if (/hybrid/i.test(lower)) context.hybrid = true;
    if (/on[- ]?site|in[- ]?office/i.test(lower)) context.onsite = true;

    return context;
}

/**
 * Extract key responsibilities
 */
function extractResponsibilities(text) {
    const sentences = sentenceSplit(text);
    const responsibilities = [];

    const actionVerbs = /^(?:design|build|develop|implement|architect|lead|manage|drive|create|maintain|optimize|deploy|collaborate|work|contribute|ensure|establish|define|set|deliver|scale|write|review)/i;

    for (const sentence of sentences) {
        const trimmed = sentence.replace(/^[-•*]\s*/, '').trim();
        if (actionVerbs.test(trimmed) && trimmed.length < 200) {
            responsibilities.push(trimmed);
        }
    }

    return responsibilities.slice(0, 10); // top 10
}

/**
 * Generate a human-readable summary of parsed requirements
 */
export function summarizeParsedJD(parsed) {
    if (!parsed) return '';

    const parts = [];

    parts.push(`**Role Type:** ${parsed.roleType.join(', ')}`);
    parts.push(`**Seniority:** ${parsed.seniority.level}`);

    if (parsed.yearsRequired) {
        parts.push(`**Experience:** ${parsed.yearsRequired}+ years`);
    }

    if (parsed.requiredSkills.length > 0) {
        parts.push(`**Required Skills:** ${parsed.requiredSkills.map(getSkillName).join(', ')}`);
    }

    if (parsed.niceToHaveSkills.length > 0) {
        parts.push(`**Nice to Have:** ${parsed.niceToHaveSkills.map(getSkillName).join(', ')}`);
    }

    if (parsed.educationLevels.length > 0) {
        parts.push(`**Education:** ${parsed.educationLevels.join(', ')}`);
    }

    return parts.join('\n');
}
