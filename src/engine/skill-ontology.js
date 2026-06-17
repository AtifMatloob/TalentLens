// ============================================
// TalentLens — Skill Ontology Engine
// Semantic skill matching using knowledge graph
// ============================================

import { SKILL_GRAPH, ALIAS_MAP } from '../data/skill-graph.js';

/**
 * Resolve a text string to a skill key using the alias map
 */
export function resolveSkill(text) {
    if (!text) return null;
    const lower = text.toLowerCase().trim();
    
    // Direct lookup
    if (ALIAS_MAP[lower]) return ALIAS_MAP[lower];
    
    // Try with common variations
    const variations = [
        lower.replace(/\./g, ''),
        lower.replace(/-/g, ' '),
        lower.replace(/ /g, '_'),
        lower.replace(/js$/i, 'javascript'),
    ];
    
    for (const v of variations) {
        if (ALIAS_MAP[v]) return ALIAS_MAP[v];
    }
    
    // Fuzzy match against all skill names and aliases
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [key, skill] of Object.entries(SKILL_GRAPH)) {
        const nameScore = fuzzyMatchSimple(lower, skill.name.toLowerCase());
        if (nameScore > bestScore && nameScore > 0.82) {
            bestScore = nameScore;
            bestMatch = key;
        }
        
        for (const alias of skill.aliases) {
            const aliasScore = fuzzyMatchSimple(lower, alias.toLowerCase());
            if (aliasScore > bestScore && aliasScore > 0.82) {
                bestScore = aliasScore;
                bestMatch = key;
            }
        }
    }
    
    return bestMatch;
}

function fuzzyMatchSimple(s1, s2) {
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.85;
    
    const len1 = s1.length;
    const len2 = s2.length;
    const maxLen = Math.max(len1, len2);
    if (maxLen === 0) return 1.0;
    
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));
    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;
    
    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    
    return 1 - matrix[len1][len2] / maxLen;
}

/**
 * Extract skills from freeform text using the skill ontology
 */
