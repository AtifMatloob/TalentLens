// ============================================
// TalentLens — Candidate Card Component
// ============================================

import { getScoreClass, getScoreLabel } from '../engine/nlp-utils.js';
import { getSkillName } from '../engine/skill-ontology.js';
import { DEFAULT_WEIGHTS } from '../engine/scorer.js';

/**
 * Render a candidate card for the results view
 */
export function renderCandidateCard(rankedItem, callbacks = {}) {
    const { candidate, scores, rank } = rankedItem;
    const scoreClass = getScoreClass(scores.composite);

    const card = document.createElement('div');
    card.className = `candidate-card ${rank <= 3 ? `candidate-card--rank-${rank}` : ''}`;
    card.dataset.candidateId = candidate.id;
    card.setAttribute('id', `candidate-card-${candidate.id}`);

    // Mini bars for dimensions
    const dimensionEntries = Object.entries(scores.dimensions);
    const labelMap = {
        skillMatch: 'Skills',
        experienceRelevance: 'Exp.',
        careerTrajectory: 'Growth',
        educationFit: 'Edu.',
        behavioralSignals: 'Behav.',
        culturalFit: 'Culture'
    };

    const miniBarsHTML = dimensionEntries.map(([key, val]) => {
        const fillClass = getScoreClass(val);
        return `
            <div class="mini-bar">
                <span class="mini-bar__label">${labelMap[key] || key}</span>
                <div class="mini-bar__track">
                    <div class="mini-bar__fill fill-${fillClass}" style="width: ${val}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Top skills (first 5)
    const topSkills = candidate.skills.slice(0, 5).map(s =>
        `<span class="badge badge--skill">${getSkillName(s)}</span>`
    ).join('');

    card.innerHTML = `
        <div class="candidate-card__left">
            <div class="candidate-card__rank">${rank}</div>
            <div class="candidate-card__avatar">${candidate.avatar}</div>
        </div>
        <div class="candidate-card__info">
            <div class="candidate-card__name">${candidate.name}</div>
            <div class="candidate-card__title">${candidate.currentTitle} at ${candidate.currentCompany}</div>
            <div class="candidate-card__meta">
                <span class="candidate-card__meta-item">📍 ${candidate.location}</span>
                ${candidate.phone ? `<span class="candidate-card__meta-item">Phone ${candidate.phone}</span>` : ''}
                <span class="candidate-card__meta-item">💼 ${candidate.yearsOfExperience} years</span>
                <span class="candidate-card__meta-item">🎓 ${candidate.education?.institution || 'N/A'}</span>
            </div>
            <div class="candidate-card__skills">${topSkills}</div>
        </div>
        <div class="candidate-card__right">
            <div class="candidate-card__score">
                <div class="candidate-card__score-value score-${scoreClass}">${scores.composite}</div>
                <div class="candidate-card__score-label">${getScoreLabel(scores.composite)}</div>
            </div>
            <div class="candidate-card__mini-bars">${miniBarsHTML}</div>
            <div class="candidate-card__actions">
                <button class="candidate-card__compare-btn" data-candidate-id="${candidate.id}" title="Add to comparison">⚖️ Compare</button>
            </div>
        </div>
    `;

    // Click handler for details
    card.addEventListener('click', (e) => {
        if (e.target.closest('.candidate-card__compare-btn')) return;
        callbacks.onViewDetails?.(rankedItem);
    });

    // Compare button handler
    const compareBtn = card.querySelector('.candidate-card__compare-btn');
    compareBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        callbacks.onToggleCompare?.(rankedItem, compareBtn);
    });

    return card;
}
