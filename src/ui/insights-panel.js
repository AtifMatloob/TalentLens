// ============================================
// TalentLens — Insights Panel
// ============================================

import { getSkillName } from '../engine/skill-ontology.js';

/**
 * Render pool insights
 */
export function renderInsights(container, insights, parsedJD) {
    container.innerHTML = '';

    if (!insights) {
        container.innerHTML = '<p style="color: var(--color-text-muted);">No insights available.</p>';
        return;
    }

    // 1. Pool Overview
    const overviewCard = createInsightCard('📊', 'Pool Overview', `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div>
                <div class="insight-card__stat">${insights.poolSize}</div>
                <div class="insight-card__stat-label">Total Candidates</div>
            </div>
            <div>
                <div class="insight-card__stat score-${insights.avgScore >= 60 ? 'good' : insights.avgScore >= 40 ? 'average' : 'below'}">${insights.avgScore}</div>
                <div class="insight-card__stat-label">Average Score</div>
            </div>
            <div>
                <div class="insight-card__stat score-excellent">${insights.topScore}</div>
                <div class="insight-card__stat-label">Top Score</div>
            </div>
            <div>
                <div class="insight-card__stat">${insights.medianScore}</div>
                <div class="insight-card__stat-label">Median Score</div>
            </div>
        </div>
    `);
    container.appendChild(overviewCard);

    // 2. Score Distribution
    const distCard = createInsightCard('📈', 'Score Distribution', `
        <div style="display: flex; flex-direction: column; gap: 12px;">
            ${createDistBar('Excellent (80+)', insights.distribution.excellent, insights.poolSize, 'var(--gradient-success)')}
            ${createDistBar('Good (60-79)', insights.distribution.good, insights.poolSize, 'var(--gradient-secondary)')}
            ${createDistBar('Average (40-59)', insights.distribution.average, insights.poolSize, 'var(--gradient-warning)')}
            ${createDistBar('Below (< 40)', insights.distribution.below, insights.poolSize, 'var(--gradient-danger)')}
        </div>
    `);
    container.appendChild(distCard);

    // 3. Hardest to Find Skills
    if (insights.hardestToFindSkills.length > 0) {
        const skillGapItems = insights.hardestToFindSkills.map(([skill, count]) => `
            <li>
                <span>${getSkillName(skill)}</span>
                <span style="color: var(--color-accent-rose); font-weight: 700;">${count}/${insights.poolSize} missing</span>
            </li>
        `).join('');

        const gapCard = createInsightCard('🔍', 'Hardest Skills to Find', `
            <p class="insight-card__content" style="margin-bottom: 12px;">
                These required skills are missing from the most candidate profiles.
            </p>
            <ul class="insight-card__list">${skillGapItems}</ul>
        `);
        container.appendChild(gapCard);
    }

    // 4. Recommended Shortlist
    const shortlistCard = createInsightCard('⭐', 'Recommended Shortlist', `
        <div class="insight-card__stat">${insights.shortlistSize}</div>
        <div class="insight-card__stat-label" style="margin-bottom: 16px;">Candidates Recommended</div>
        <p class="insight-card__content">
            Based on composite scoring across ${Object.keys(insights.topDimensionAverages).length} dimensions, 
            we recommend advancing the top ${insights.shortlistSize} candidates to the interview stage. 
            These candidates show the strongest alignment across skill match, experience relevance, and behavioral signals.
        </p>
    `);
    container.appendChild(shortlistCard);

    // 5. Pool Demographics
    const demoCard = createInsightCard('🌍', 'Pool Demographics', `
        <ul class="insight-card__list">
            <li>
                <span>Geographic Diversity</span>
                <span style="font-weight: 700;">${insights.locationDiversity} locations</span>
            </li>
            <li>
                <span>Avg Experience</span>
                <span style="font-weight: 700;">${insights.avgExperience} years</span>
            </li>
        </ul>
    `);
    container.appendChild(demoCard);

    // 6. Role Requirements Summary
    if (parsedJD) {
        const reqItems = [];
        reqItems.push(`<li><span>Role Type</span><span style="font-weight:600;">${parsedJD.roleType.join(', ')}</span></li>`);
        reqItems.push(`<li><span>Seniority</span><span style="font-weight:600;">${parsedJD.seniority?.level || 'N/A'}</span></li>`);
        if (parsedJD.yearsRequired) reqItems.push(`<li><span>Min Experience</span><span style="font-weight:600;">${parsedJD.yearsRequired}+ years</span></li>`);
        reqItems.push(`<li><span>Required Skills</span><span style="font-weight:600;">${parsedJD.requiredSkills.length}</span></li>`);
        reqItems.push(`<li><span>Nice-to-Have</span><span style="font-weight:600;">${parsedJD.niceToHaveSkills.length}</span></li>`);

        const reqCard = createInsightCard('📋', 'Parsed Requirements', `
            <ul class="insight-card__list">${reqItems.join('')}</ul>
        `);
        container.appendChild(reqCard);
    }
}

function createInsightCard(icon, title, contentHTML) {
    const card = document.createElement('div');
    card.className = 'insight-card glass-card';
    card.innerHTML = `
        <div class="insight-card__icon">${icon}</div>
        <div class="insight-card__title">${title}</div>
        <div>${contentHTML}</div>
    `;
    return card;
}

function createDistBar(label, count, total, gradient) {
    const pct = total > 0 ? (count / total) * 100 : 0;
    return `
        <div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <span style="font-size: var(--text-sm); color: var(--color-text-secondary);">${label}</span>
                <span style="font-size: var(--text-sm); font-weight: 700; font-family: var(--font-mono);">${count}</span>
            </div>
            <div style="height: 6px; background: rgba(255,255,255,0.06); border-radius: 999px; overflow: hidden;">
                <div style="height: 100%; width: ${pct}%; background: ${gradient}; border-radius: 999px; transition: width 0.8s var(--ease-out);"></div>
            </div>
        </div>
    `;
}
