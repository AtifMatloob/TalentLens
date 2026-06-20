// ============================================
// TalentLens — Candidate Resume Parser
// ============================================

import { llmClient } from './llm-api.js';
import { extractSkillsFromText } from './skill-ontology.js';
import { extractYearsOfExperience, extractEducation } from './nlp-utils.js';

/**
 * Parse candidate resume text into a structured profile object
 */
export async function parseCandidateResume(text) {
    if (!text || text.trim().length < 20) {
        throw new Error('Resume text is too short or empty');
    }

    if (llmClient.hasApiKey()) {
        try {
            return await parseWithLLM(text);
        } catch (error) {
            console.warn("LLM resume parsing failed, falling back to local NLP:", error.message);
        }
    }

    return parseLocally(text);
}

async function parseWithLLM(text) {
    const systemInstruction = `
You are an expert technical resume parser.
Extract structured candidate details from the provided resume text.
Return ONLY valid JSON matching this schema:
{
  "name": "string (candidate full name)",
  "currentTitle": "string (current professional title)",
  "currentCompany": "string (current company)",
  "location": "string (e.g. San Francisco, CA or Remote)",
  "yearsOfExperience": number (total years of professional experience, integer),
  "education": {
    "degree": "string (e.g. B.S. Computer Science)",
    "institution": "string (e.g. Stanford University)",
    "year": number (graduation year)
  },
  "skills": ["skill_key1", "skill_key2"],
  "experience": [
    {
      "role": "string",
      "company": "string",
      "duration": "string (e.g. 2021-Present)",
      "years": number (years spent in this role, integer),
      "description": "string (short summary of achievements)"
    }
  ],
  "certifications": ["string"],
  "openSourceContributions": number (estimated, default 0),
  "publications": number (estimated, default 0),
  "teamSizeManaged": number (default 0),
  "behavioralSignals": {
    "leadership": float 0.0-1.0,
    "autonomy": float 0.0-1.0,
    "collaboration": float 0.0-1.0,
    "mentoring": float 0.0-1.0,
    "innovation": float 0.0-1.0
  }
}

CRITICAL INSTRUCTIONS FOR SKILLS:
Map the candidate's skills only to matching standardized skill keys from this ontology list. If a skill does not map well to these, omit it or map it to the closest match.
Valid Skill Keys:
- Frontend: react, typescript, javascript, css, html, vue, svelte, graphql_client, redux, tailwind, storybook, accessibility, responsive_design, design_system, threejs, webpack, vite, figma
- Backend: nodejs, python, go, java, ruby, rails, spring_boot, express, c_sharp, dotnet, php, laravel, c_plus_plus, rust
- Databases/Caching: postgresql, mysql, mongodb, redis, elasticsearch, cassandra, dynamo_db, firebase_db
- Infrastructure/DevOps: aws, google_cloud, azure, docker, kubernetes, terraform, ansible, jenkins, github_actions, gitlab_ci, cicd, linux, nginx, helm, prometheus, grafana, datadog, cloud_native
- AI/ML/Data Science: pytorch, tensorflow, machine_learning, deep_learning, nlp, computer_vision, llm, transformers, r_lang, pandas, numpy, sklearn, statistics, data_science, mlops, cuda, spark, airflow, recommender_systems, data_engineering, big_data
- Architecture/Concepts: system_design, distributed_systems, microservices, rest_api, graphql, grpc, websockets, event_driven, security, authentication, encryption, scalability, performance, unit_testing, integration_testing, test_automation, agile, startup
- Management/Leadership: team_management, tech_lead, mentoring, product_management, stakeholder_management, leadership, hiring

The return output MUST be valid JSON.
`;

    const prompt = `Resume Content:\n${text}`;
    const parsed = await llmClient.generateContent(prompt, systemInstruction);

    // Provide default values if missing
    return {
        name: parsed.name || 'Parsed Candidate',
        avatar: parsed.avatar || (Math.random() > 0.5 ? '👩‍💻' : '👨‍💻'),
        currentTitle: parsed.currentTitle || 'Software Engineer',
        currentCompany: parsed.currentCompany || 'SaaS Company',
        location: parsed.location || 'Remote',
        yearsOfExperience: parsed.yearsOfExperience || 3,
        education: parsed.education || { degree: 'B.S. Computer Science', institution: 'University', year: 2020 },
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        certifications: parsed.certifications || [],
        openSourceContributions: parsed.openSourceContributions || 0,
        publications: parsed.publications || 0,
        teamSizeManaged: parsed.teamSizeManaged || 0,
        behavioralSignals: parsed.behavioralSignals || {
            leadership: 0.5,
            autonomy: 0.6,
            collaboration: 0.7,
            mentoring: 0.5,
            innovation: 0.6
        }
    };
}

