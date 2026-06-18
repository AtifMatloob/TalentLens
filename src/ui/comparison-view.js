// ============================================
// TalentLens — Comparison View
// ============================================

import { createRadarChart } from './radar-chart.js';
import { getScoreClass } from '../engine/nlp-utils.js';
import { DEFAULT_WEIGHTS } from '../engine/scorer.js';

/**
 * Render comparison cards for selected candidates
 */
export function renderComparisonView(container, selectedItems) {
    container.innerHTML = '';

    if (selectedItems.length === 0) {
        container.innerHTML = `
            <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 1.5rem; margin-bottom: 8px;">⚖️</p>
                <p style="color: var(--color-text-secondary);">Select candidates from the Rankings view to compare them side by side.</p>
            </div>
        `;
        return;
    }

    const colorSchemes = ['compare1', 'compare2', 'compare3'];
    const labelMap = {
        skillMatch: 'Skill Match',
        experienceRelevance: 'Experience',
        careerTrajectory: 'Trajectory',
        educationFit: 'Education',
        behavioralSignals: 'Behavioral',
        culturalFit: 'Cultural Fit'
    };

    selectedItems.forEach((item, index) => {
        const { candidate, scores, rank } = item;
        const scoreClass = getScoreClass(scores.composite);
        const scheme = colorSchemes[index % colorSchemes.length];

        const card = document.createElement('div');
        card.className = `compare-card ${index === 0 ? 'compare-card--top' : ''}`;

        // Dimensions bars
        const dimensionBars = Object.entries(scores.dimensions).map(([key, val]) => {
            const fillClass = getScoreClass(val);
            return `
                <div class="compare-dimension">
                    <div class="compare-dimension__header">
                        <span class="compare-dimension__label">${labelMap[key]}</span>
                        <span class="compare-dimension__value score-${fillClass}">${val}</span>
                    </div>
                    <div class="compare-dimension__bar">
                        <div class="compare-dimension__fill fill-${fillClass}" style="width: ${val}%"></div>
                    </div>
                </div>
            `;
        }).join('');

        // Strengths — check both direct and nested locations
        const strengths = scores.strengths || scores.insights?.strengths || [];
        const strengthsHTML = strengths.map(s =>
            `<li class="compare-card__strength-item">${s}</li>`
        ).join('');

        card.innerHTML = `
            <div class="compare-card__header">
                <div class="compare-card__avatar">${candidate.avatar}</div>
                <div>
                    <div class="compare-card__name">${candidate.name}</div>
                    <div class="compare-card__title">${candidate.currentTitle}</div>
                </div>
                <span class="compare-card__score-badge score-${scoreClass}">${scores.composite}</span>
            </div>
            <div class="compare-card__radar" id="compare-radar-${candidate.id}"></div>
            <div class="compare-card__dimensions">${dimensionBars}</div>
            <div class="compare-card__strengths">
                <div class="compare-card__strengths-title">Key Strengths</div>
                <ul class="compare-card__strength-list">${strengthsHTML}</ul>
            </div>
        `;

        container.appendChild(card);

        // Draw radar chart
        const radarContainer = card.querySelector(`#compare-radar-${candidate.id}`);
        const radarCanvas = createRadarChart(scores.dimensions, { size: 180, colorScheme: scheme });
        radarContainer.appendChild(radarCanvas);
    });
}
