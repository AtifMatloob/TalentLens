# 🔍 TalentLens — AI Candidate Ranking System

> **Rank candidates the way a great recruiter would — not by matching keywords, but by actually understanding who fits the role.**

![TalentLens Screenshot](https://raw.githubusercontent.com/hoooo-07/TalentLens/main/screenshots/rankings.png)

## 🚀 Live Demo

**[👉 Try TalentLens Live](https://hoooo-07.github.io/TalentLens/)**

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

- 🔍 **Semantic JD Parser** — understands context, not just words
- 📋 **5 Sample Templates** — Senior Full-Stack, ML Engineer, DevOps, Mobile Lead, Eng Manager
- ⚖️ **Side-by-Side Comparison** — compare up to 3 candidates with radar charts
- 💡 **Pool Insights** — score distribution, hardest-to-find skills, shortlist recommendations
- 🎛️ **Adjustable Weights** — tune scoring dimensions to your priorities
- 🔎 **Search & Filter** — quickly find specific candidates

## 🏗️ Architecture

```
Job Description ──→ Semantic Parser ──→ Role Requirements Model
                                              │
22 Candidate Profiles ──→ Feature Extractor ──┤
                                              ▼
                                    6-Dimension Scorer
                                    ├── Skill Semantic Match
                                    ├── Experience Relevance
                                    ├── Career Trajectory
                                    ├── Education Fit
                                    ├── Behavioral Signals
                                    └── Cultural Fit
                                              │
                                              ▼
                                    Explainable Shortlist
                                              │
                                              ▼
                                      Dashboard UI
```

## 🛠️ Tech Stack

- **Pure HTML/CSS/JS** — no frameworks, no build tools, no dependencies
- **Client-side NLP** — all AI processing happens in the browser
- **Canvas API** — for radar chart visualization
- **ES Modules** — clean modular architecture
- **Zero API keys** — everything runs locally

## 📂 Project Structure

```
├── index.html                    # Main app shell
├── src/
│   ├── main.js                   # Entry point
│   ├── engine/                   # AI/NLP Engine
│   │   ├── nlp-utils.js          # Tokenizer, TF-IDF, cosine similarity
│   │   ├── skill-ontology.js     # Skill graph & semantic matching
│   │   ├── jd-parser.js          # Job description parser
│   │   ├── candidate-analyzer.js # Career trajectory analysis
│   │   ├── scorer.js             # 6-dimension scoring engine
│   │   └── ranker.js             # Ranking & pool insights
│   ├── data/                     # Data Layer
│   │   ├── skill-graph.js        # 120+ skill ontology nodes
│   │   ├── candidates.js         # 22 candidate profiles
│   │   └── job-descriptions.js   # 5 sample JDs
│   ├── ui/                       # UI Components
│   │   ├── app.js                # App controller
│   │   ├── radar-chart.js        # Canvas radar chart
│   │   ├── candidate-card.js     # Ranked candidate card
│   │   ├── comparison-view.js    # Side-by-side comparison
│   │   ├── detail-modal.js       # Candidate detail modal
│   │   ├── insights-panel.js     # Pool insights
│   │   └── jd-input.js           # JD input & config
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
