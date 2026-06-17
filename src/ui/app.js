// ============================================
// TalentLens — Main App Controller
// ============================================

import { rankCandidates } from '../engine/ranker.js';
import { initJDInput, getWeights } from './jd-input.js';
import { renderCandidateCard } from './candidate-card.js';
import { renderComparisonView } from './comparison-view.js';
import { showDetailModal, initModalHandlers } from './detail-modal.js';
import { renderInsights } from './insights-panel.js';

class TalentLensApp {
    constructor() {
        this.currentView = 'input';
        this.rankingResults = null;
        this.parsedJD = null;
        this.compareSelection = new Map(); // candidateId -> rankedItem
        this.compareBar = null;

        this.init();
    }

    init() {
        // Init modal handlers
        initModalHandlers();

        // Init JD input
        initJDInput({
            onParsed: (parsed) => {
                this.parsedJD = parsed;
            },
            onAnalyze: (jdText, weights) => {
                this.runAnalysis(jdText, weights);
            }
        });

        // Nav handlers
        document.querySelectorAll('.header__nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const view = btn.dataset.view;
                if (!btn.disabled) {
                    this.switchView(view);
                }
            });
        });

        // Back buttons
        document.getElementById('back-to-input-btn')?.addEventListener('click', () => this.switchView('input'));
        document.getElementById('back-to-results-btn')?.addEventListener('click', () => this.switchView('results'));
        document.getElementById('back-to-results-btn2')?.addEventListener('click', () => this.switchView('results'));

        // Search filter
        document.getElementById('candidate-search')?.addEventListener('input', (e) => {
            this.filterResults(e.target.value);
        });
    }

    switchView(viewName) {
        // Update nav
        document.querySelectorAll('.header__nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === viewName);
        });

        // Update views
        document.querySelectorAll('.view').forEach(view => {
            view.classList.remove('view--active');
        });
        
        const targetView = document.getElementById(`view-${viewName}`);
        if (targetView) {
            targetView.classList.add('view--active');
        }

        this.currentView = viewName;

        // Render comparison if switching to compare view
        if (viewName === 'compare') {
            renderComparisonView(
                document.getElementById('compare-grid'),
                [...this.compareSelection.values()]
            );
        }

        // Render insights if switching to insights view
        if (viewName === 'insights' && this.rankingResults) {
            renderInsights(
                document.getElementById('insights-grid'),
                this.rankingResults.insights,
                this.rankingResults.parsedJD
            );
        }
    }

    async runAnalysis(jdText, weights) {
        const analyzeBtn = document.getElementById('analyze-btn');
        
        // Show loading state
        analyzeBtn.classList.add('btn--loading');
        analyzeBtn.disabled = true;

        // Simulate processing time for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            // Run ranking engine
            this.rankingResults = rankCandidates(jdText, weights);

            if (this.rankingResults.error) {
                this.showToast('⚠️', this.rankingResults.error);
                return;
            }

            // Enable nav
            document.getElementById('nav-results').disabled = false;
            document.getElementById('nav-compare').disabled = false;
            document.getElementById('nav-insights').disabled = false;

            // Render results
            this.renderResults();

            // Switch to results view
            this.switchView('results');

            // Show success toast
            const topCandidate = this.rankingResults.results[0];
            this.showToast('✅', `Ranked ${this.rankingResults.results.length} candidates. Top match: ${topCandidate.candidate.name} (${topCandidate.scores.composite})`);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast('❌', 'Error during analysis. Please try again.');
        } finally {
            analyzeBtn.classList.remove('btn--loading');
            analyzeBtn.disabled = false;
        }
    }

    renderResults() {
        const grid = document.getElementById('results-grid');
        const subtitle = document.getElementById('results-subtitle');
        
        grid.innerHTML = '';

        if (!this.rankingResults || !this.rankingResults.results.length) return;

        subtitle.textContent = `${this.rankingResults.results.length} candidates ranked · Top score: ${this.rankingResults.insights.topScore} · Average: ${this.rankingResults.insights.avgScore}`;

        for (const item of this.rankingResults.results) {
            const card = renderCandidateCard(item, {
                onViewDetails: (rankedItem) => {
                    showDetailModal(rankedItem);
                },
                onToggleCompare: (rankedItem, btn) => {
                    this.toggleCompare(rankedItem, btn);
                }
            });
            grid.appendChild(card);
        }
    }

    toggleCompare(rankedItem, btn) {
        const id = rankedItem.candidate.id;

        if (this.compareSelection.has(id)) {
            this.compareSelection.delete(id);
            btn.classList.remove('candidate-card__compare-btn--active');
            btn.textContent = '⚖️ Compare';
        } else {
            if (this.compareSelection.size >= 3) {
                this.showToast('⚠️', 'Maximum 3 candidates can be compared at once');
                return;
            }
            this.compareSelection.set(id, rankedItem);
            btn.classList.add('candidate-card__compare-btn--active');
            btn.textContent = '✓ Selected';
        }

        this.updateCompareBar();
    }

    updateCompareBar() {
        const count = this.compareSelection.size;

        if (count === 0) {
            if (this.compareBar) {
                this.compareBar.remove();
                this.compareBar = null;
            }
            return;
        }

        if (!this.compareBar) {
            this.compareBar = document.createElement('div');
            this.compareBar.className = 'compare-bar';
            document.getElementById('app').appendChild(this.compareBar);
        }

        this.compareBar.innerHTML = `
            <span class="compare-bar__text">
                <span class="compare-bar__count">${count}</span> candidate${count !== 1 ? 's' : ''} selected
            </span>
            <button class="btn btn--primary btn--sm" id="compare-go-btn">Compare Now →</button>
            <button class="btn btn--ghost btn--sm" id="compare-clear-btn">Clear</button>
        `;

        this.compareBar.querySelector('#compare-go-btn').addEventListener('click', () => {
            this.switchView('compare');
        });

        this.compareBar.querySelector('#compare-clear-btn').addEventListener('click', () => {
            this.compareSelection.clear();
            this.updateCompareBar();
            // Reset all compare buttons
            document.querySelectorAll('.candidate-card__compare-btn').forEach(btn => {
                btn.classList.remove('candidate-card__compare-btn--active');
                btn.textContent = '⚖️ Compare';
            });
        });
    }

    filterResults(query) {
        const cards = document.querySelectorAll('.candidate-card');
        const lower = query.toLowerCase();

        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(lower) ? '' : 'none';
        });
    }

    showToast(icon, message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <span class="toast__icon">${icon}</span>
            <span class="toast__message">${message}</span>
        `;
        container.appendChild(toast);

        // Auto-remove after 4s
        setTimeout(() => {
            toast.classList.add('toast--exiting');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }
}

export { TalentLensApp };
