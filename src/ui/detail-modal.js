// ============================================
// TalentLens — Detail Modal
// ============================================

import { createRadarChart } from './radar-chart.js';
import { getScoreClass, getScoreLabel } from '../engine/nlp-utils.js';
import { getSkillName } from '../engine/skill-ontology.js';

/**
 * Show detail modal for a candidate
 */
export function showDetailModal(rankedItem) {
    const { candidate, scores, rank } = rankedItem;
    const scoreClass = getScoreClass(scores.composite);
    const modal = document.getElementById('detail-modal');
    const body = document.getElementById('modal-body');

    const labelMap = {
        skillMatch: 'Skill Match',
        experienceRelevance: 'Experience',
        careerTrajectory: 'Trajectory',
        educationFit: 'Education',
        behavioralSignals: 'Behavioral',
        culturalFit: 'Cultural Fit'
    };

    // Score dimension cards
    const scoreDims = Object.entries(scores.dimensions).map(([key, val]) => {
        const fillClass = getScoreClass(val);
        return `
            <div class="detail-score-item">
                <div class="detail-score-item__header">
                    <span class="detail-score-item__label">${labelMap[key]}</span>
                    <span class="detail-score-item__value score-${fillClass}">${val}</span>
                </div>
                <div class="detail-score-item__bar">
                    <div class="detail-score-item__fill fill-${fillClass}" style="width: ${val}%"></div>
                </div>
            </div>
        `;
    }).join('');

    // Skills
    const skillsHTML = candidate.skills.map(s => {
        // Check if this skill was matched
        const matchDetail = scores.skillDetails?.matchDetails?.find(m => m.skill === s);
        const isMatched = matchDetail && (matchDetail.type === 'exact' || matchDetail.type === 'bonus-exact');
        const badgeClass = isMatched ? 'badge--success' : 'badge--skill';
        return `<span class="badge ${badgeClass}">${getSkillName(s)}</span>`;
    }).join('');

    // Missing skills
    const missingHTML = (scores.skillDetails?.missingSkills || []).map(s =>
        `<span class="badge badge--danger">${getSkillName(s)}</span>`
    ).join('');

    // Experience timeline
    const expHTML = candidate.experience.map(exp => `
        <div class="detail-exp-item">
            <div class="detail-exp-item__role">${exp.role}</div>
            <div class="detail-exp-item__company">${exp.company}</div>
            <div class="detail-exp-item__duration">${exp.duration} · ${exp.years} ${exp.years === 1 ? 'year' : 'years'}</div>
            <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-top: 6px;">${exp.description}</p>
        </div>
    `).join('');

    // Strengths & Gaps — check both direct and nested locations for compat
    const strengths = scores.strengths || scores.insights?.strengths || [];
    const gaps = scores.gaps || scores.insights?.gaps || [];
    const hiddenGemsList = scores.hiddenGems || scores.insights?.hiddenGems || [];
    const strengthsHTML = strengths.map(s => `<li>${s}</li>`).join('');
    const gapsHTML = gaps.map(g => `<li>${g}</li>`).join('');
    const gemsHTML = hiddenGemsList.map(g => `<li>${g}</li>`).join('');

    body.innerHTML = `
        <div class="detail-header">
            <div class="detail-header__avatar">${candidate.avatar}</div>
            <div class="detail-header__info">
                <div class="detail-header__name">${candidate.name}</div>
                <div class="detail-header__title">${candidate.currentTitle} at ${candidate.currentCompany}</div>
                <div class="detail-header__meta">
                    <span>📍 ${candidate.location}</span>
                    <span>💼 ${candidate.yearsOfExperience} years</span>
                    <span>🎓 ${candidate.education?.degree || 'N/A'}</span>
                    <span>🏫 ${candidate.education?.institution || 'N/A'}</span>
                </div>
            </div>
            <div class="detail-header__score">
                <div class="detail-header__score-value score-${scoreClass}">${scores.composite}</div>
                <div class="detail-header__score-label">${getScoreLabel(scores.composite)}</div>
            </div>
        </div>

        <div class="detail-radar-wrap" id="detail-radar-container"></div>

        <div class="detail-section">
            <div class="detail-section__title">Score Breakdown</div>
            <div class="detail-scores-grid">${scoreDims}</div>
        </div>

        ${strengths.length > 0 || gaps.length > 0 ? `
        <div class="detail-section">
            <div class="detail-section__title">Analysis</div>
            <div class="detail-strengths-gaps">
                ${strengths.length > 0 ? `
                    <div>
                        <div class="detail-section__title" style="color: var(--color-accent-emerald);">✦ Strengths</div>
                        <ul class="detail-list detail-list--strengths">${strengthsHTML}</ul>
                    </div>
                ` : ''}
                ${gaps.length > 0 ? `
                    <div>
                        <div class="detail-section__title" style="color: var(--color-accent-amber);">△ Gaps</div>
                        <ul class="detail-list detail-list--gaps">${gapsHTML}</ul>
                    </div>
                ` : ''}
            </div>
            ${gemsHTML ? `
                <div style="margin-top: 16px;">
                    <div class="detail-section__title" style="color: var(--color-accent-purple);">💎 Hidden Gems</div>
                    <ul class="detail-list detail-list--strengths">${gemsHTML}</ul>
                </div>
            ` : ''}
        </div>
        ` : ''}

        <div class="detail-section">
            <div class="detail-section__title">Skills (${candidate.skills.length})</div>
            <div class="detail-skills">${skillsHTML}</div>
            ${missingHTML ? `
                <div style="margin-top: 12px;">
                    <div class="detail-section__title" style="font-size: 11px;">Missing Required Skills</div>
                    <div class="detail-skills">${missingHTML}</div>
                </div>
            ` : ''}
        </div>

        <div class="detail-section">
            <div class="detail-section__title">Experience</div>
            <div class="detail-experience">${expHTML}</div>
        </div>

        <div class="detail-section">
            <div class="detail-section__title">Certifications & Credentials</div>
            <div class="detail-skills">
                ${candidate.certifications && candidate.certifications.length > 0 
                  ? candidate.certifications.map(c => `<span class="badge badge--info" style="font-size: 0.85rem; padding: 6px 12px; margin-bottom: 4px;">📜 ${c}</span>`).join('') 
                  : `<span style="color: var(--color-text-muted); font-size: 0.9rem;">No certifications added yet.</span>`
                }
            </div>
        </div>

        <div class="detail-section">
            <div class="detail-section__title">Additional Signals</div>
            <div class="detail-scores-grid">
                <div class="detail-score-item">
                    <div class="detail-score-item__header">
                        <span class="detail-score-item__label">Open Source</span>
                        <span class="detail-score-item__value">${candidate.openSourceContributions || 0}</span>
                    </div>
                </div>
                <div class="detail-score-item">
                    <div class="detail-score-item__header">
                        <span class="detail-score-item__label">Publications</span>
                        <span class="detail-score-item__value">${candidate.publications || 0}</span>
                    </div>
                </div>
                <div class="detail-score-item">
                    <div class="detail-score-item__header">
                        <span class="detail-score-item__label">Team Managed</span>
                        <span class="detail-score-item__value">${candidate.teamSizeManaged || 0}</span>
                    </div>
                </div>
                <div class="detail-score-item">
                    <div class="detail-score-item__header">
                        <span class="detail-score-item__label">Rank</span>
                        <span class="detail-score-item__value">#${rank}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Draw radar chart in modal
    const radarContainer = body.querySelector('#detail-radar-container');
    const colorScheme = scoreClass;
    const radarCanvas = createRadarChart(scores.dimensions, { size: 240, colorScheme });
    radarContainer.appendChild(radarCanvas);

    // Show modal
    modal.classList.add('modal-overlay--active');
}

/**
 * Initialize modal close handlers
 */
export function initModalHandlers() {
    const modal = document.getElementById('detail-modal');
    const closeBtn = document.getElementById('modal-close');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('modal-overlay--active');
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('modal-overlay--active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('modal-overlay--active')) {
            modal.classList.remove('modal-overlay--active');
        }
    });
}
