// ============================================
// TalentLens — NLP Utilities
// Tokenization, TF-IDF, Cosine Similarity, Text Processing
// ============================================

// Common English stop words
const STOP_WORDS = new Set([
    'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been', 'be', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall',
    'can', 'need', 'dare', 'ought', 'used', 'not', 'no', 'nor', 'so', 'yet', 'both',
    'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'too', 'very',
    'just', 'about', 'above', 'after', 'again', 'all', 'also', 'am', 'any', 'because',
    'before', 'being', 'between', 'both', 'but', 'by', 'could', 'did', 'do', 'does',
    'doing', 'during', 'each', 'few', 'for', 'from', 'further', 'get', 'got', 'had',
    'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
    'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'let', 'me',
    'my', 'myself', 'of', 'off', 'on', 'once', 'only', 'or', 'our', 'ours', 'ourselves',
    'out', 'over', 'own', 'same', 'she', 'so', 'some', 'still', 'such', 'take', 'that',
    'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they',
    'this', 'those', 'through', 'to', 'under', 'until', 'up', 'us', 'we', 'what',
    'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'you',
    'your', 'yours', 'yourself', 'yourselves', 'able', 'across', 'along', 'already',
    'among', 'around', 'away', 'back', 'become', 'much', 'must', 'never', 'next',
    'now', 'often', 'per', 'put', 'quite', 'rather', 'really', 'right', 'said',
    'say', 'says', 'see', 'since', 'something', 'well', 'went', 'whether',
    // job-description specific noise
    'role', 'position', 'looking', 'join', 'team', 'work', 'working', 'company',
    'opportunity', 'ideal', 'candidate', 'apply', 'required', 'preferred',
    'responsibilities', 'qualifications', 'requirements', 'description', 'overview',
    'benefits', 'youll', 'youre', 'youve', 'were', 'weve', 'well'
]);

/**
 * Tokenize text into clean words
 */