export function extractSkillsFromText(text) {
    if (!text) return { required: [], niceToHave: [] };
    
    const lines = text.split(/\n/);
    const allSkills = [];
    let currentSection = 'required'; // default
    
    for (const line of lines) {
        const lower = line.toLowerCase().trim();
        
        // Detect section headers
        if (/nice\s*to\s*have|bonus|preferred|plus|advantage|optional/i.test(lower)) {
            currentSection = 'niceToHave';
        } else if (/require|must|need|essential|what\s+(?:we|you)|qualifications|skills/i.test(lower)) {
            currentSection = 'required';
        }
        
        // Try to match each skill in the graph against the line
        for (const [key, skill] of Object.entries(SKILL_GRAPH)) {
            const terms = [skill.name.toLowerCase(), ...skill.aliases.map(a => a.toLowerCase())];
            
            for (const term of terms) {
                // Word boundary matching to avoid partial matches
                const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(?:^|[\\s,;/|(])${escaped}(?:[\\s,;/|)]|$)`, 'i');
                
                if (regex.test(' ' + lower + ' ')) {
                    allSkills.push({ key, section: currentSection, term });
                    break; // found this skill in this line, move on
                }
            }
        }
    }
    
    // Deduplicate
    const requiredSet = new Set();
    const niceToHaveSet = new Set();
    
    for (const s of allSkills) {
        if (s.section === 'required') {
            requiredSet.add(s.key);
        } else {
            niceToHaveSet.add(s.key);
        }
    }
    
    // Remove from nice-to-have if also in required
    for (const key of requiredSet) {
        niceToHaveSet.delete(key);
    }
    
    return {
        required: [...requiredSet],
        niceToHave: [...niceToHaveSet]
    };
}

/**
 * Calculate semantic similarity between two skills (0-1)
 * Uses the skill graph to determine relationship strength
 */
export function skillSimilarity(skillA, skillB) {
    if (skillA === skillB) return 1.0;
    
    const graphA = SKILL_GRAPH[skillA];
    const graphB = SKILL_GRAPH[skillB];
    
    if (!graphA || !graphB) return 0;
    
    // Direct relationship
    if (graphA.related && graphA.related.includes(skillB)) return 0.7;
    if (graphB.related && graphB.related.includes(skillA)) return 0.7;
    
    // Parent/child
    if (graphA.parent === skillB || graphB.parent === skillA) return 0.8;
    
    // Same category
    if (graphA.category === graphB.category) {
        // Check for shared related skills (transitive similarity)
        const relatedA = new Set(graphA.related || []);
        const relatedB = new Set(graphB.related || []);
        const shared = [...relatedA].filter(x => relatedB.has(x));
        
        if (shared.length > 0) {
            return 0.3 + (shared.length / Math.max(relatedA.size, relatedB.size)) * 0.3;
        }
        return 0.2;
    }
    
    // Different category but shared related skills
    const relatedA = new Set(graphA.related || []);
    const relatedB = new Set(graphB.related || []);
    const shared = [...relatedA].filter(x => relatedB.has(x));
    
    if (shared.length > 0) {
        return 0.15 + (shared.length / Math.max(relatedA.size, relatedB.size)) * 0.25;
    }
    
    return 0;
}

/**
 * Find the best match for a required skill among a candidate's skills
 */
export function findBestSkillMatch(requiredSkill, candidateSkills) {
    let bestMatch = null;
    let bestScore = 0;
    
    for (const candidateSkill of candidateSkills) {
        const score = skillSimilarity(requiredSkill, candidateSkill);
        if (score > bestScore) {
            bestScore = score;
            bestMatch = candidateSkill;
        }
    }
    
    return { match: bestMatch, score: bestScore };
}

/**
 * Calculate overall skill match score between required skills and candidate skills
 */
export function calculateSkillMatchScore(requiredSkills, niceToHaveSkills, candidateSkills) {
    const candidateSet = new Set(candidateSkills);
    
    let requiredScore = 0;
    let requiredMax = 0;
    const matchDetails = [];
    
    // Score required skills (weighted higher)
    for (const reqSkill of requiredSkills) {
        const weight = SKILL_GRAPH[reqSkill]?.proficiencyWeight || 1.0;
        requiredMax += weight;
        
        if (candidateSet.has(reqSkill)) {
            requiredScore += weight;
            matchDetails.push({ skill: reqSkill, type: 'exact', score: 1.0 });
        } else {
            const { match, score } = findBestSkillMatch(reqSkill, candidateSkills);
            requiredScore += score * weight;
            if (score > 0) {
                matchDetails.push({ skill: reqSkill, type: 'semantic', matchedWith: match, score });
            } else {
                matchDetails.push({ skill: reqSkill, type: 'missing', score: 0 });
            }
        }
    }
    
    // Score nice-to-have skills (weighted lower)
    let niceScore = 0;
    let niceMax = 0;
    
    for (const niceSkill of niceToHaveSkills) {
        const weight = (SKILL_GRAPH[niceSkill]?.proficiencyWeight || 1.0) * 0.5; // half weight
        niceMax += weight;
        
        if (candidateSet.has(niceSkill)) {
            niceScore += weight;
            matchDetails.push({ skill: niceSkill, type: 'bonus-exact', score: 1.0 });
        } else {
            const { match, score } = findBestSkillMatch(niceSkill, candidateSkills);
            niceScore += score * weight;
            if (score > 0) {
                matchDetails.push({ skill: niceSkill, type: 'bonus-semantic', matchedWith: match, score });
            }
        }
    }
    
    const totalMax = requiredMax + niceMax;
    const totalScore = requiredScore + niceScore;
    const normalizedScore = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
    
    // Count extra relevant skills (bonus for breadth)
    const extraSkills = candidateSkills.filter(s => 
        !requiredSkills.includes(s) && !niceToHaveSkills.includes(s)
    );
    
    let extraBonus = 0;
    for (const extra of extraSkills) {
        for (const req of requiredSkills) {
            const sim = skillSimilarity(extra, req);
            if (sim > 0.3) {
                extraBonus += sim * 2;
                break;
            }
        }
    }
    
    const finalScore = Math.min(100, normalizedScore + extraBonus);
    
    return {
        score: finalScore,
        matchDetails,
        directMatches: matchDetails.filter(m => m.type === 'exact' || m.type === 'bonus-exact').length,
        semanticMatches: matchDetails.filter(m => m.type === 'semantic' || m.type === 'bonus-semantic').length,
        missingSkills: matchDetails.filter(m => m.type === 'missing').map(m => m.skill)
    };
}

/**
 * Get human-readable skill name
 */
export function getSkillName(key) {
    return SKILL_GRAPH[key]?.name || key;
}

/**
 * Get skill category
 */
export function getSkillCategory(key) {
    return SKILL_GRAPH[key]?.category || 'UNKNOWN';
}
