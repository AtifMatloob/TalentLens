# 🔍 TalentLens — AI Candidate Ranking System

> **Rank candidates the way a great recruiter would — not by matching keywords, but by actually understanding who fits the role.**

![TalentLens Screenshot](https://raw.githubusercontent.com/AtifMatloob/TalentLens/master/screenshots/rankings.png)

## 🚀 Live Demo

**[👉 Try TalentLens Live](https://atifmatloob.github.io/TalentLens/)**

## What It Does

Recruiters go through hundreds of profiles and still often miss the right person — because keyword filters can't see what actually matters. TalentLens changes that.

### 🧠 Semantic Understanding, Not Keyword Matching

- **Reads job descriptions** and extracts structured requirements — role type, seniority, required vs nice-to-have skills, soft skill signals, domain context
- **120+ skill knowledge graph** with synonyms, hierarchies, and adjacency relationships
- **"React Native" matches "mobile development"**, not just exact strings

### 📊 6-Dimension Candidate Scoring

| Dimension | Weight | What It Measures |
|-----------|--------|------------------|
| 🎯 Skill Match | 30% | Semantic alignment via ontology graph |
| 💼 Experience | 25% | Quality, relevance, company tier, tenure health |
| 📈 Trajectory | 15% | Career growth rate and momentum |
| 🎓 Education | 10% | Degree level, institution, field relevance |
| 🧠 Behavioral | 10% | Leadership, autonomy, innovation signals |
| 🤝 Cultural Fit | 10% | Domain alignment, open source, certifications |

### 🎯 Explainable Rankings

Every candidate gets:
- **✦ Strengths** — what makes them a great fit
- **△ Gaps** — where they fall short
- **💎 Hidden Gems** — non-obvious strengths a keyword search would miss

### 📈 Features

- 🔐 **User Authentication** — sign in / register as Candidate or Organization with secure IndexedDB-backed credential storage and SHA-256 password hashing
- 🧑‍💻 **Candidate Self-Service Portal** — candidates manage their own profile, skills, certifications, education, and resume text
- 👥 **Recruiter Management** — create recruiter profiles, manage separate candidate pools per recruiter
- 📄 **Resume PDF Upload** — drag-and-drop single or bulk PDF uploads with client-side text extraction via PDF.js
- 🤖 **Hybrid AI Engine** — local NLP by default, optional Gemini API integration for enhanced JD parsing, resume extraction, and candidate evaluation
- 🔍 **Semantic JD Parser** — understands context, not just words
- 📋 **5 Sample Templates** — Senior Full-Stack, ML Engineer, DevOps, Mobile Lead, Eng Manager
- ⚖️ **Side-by-Side Comparison** — compare up to 3 candidates with radar charts
- 💡 **Pool Insights** — score distribution, hardest-to-find skills, shortlist recommendations
- 🎛️ **Adjustable Weights** — tune scoring dimensions to your priorities
- 🔎 **Search & Filter** — quickly find specific candidates

## 🏗️ Architecture

```
                          ┌──────────────────────────────┐
                          │   Auth Store (IndexedDB)     │
                          │   SHA-256 hashed credentials │
                          └──────────┬───────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
             Candidate Portal  Organization Portal  Recruiter Mgmt
             (self-service)    (ranking engine)      (candidate pools)
                                     │
Job Description ──→ Semantic Parser ──→ Role Requirements Model
                    (LLM or Local)            │
                                              │
22+ Candidate Profiles ──→ Feature Extractor ─┤
 + PDF Resume Uploads                         ▼
                                    6-Dimension Scorer
                                    ├── Skill Semantic Match
                                    ├── Experience Relevance
                                    ├── Career Trajectory
                                    ├── Education Fit
                                    ├── Behavioral Signals
                                    └── Cultural Fit
                                              │
                                    ┌─────────┴─────────┐
                                    ▼                   ▼
                           LLM Enhancement      Local Scoring
                           (optional Gemini)    (always available)
                                    └─────────┬─────────┘
                                              ▼
                                    Explainable Shortlist
                                              │
                                              ▼
                                      Dashboard UI
```

## 🛠️ Tech Stack

- **Pure HTML/CSS/JS** — no frameworks, no build tools, no npm dependencies
- **Client-side NLP** — all AI processing happens in the browser
- **IndexedDB** — secure browser-based credential storage with SHA-256 hashing
- **PDF.js** — client-side PDF text extraction for resume uploads
- **Canvas API** — for radar chart visualization
- **ES Modules** — clean modular architecture
- **Optional Gemini API** — enhanced AI parsing when configured (works fully without it)

## 📂 Project Structure

```
├── index.html                    # Main app shell
├── test_resume.pdf               # Sample resume for testing PDF upload
├── screenshots/                  # App screenshots for README
├── src/
│   ├── main.js                   # Entry point
│   ├── engine/                   # AI/NLP Engine
│   │   ├── nlp-utils.js          # Tokenizer, TF-IDF, cosine similarity
│   │   ├── skill-ontology.js     # Skill graph & semantic matching
│   │   ├── jd-parser.js          # Job description parser (hybrid: LLM + local)
│   │   ├── candidate-analyzer.js # Career trajectory analysis
│   │   ├── candidate-parser.js   # Resume text → structured profile parser
│   │   ├── llm-api.js            # Gemini API integration layer
│   │   ├── scorer.js             # 6-dimension scoring engine
│   │   └── ranker.js             # Ranking & pool insights (hybrid)
│   ├── data/                     # Data Layer
│   │   ├── skill-graph.js        # 120+ skill ontology nodes
│   │   ├── candidates.js         # 22 built-in candidate profiles
│   │   ├── job-descriptions.js   # 5 sample JDs
│   │   ├── candidate-service.js  # Candidate & recruiter CRUD service
│   │   └── auth-store.js         # IndexedDB auth with SHA-256 hashing
│   ├── ui/                       # UI Components
│   │   ├── app.js                # App controller & auth flow
│   │   ├── radar-chart.js        # Canvas radar chart
│   │   ├── candidate-card.js     # Ranked candidate card
│   │   ├── comparison-view.js    # Side-by-side comparison
│   │   ├── detail-modal.js       # Candidate detail modal
│   │   ├── insights-panel.js     # Pool insights
│   │   ├── jd-input.js           # JD input & config
│   │   ├── api-settings.js       # Gemini API key configuration modal
│   │   └── recruiters.js         # Recruiter profiles & resume upload UI
│   └── styles/                   # Design System
│       ├── index.css             # Tokens & globals
│       ├── components.css        # Component styles
│       └── animations.css        # Micro-animations
```

## 🚀 Run Locally

No installation needed. Just serve the files:

```bash
# Python
python -m http.server 8080

# Or use any static file server
npx serve .
```

Then open **http://localhost:8080**

## 📄 License

MIT License — feel free to use, modify, and distribute.