function parseLocally(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    
    // Name
    let name = 'New Candidate';
    if (lines.length > 0 && lines[0].length < 35 && !/resume|cv|profile|contact|curriculum/i.test(lines[0])) {
        name = lines[0];
    }

    // Role title
    let currentTitle = 'Software Engineer';
    const knownTitles = [
        'full-stack engineer', 'fullstack engineer', 'frontend engineer', 'backend engineer',
        'software engineer', 'developer', 'sre', 'site reliability engineer', 'devops engineer',
        'engineering manager', 'tech lead', 'ml engineer', 'machine learning engineer',
        'data scientist', 'data engineer', 'principal engineer', 'staff engineer', 'vp of engineering',
        'product designer', 'mobile engineer', 'android engineer', 'ios engineer'
    ];
    let foundTitle = false;
    for (const line of lines.slice(0, 8)) {
        const lower = line.toLowerCase();
        for (const title of knownTitles) {
            if (lower.includes(title)) {
                currentTitle = line.length < 50 ? line : title.replace(/\b\w/g, c => c.toUpperCase());
                foundTitle = true;
                break;
            }
        }
        if (foundTitle) break;
    }

    // Company
    let currentCompany = 'Tech Startup';
    for (const line of lines.slice(0, 12)) {
        const match = line.match(/(?:at|company:)\s*([A-Z][a-zA-Z0-9\s.,]+)/i);
        if (match && match[1] && match[1].trim().length > 2 && match[1].trim().length < 40) {
            currentCompany = match[1].trim();
            break;
        }
    }

    // Skills
    const skillResult = extractSkillsFromText(text);
    const skills = [...new Set([...skillResult.required, ...skillResult.niceToHave])];

    // Experience Years
    const yearsOfExperience = extractYearsOfExperience(text) || 3;

    // Education
    const educationLevels = extractEducation(text);
    let degree = 'B.S. Computer Science';
    let institution = 'University';
    let year = new Date().getFullYear() - yearsOfExperience;

    for (const line of lines) {
        if (/degree|bachelor|master|phd|b\.s|m\.s|ph\.d|university|college/i.test(line)) {
            if (/stanford/i.test(line)) institution = 'Stanford University';
            else if (/mit|massachusetts/i.test(line)) institution = 'MIT';
            else if (/berkeley/i.test(line)) institution = 'UC Berkeley';
            else if (/cmu|carnegie/i.test(line)) institution = 'Carnegie Mellon University';
            else if (/harvard/i.test(line)) institution = 'Harvard University';
            else {
                const instMatch = line.match(/(?:at|from)\s+([A-Z][a-zA-Z\s]+University|[A-Z][a-zA-Z\s]+College)/i);
                if (instMatch) institution = instMatch[1].trim();
            }
            
            if (/master|m\.s/i.test(line)) degree = 'M.S. Computer Science';
            else if (/phd|ph\.d/i.test(line)) degree = 'Ph.D. Computer Science';
            else if (/bachelor|b\.s/i.test(line)) degree = 'B.S. Computer Science';
            
            const yearMatch = line.match(/\b(20\d{2}|19\d{2})\b/);
            if (yearMatch) year = parseInt(yearMatch[1]);
        }
    }

    // Experience Array
    const experience = [];
    experience.push({
        role: currentTitle,
        company: currentCompany,
        duration: 'Present',
        years: Math.max(1, Math.round(yearsOfExperience * 0.6)),
        description: `Responsible for design and development of core services as ${currentTitle} at ${currentCompany}.`
    });
    if (yearsOfExperience > 2) {
        experience.push({
            role: 'Software Engineer',
            company: 'Previous Startup',
            duration: 'Past',
            years: Math.max(1, Math.round(yearsOfExperience * 0.4)),
            description: 'Assisted in building highly scalable web endpoints and automated pipelines.'
        });
    }

    // Behavioral Signals
    const lowerText = text.toLowerCase();
    let leadership = 0.4;
    let autonomy = 0.5;
    let collaboration = 0.6;
    let mentoring = 0.3;
    let innovation = 0.5;

    if (lowerText.includes('led') || lowerText.includes('managed') || lowerText.includes('head') || lowerText.includes('lead')) {
        leadership += 0.3;
        mentoring += 0.25;
    }
    if (lowerText.includes('architected') || lowerText.includes('designed') || lowerText.includes('innovated')) {
        innovation += 0.3;
        autonomy += 0.2;
    }
    if (lowerText.includes('team') || lowerText.includes('agile') || lowerText.includes('collaborated')) {
        collaboration += 0.2;
    }

    return {
        name,
        avatar: Math.random() > 0.5 ? '👩‍💻' : '👨‍💻',
        currentTitle,
        currentCompany,
        location: lowerText.includes('remote') ? 'Remote' : 'San Francisco, CA',
        yearsOfExperience,
        education: { degree, institution, year },
        skills,
        experience,
        certifications: [],
        openSourceContributions: lowerText.includes('github') || lowerText.includes('open source') ? 4 : 0,
        publications: lowerText.includes('publications') || lowerText.includes('published') ? 1 : 0,
        teamSizeManaged: lowerText.includes('managed a team') ? 5 : 0,
        behavioralSignals: {
            leadership: Math.min(1.0, leadership),
            autonomy: Math.min(1.0, autonomy),
            collaboration: Math.min(1.0, collaboration),
            mentoring: Math.min(1.0, mentoring),
            innovation: Math.min(1.0, innovation)
        }
    };
}
