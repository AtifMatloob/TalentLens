// ============================================
// TalentLens — JD Input Component
// ============================================

import { parseJobDescription } from '../engine/jd-parser.js';
import { getSkillName } from '../engine/skill-ontology.js';
import { SAMPLE_JDS } from '../data/job-descriptions.js';
import { DEFAULT_WEIGHTS } from '../engine/scorer.js';

let debounceTimer = null;
let isParsingActive = false;

/**
 * Initialize JD Input component
 */
export function initJDInput(callbacks = {}) {
    const textarea = document.getElementById('jd-textarea');
    const charCount = document.getElementById('jd-char-count');
    const parseStatus = document.getElementById('parse-status');
    const parsedContent = document.getElementById('parsed-content');
    const templateBtn = document.getElementById('template-btn');
    const templateMenu = document.getElementById('template-menu');
    const templateDropdown = document.getElementById('template-dropdown');
    const analyzeBtn = document.getElementById('analyze-btn');

    // Populate template menu
    SAMPLE_JDS.forEach((jd, index) => {
        const item = document.createElement('button');
        item.className = 'dropdown__item';
        item.textContent = jd.title;
        item.addEventListener('click', () => {
            textarea.value = jd.description;
            textarea.dispatchEvent(new Event('input'));
            templateDropdown.classList.remove('dropdown--open');
        });
        templateMenu.appendChild(item);
    });

    // Template dropdown toggle
    templateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        templateDropdown.classList.toggle('dropdown--open');
    });

    document.addEventListener('click', () => {
        templateDropdown.classList.remove('dropdown--open');
    });

    // Text input handler with debounced async parsing
    textarea.addEventListener('input', () => {
        const text = textarea.value;
        charCount.textContent = `${text.length} characters`;

        // Debounce parsing
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (text.length > 30) {
                // Show parsing state
                if (isParsingActive) return; // Don't stack multiple parses
                isParsingActive = true;

                parseStatus.textContent = 'Parsing...';
                parseStatus.className = 'badge badge--warning';
                parsedContent.innerHTML = `
                    <div class="parsed-empty">
                        <div class="loading-dots"><span></span><span></span><span></span></div>
                        <p style="margin-top: 12px;">Analyzing job description...</p>
                    </div>
                `;

                try {
                    const parsed = await parseJobDescription(text);
                    if (parsed) {
                        renderParsedPreview(parsed, parsedContent);
                        const modeLabel = parsed.parsedBy === 'llm' ? 'AI Parsed ✓' : 'Parsed ✓';
                        parseStatus.textContent = modeLabel;
                        parseStatus.className = 'badge badge--success';
                        analyzeBtn.disabled = false;
                        callbacks.onParsed?.(parsed);
                    } else {
                        parsedContent.innerHTML = `
                            <div class="parsed-empty">
                                <span class="parsed-empty__icon">⚠️</span>
                                <p>Could not parse this text. Try adding more detail.</p>
                            </div>
                        `;
                        parseStatus.textContent = 'Parse failed';
                        parseStatus.className = 'badge badge--danger';
                        analyzeBtn.disabled = true;
                    }
                } catch (error) {
                    console.error("Parse error:", error);
                    parsedContent.innerHTML = `
                        <div class="parsed-empty">
                            <span class="parsed-empty__icon">⚠️</span>
                            <p>${error.message || 'Parsing error. Please try again.'}</p>
                        </div>
                    `;
                    parseStatus.textContent = 'Error';
                    parseStatus.className = 'badge badge--danger';
                    analyzeBtn.disabled = true;
                } finally {
                    isParsingActive = false;
                }
            } else {
                parsedContent.innerHTML = `
                    <div class="parsed-empty">
                        <span class="parsed-empty__icon">🧠</span>
                        <p>Enter a job description to see AI-parsed requirements</p>
                    </div>
                `;
                parseStatus.textContent = 'Waiting for input';
                parseStatus.className = 'badge badge--info';
                analyzeBtn.disabled = true;
            }
        }, 600);
    });

    // Weight sliders
    initWeightSliders();

    // Analyze button
    analyzeBtn.addEventListener('click', () => {
        const text = textarea.value;
        if (text.length > 30) {
            callbacks.onAnalyze?.(text, getWeights());
        }
    });

    return { textarea, analyzeBtn };
}

/**
 * Render parsed JD preview
 */