export function tokenize(text) {
    if (!text) return [];
    return text
        .toLowerCase()
        .replace(/[^\w\s+#.-]/g, ' ')  // Keep +, #, ., - for tech terms
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ')
        .filter(w => w.length > 1);
}

/**
 * Remove stop words from token list
 */
export function removeStopWords(tokens) {
    return tokens.filter(t => !STOP_WORDS.has(t));
}

/**
 * Extract n-grams from token list
 */
export function ngrams(tokens, n = 2) {
    const result = [];
    for (let i = 0; i <= tokens.length - n; i++) {
        result.push(tokens.slice(i, i + n).join(' '));
    }
    return result;
}

/**
 * Compute term frequency for a document
 */
export function termFrequency(tokens) {
    const tf = {};
    const total = tokens.length;
    for (const token of tokens) {
        tf[token] = (tf[token] || 0) + 1;
    }
    // Normalize
    for (const key in tf) {
        tf[key] = tf[key] / total;
    }
    return tf;
}

/**
 * Compute TF-IDF vectors for a collection of documents
 */
export function tfidf(documents) {
    const n = documents.length;
    const tfs = documents.map(doc => termFrequency(doc));
    
    // IDF calculation
    const df = {};
    for (const tf of tfs) {
        for (const term in tf) {
            df[term] = (df[term] || 0) + 1;
        }
    }
    
    const idf = {};
    for (const term in df) {
        idf[term] = Math.log((n + 1) / (df[term] + 1)) + 1; // smooth IDF
    }
    
    // TF-IDF vectors
    return tfs.map(tf => {
        const vector = {};
        for (const term in tf) {
            vector[term] = tf[term] * idf[term];
        }
        return vector;
    });
}

/**
 * Cosine similarity between two sparse vectors
 */
export function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    const allTerms = new Set([...Object.keys(vecA), ...Object.keys(vecB)]);
    
    for (const term of allTerms) {
        const a = vecA[term] || 0;
        const b = vecB[term] || 0;
        dotProduct += a * b;
        normA += a * a;
        normB += b * b;
    }
    
    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dotProduct / denom;
}

/**
 * Jaccard similarity between two sets
 */
export function jaccardSimilarity(setA, setB) {
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
}

/**
 * Fuzzy string match score (0-1) using Levenshtein-based approach
 */
export function fuzzyMatch(str1, str2) {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.85;
    
    const len1 = s1.length;
    const len2 = s2.length;
    const maxLen = Math.max(len1, len2);
    
    if (maxLen === 0) return 1.0;
    
    // Levenshtein distance
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
 * Extract sentences from text
 */
export function sentenceSplit(text) {
    return text
        .split(/[.!?\n]+/)
        .map(s => s.trim())
        .filter(s => s.length > 10);
}

/**
 * Extract years of experience from text
 */
export function extractYearsOfExperience(text) {
    const patterns = [
        /(\d+)\+?\s*(?:years?|yrs?)(?:\s+of)?\s+(?:experience|exp)/gi,
        /(?:experience|exp)(?:\s+of)?\s*:?\s*(\d+)\+?\s*(?:years?|yrs?)/gi,
        /(\d+)\+?\s*(?:years?|yrs?)\s+(?:professional|industry|relevant)/gi
    ];
    
    const years = [];
    for (const pattern of patterns) {
        let match;
        while ((match = pattern.exec(text)) !== null) {
            years.push(parseInt(match[1]));
        }
    }
    
    return years.length > 0 ? Math.max(...years) : null;
}

/**
 * Extract education requirements
 */
export function extractEducation(text) {
    const lower = text.toLowerCase();
    const levels = [];
    
    if (/ph\.?d|doctorate|doctoral/i.test(lower)) levels.push('phd');
    if (/master|m\.s\.|m\.sc|m\.eng|mba|ms /i.test(lower)) levels.push('masters');
    if (/bachelor|b\.s\.|b\.sc|b\.eng|bs |b\.a\.|undergraduate/i.test(lower)) levels.push('bachelors');
    
    return levels;
}

/**
 * Detect seniority level from text
 */
export function detectSeniority(text) {
    const lower = text.toLowerCase();
    
    if (/vp|vice president|c-level|cto|ceo|coo|chief/i.test(lower)) return { level: 'executive', weight: 6 };
    if (/director|head of/i.test(lower)) return { level: 'director', weight: 5 };
    if (/principal|staff|distinguished/i.test(lower)) return { level: 'principal', weight: 4.5 };
    if (/lead|manager|senior staff/i.test(lower)) return { level: 'lead', weight: 4 };
    if (/senior|sr\.|sr /i.test(lower)) return { level: 'senior', weight: 3 };
    if (/mid[- ]level|intermediate/i.test(lower)) return { level: 'mid', weight: 2 };
    if (/junior|jr\.|jr |entry|associate|intern/i.test(lower)) return { level: 'junior', weight: 1 };
    
    return { level: 'mid', weight: 2 };
}

/**
 * Detect if text indicates a requirement vs nice-to-have
 */
export function isRequirement(sentence) {
    const lower = sentence.toLowerCase();
    const requirePatterns = [
        /required/i, /must have/i, /essential/i, /need to/i, /necessary/i,
        /minimum/i, /at least/i, /mandatory/i, /should have/i,
        /strong (?:proficiency|experience|knowledge|understanding)/i,
        /deep (?:expertise|experience|knowledge|understanding)/i,
        /proven (?:track record|experience|ability)/i,
        /(?:what|skills?) (?:we(?:'re| are)|you) (?:need|looking|require|bring)/i,
        /requirements?:/i, /qualifications?:/i
    ];
    
    const nicePatterns = [
        /nice to have/i, /bonus/i, /preferred/i, /plus/i, /advantag/i,
        /ideally/i, /familiarity/i, /exposure/i, /optional/i,
        /nice[- ]to[- ]have/i
    ];
    
    const isNice = nicePatterns.some(p => p.test(lower));
    const isReq = requirePatterns.some(p => p.test(lower));
    
    if (isNice) return false;
    if (isReq) return true;
    return null; // ambiguous
}

/**
 * Normalize a score to 0-100 range
 */
export function normalizeScore(value, min, max) {
    if (max === min) return 50;
    return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
}

/**
 * Get score color class
 */
export function getScoreClass(score) {
    if (score >= 80) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 50) return 'average';
    if (score >= 35) return 'below';
    return 'poor';
}

/**
 * Get score label
 */
export function getScoreLabel(score) {
    if (score >= 85) return 'Excellent Match';
    if (score >= 70) return 'Strong Match';
    if (score >= 55) return 'Good Match';
    if (score >= 40) return 'Partial Match';
    return 'Weak Match';
}