function renderParsedPreview(parsed, container) {
    let html = '';

    // Parsing mode indicator
    const modeIcon = parsed.parsedBy === 'llm' ? '🤖' : '🧠';
    const modeLabel = parsed.parsedBy === 'llm' ? 'AI-Powered' : 'Local NLP';
    html += `
        <div class="parsed-section" style="margin-bottom: 12px;">
            <span class="badge badge--info" style="font-size: 11px;">${modeIcon} ${modeLabel}</span>
        </div>
    `;

    // Role type & seniority
    html += `
        <div class="parsed-section">
            <div class="parsed-section__title">Role Detected</div>
            <div class="parsed-section__value">${parsed.seniority.level.charAt(0).toUpperCase() + parsed.seniority.level.slice(1)} · ${parsed.roleType.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ')}</div>
        </div>
    `;

    // Experience
    if (parsed.yearsRequired) {
        html += `
            <div class="parsed-section">
                <div class="parsed-section__title">Experience Required</div>
                <div class="parsed-section__value">${parsed.yearsRequired}+ years</div>
            </div>
        `;
    }

    // Required skills
    if (parsed.requiredSkills.length > 0) {
        html += `
            <div class="parsed-section">
                <div class="parsed-section__title">Required Skills (${parsed.requiredSkills.length})</div>
                <div class="parsed-section__tags">
                    ${parsed.requiredSkills.map(s => `<span class="badge badge--required">${getSkillName(s)}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Nice to have
    if (parsed.niceToHaveSkills.length > 0) {
        html += `
            <div class="parsed-section">
                <div class="parsed-section__title">Nice to Have (${parsed.niceToHaveSkills.length})</div>
                <div class="parsed-section__tags">
                    ${parsed.niceToHaveSkills.map(s => `<span class="badge badge--nice-to-have">${getSkillName(s)}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Education
    if (parsed.educationLevels.length > 0) {
        html += `
            <div class="parsed-section">
                <div class="parsed-section__title">Education</div>
                <div class="parsed-section__value">${parsed.educationLevels.join(', ')}</div>
            </div>
        `;
    }

    // Domain
    if (parsed.domainContext.length > 0) {
        html += `
            <div class="parsed-section">
                <div class="parsed-section__title">Domain</div>
                <div class="parsed-section__tags">
                    ${parsed.domainContext.map(d => `<span class="badge badge--info">${d}</span>`).join('')}
                </div>
            </div>
        `;
    }

    // Responsibilities (from LLM)
    if (parsed.responsibilities && parsed.responsibilities.length > 0) {
        html += `
            <div class="parsed-section">
                <div class="parsed-section__title">Key Responsibilities</div>
                <ul style="padding-left: 16px; font-size: var(--text-sm); color: var(--color-text-secondary);">
                    ${parsed.responsibilities.map(r => `<li style="margin-bottom: 4px;">${r}</li>`).join('')}
                </ul>
            </div>
        `;
    }

    container.innerHTML = html;
}

/**
 * Initialize weight sliders
 */
function initWeightSliders() {
    const container = document.getElementById('weight-sliders');
    container.innerHTML = '';

    for (const [key, config] of Object.entries(DEFAULT_WEIGHTS)) {
        const slider = document.createElement('div');
        slider.className = 'weight-slider';
        slider.innerHTML = `
            <div class="weight-slider__header">
                <label class="weight-slider__label" for="weight-${key}">
                    <span class="weight-slider__label-icon">${config.icon}</span>
                    ${config.label}
                </label>
                <span class="weight-slider__value" id="weight-value-${key}">${config.weight}%</span>
            </div>
            <input type="range" class="weight-slider__input" id="weight-${key}" 
                   min="0" max="50" value="${config.weight}" data-key="${key}">
        `;
        container.appendChild(slider);

        const input = slider.querySelector('input');
        const valueDisplay = slider.querySelector('.weight-slider__value');
        input.addEventListener('input', () => {
            valueDisplay.textContent = `${input.value}%`;
        });
    }

    // Reset button
    document.getElementById('reset-weights-btn')?.addEventListener('click', () => {
        for (const [key, config] of Object.entries(DEFAULT_WEIGHTS)) {
            const input = document.getElementById(`weight-${key}`);
            const valueDisplay = document.getElementById(`weight-value-${key}`);
            if (input) {
                input.value = config.weight;
                valueDisplay.textContent = `${config.weight}%`;
            }
        }
    });
}

/**
 * Get current weight values
 */
export function getWeights() {
    const weights = {};
    for (const key of Object.keys(DEFAULT_WEIGHTS)) {
        const input = document.getElementById(`weight-${key}`);
        weights[key] = input ? parseInt(input.value) : DEFAULT_WEIGHTS[key].weight;
    }
    return weights;
}
