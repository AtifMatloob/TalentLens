import { candidateService } from '../data/candidate-service.js';
import { SKILL_GRAPH } from '../data/skill-graph.js';
import { parseCandidateResume } from '../engine/candidate-parser.js';

class TalentLensApp {
    constructor() {
        this.currentView = 'login';
        this.rankingResults = null;
        this.parsedJD = null;
        this.compareSelection = new Map(); // candidateId -> rankedItem
        this.compareBar = null;
        
        this.userRole = null; // 'candidate' or 'org'
        this.activeCandidateId = null; // selected candidate profile ID if role is 'candidate'
        this.activeCandidateSkills = []; // currently edited skills

        this.init();
    }

    init() {
        // Init modal handlers
        initModalHandlers();
        initApiSettings();
        initRecruitersView(this);

        // Populate sign-up candidate linkage options
        this.populateSignupCandidateSelect();

        // Sign In / Sign Up tab switching
        document.getElementById('btn-toggle-signin')?.addEventListener('click', () => {
            document.getElementById('login-signin-section').style.display = 'grid';
            document.getElementById('login-signup-section').style.display = 'none';
            document.getElementById('btn-toggle-signin').className = 'btn btn--primary';
            document.getElementById('btn-toggle-signup').className = 'btn btn--ghost';
        });

        document.getElementById('btn-toggle-signup')?.addEventListener('click', () => {
            document.getElementById('login-signin-section').style.display = 'none';
            document.getElementById('login-signup-section').style.display = 'block';
            document.getElementById('btn-toggle-signin').className = 'btn btn--ghost';
            document.getElementById('btn-toggle-signup').className = 'btn btn--primary';
        });

        // SignUp Account type dropdown change
        document.getElementById('signup-role')?.addEventListener('change', (e) => {
            const linkageGroup = document.getElementById('signup-candidate-profile-group');
            if (linkageGroup) {
                linkageGroup.style.display = e.target.value === 'candidate' ? 'block' : 'none';
            }
        });

        // Portal Selector events
        document.getElementById('btn-login-org')?.addEventListener('click', () => {
            this.handleUserLogin('org');
        });
        document.getElementById('btn-login-candidate')?.addEventListener('click', () => {
            this.handleUserLogin('candidate');
        });

        // Execute Sign Up registration
        document.getElementById('btn-execute-signup')?.addEventListener('click', () => {
            this.handleUserRegistration();
        });

        // Logout
        document.getElementById('btn-logout')?.addEventListener('click', () => {
            this.logout();
        });

        // Candidate Portal specific handlers
        document.getElementById('btn-cand-add-cert')?.addEventListener('click', () => {
            this.addCandidateCertInput('');
        });
        document.getElementById('btn-cand-add-skill')?.addEventListener('click', () => {
            this.addSelectedCandidateSkill();
        });
        document.getElementById('btn-cand-save-profile')?.addEventListener('click', () => {
            this.saveCandidateProfile();
        });

        // Candidate Resume Fast Import
        const candFileInput = document.getElementById('cand-resume-file-input');
        const candUploadZone = document.getElementById('cand-resume-upload-zone');
        candUploadZone?.addEventListener('click', () => candFileInput?.click());
        candFileInput?.addEventListener('change', async (e) => {
            const file = e.target.files?.[0];
            if (file) {
                await this.handleCandidateResumeUpload(file);
            }
        });

        // Populate skills dropdown in candidate portal
        this.populateSkillsDropdown();

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

    populateSignupCandidateSelect() {
        const select = document.getElementById('signup-candidate-profile-id');
        if (!select) return;
        select.innerHTML = '';
        const candidates = candidateService.getCandidates();
        candidates.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id;
            opt.textContent = `${c.avatar} ${c.name} (${c.currentTitle})`;
            select.appendChild(opt);
        });
    }

    populateSkillsDropdown() {
        const select = document.getElementById('cand-add-skill-select');
        if (!select) return;
        select.innerHTML = '';
        // Sort skills alphabetically
        const sortedSkills = Object.entries(SKILL_GRAPH).sort((a, b) => a[1].name.localeCompare(b[1].name));
        sortedSkills.forEach(([key, value]) => {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = value.name;
            select.appendChild(opt);
        });
    }

    handleUserRegistration() {
        const role = document.getElementById('signup-role').value;
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        const candidateId = document.getElementById('signup-candidate-profile-id').value;

        if (!username) {
            this.showToast('⚠️', 'Please enter a username.');
            return;
        }

        if (password.length < 6) {
            this.showToast('⚠️', 'Password should be minimum 6 letters / digits');
            return;
        }

        // Virtual Storage in LocalStorage for credentials
        let credentials = {};
        try {
            credentials = JSON.parse(localStorage.getItem('talentlens_virtual_creds')) || {};
        } catch (e) {
            credentials = {};
        }

        // Check uniqueness of username
        if (credentials[username]) {
            this.showToast('⚠️', 'Username is already taken. Choose a different one.');
            return;
        }

        credentials[username] = {
            role,
            password,
            candidateId: role === 'candidate' ? candidateId : null
        };

        localStorage.setItem('talentlens_virtual_creds', JSON.stringify(credentials));
        this.showToast('✅', 'Account registered successfully! Now sign in.');
        
        // Clear input values
        document.getElementById('signup-username').value = '';
        document.getElementById('signup-password').value = '';

        // Switch to signin view
        document.getElementById('btn-toggle-signin')?.click();
    }

    handleUserLogin(role) {
        const usernameInputId = role === 'candidate' ? 'login-cand-username' : 'login-org-username';
        const passwordInputId = role === 'candidate' ? 'login-cand-password' : 'login-org-password';
        
        const username = document.getElementById(usernameInputId).value.trim();
        const password = document.getElementById(passwordInputId).value;

        if (!username) {
            this.showToast('⚠️', 'Please enter your username.');
            return;
        }

        if (password.length < 6) {
            this.showToast('⚠️', 'Password should be minimum 6 letters / digits');
            return;
        }

        // Load credentials from Virtual Storage
        let credentials = {};
        try {
            credentials = JSON.parse(localStorage.getItem('talentlens_virtual_creds')) || {};
        } catch (e) {
            credentials = {};
        }

        const userRecord = credentials[username];
        if (!userRecord || userRecord.role !== role || userRecord.password !== password) {
            this.showToast('❌', 'Invalid username or password for this portal.');
            return;
        }

        // Clear values
        document.getElementById(usernameInputId).value = '';
        document.getElementById(passwordInputId).value = '';

        this.loginAsRole(role, userRecord.candidateId);
    }

    loginAsRole(role, candidateId = null) {
        this.userRole = role;
        const header = document.getElementById('header');
        const roleBadge = document.getElementById('portal-role-badge');
        
        if (role === 'org') {
            roleBadge.textContent = 'Organization';
            header.style.display = 'flex';
            this.switchView('input');
        } else if (role === 'candidate') {
            this.activeCandidateId = candidateId;
            roleBadge.textContent = 'Candidate';
            header.style.display = 'flex';
            
            // Hide navigation buttons for Candidate
            document.getElementById('main-nav').style.display = 'none';
            
            // Switch to candidate dashboard view
            this.switchView('candidate-dashboard');
            this.loadCandidateProfileData(candidateId);
        }
    }

    logout() {
        this.userRole = null;
        this.activeCandidateId = null;
        document.getElementById('header').style.display = 'none';
        document.getElementById('main-nav').style.display = 'flex'; // Reset nav
        this.switchView('login');
    }

    loadCandidateProfileData(candidateId) {
        const candidates = candidateService.getCandidates();
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        document.getElementById('cand-edit-name').value = candidate.name || '';
        document.getElementById('cand-edit-avatar').value = candidate.avatar || '🧑‍💻';
        document.getElementById('cand-edit-title').value = candidate.currentTitle || '';
        document.getElementById('cand-edit-company').value = candidate.currentCompany || '';
        document.getElementById('cand-edit-location').value = candidate.location || '';
        document.getElementById('cand-edit-exp-years').value = candidate.yearsOfExperience || 0;

        document.getElementById('cand-edit-edu-degree').value = candidate.education?.degree || '';
        document.getElementById('cand-edit-edu-school').value = candidate.education?.institution || '';
        document.getElementById('cand-edit-edu-year').value = candidate.education?.year || new Date().getFullYear();

        // Certs
        const certsContainer = document.getElementById('cand-edit-certs-container');
        certsContainer.innerHTML = '';
        const certs = candidate.certifications || [];
        certs.forEach(cert => this.addCandidateCertInput(cert));

        // Skills
        this.activeCandidateSkills = [...(candidate.skills || [])];
        this.renderCandidateSkillsList();
    }

    addCandidateCertInput(value = '') {
        const certsContainer = document.getElementById('cand-edit-certs-container');
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.gap = 'var(--space-2)';
        wrapper.className = 'cand-cert-input-wrapper';
        wrapper.innerHTML = `
            <input type="text" class="cand-cert-input" value="${value}" placeholder="e.g. AWS Certified Developer" style="flex: 1; padding: 10px; background: rgba(0,0,0,0.2); border: 1px solid var(--color-border); border-radius: var(--radius-md); color: white;">
            <button class="btn btn--ghost btn--sm btn-delete-cert-field" style="border-color: rgba(251, 113, 133, 0.4); color: var(--color-accent-rose);">❌</button>
        `;
        wrapper.querySelector('.btn-delete-cert-field').addEventListener('click', () => {
            wrapper.remove();
        });
        certsContainer.appendChild(wrapper);
    }

    addSelectedCandidateSkill() {
        const select = document.getElementById('cand-add-skill-select');
        const skillKey = select.value;
        if (skillKey && !this.activeCandidateSkills.includes(skillKey)) {
            this.activeCandidateSkills.push(skillKey);
            this.renderCandidateSkillsList();
            this.showToast('🧠', `Added skill: ${SKILL_GRAPH[skillKey]?.name || skillKey}`);
        }
    }

    removeCandidateSkill(skillKey) {
        this.activeCandidateSkills = this.activeCandidateSkills.filter(s => s !== skillKey);
        this.renderCandidateSkillsList();
    }

    renderCandidateSkillsList() {
        const container = document.getElementById('cand-edit-skills-container');
        if (!container) return;
        container.innerHTML = '';
        
        if (this.activeCandidateSkills.length === 0) {
            container.innerHTML = `<span style="color: var(--color-text-muted); font-size: 0.85rem;">No skills selected yet.</span>`;
            return;
        }

        this.activeCandidateSkills.forEach(skillKey => {
            const skillName = SKILL_GRAPH[skillKey]?.name || skillKey;
            const badge = document.createElement('span');
            badge.className = 'badge badge--skill';
            badge.style.display = 'inline-flex';
            badge.style.alignItems = 'center';
            badge.style.gap = '6px';
            badge.style.cursor = 'pointer';
            badge.innerHTML = `${skillName} <strong style="color: var(--color-accent-rose); margin-left: 2px;">&times;</strong>`;
            badge.addEventListener('click', () => this.removeCandidateSkill(skillKey));
            container.appendChild(badge);
        });
    }

    saveCandidateProfile() {
        const name = document.getElementById('cand-edit-name').value.trim();
        if (!name) {
            this.showToast('⚠️', 'Name is required');
            return;
        }

        const certInputs = document.querySelectorAll('.cand-cert-input');
        const certifications = Array.from(certInputs)
            .map(input => input.value.trim())
            .filter(Boolean);

        const updatedData = {
            name,
            avatar: document.getElementById('cand-edit-avatar').value.trim() || '🧑‍💻',
            currentTitle: document.getElementById('cand-edit-title').value.trim(),
            currentCompany: document.getElementById('cand-edit-company').value.trim(),
            location: document.getElementById('cand-edit-location').value.trim(),
            yearsOfExperience: parseInt(document.getElementById('cand-edit-exp-years').value) || 0,
            education: {
                degree: document.getElementById('cand-edit-edu-degree').value.trim(),
                institution: document.getElementById('cand-edit-edu-school').value.trim(),
                year: parseInt(document.getElementById('cand-edit-edu-year').value) || new Date().getFullYear()
            },
            certifications,
            skills: this.activeCandidateSkills
        };

        candidateService.updateCandidate(this.activeCandidateId, updatedData);
        this.showToast('✅', 'Profile saved successfully!');
    }

    async handleCandidateResumeUpload(file) {
        const uploadZone = document.getElementById('cand-resume-upload-zone');
        const originalHTML = uploadZone.innerHTML;
        uploadZone.innerHTML = `<span class="btn__loader" style="display:block; position:relative; margin: 0 auto 10px;"></span><span>Parsing Resume PDF...</span>`;
        
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';
            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            let text = '';
            
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                text += pageText + '\n';
            }

            const parsedCandidate = await parseCandidateResume(text);

            // Populate Form Fields with Parsed Data
            document.getElementById('cand-edit-name').value = parsedCandidate.name || '';
            document.getElementById('cand-edit-avatar').value = parsedCandidate.avatar || '🧑‍💻';
            document.getElementById('cand-edit-title').value = parsedCandidate.currentTitle || '';
            document.getElementById('cand-edit-company').value = parsedCandidate.currentCompany || '';
            document.getElementById('cand-edit-location').value = parsedCandidate.location || '';
            document.getElementById('cand-edit-exp-years').value = parsedCandidate.yearsOfExperience || 0;

            document.getElementById('cand-edit-edu-degree').value = parsedCandidate.education?.degree || '';
            document.getElementById('cand-edit-edu-school').value = parsedCandidate.education?.institution || '';
            document.getElementById('cand-edit-edu-year').value = parsedCandidate.education?.year || new Date().getFullYear();

            // Certs
            const certsContainer = document.getElementById('cand-edit-certs-container');
            certsContainer.innerHTML = '';
            const certs = parsedCandidate.certifications || [];
            certs.forEach(cert => this.addCandidateCertInput(cert));

            // Skills
            this.activeCandidateSkills = [...(parsedCandidate.skills || [])];
            this.renderCandidateSkillsList();

            this.showToast('✅', 'Resume parsed! Review details and click Save.');
        } catch (error) {
            console.error('Error importing resume:', error);
            this.showToast('❌', `Failed to parse resume: ${error.message}`);
        } finally {
            uploadZone.innerHTML = originalHTML;
        }
    }

    switchView(viewName) {
        // Show/hide main navigation based on role
        const mainNav = document.getElementById('main-nav');
        if (mainNav) {
            mainNav.style.display = this.userRole === 'candidate' ? 'none' : 'flex';
        }

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

        // Render recruiters if switching to recruiters view
        if (viewName === 'recruiters') {
            renderRecruiterList();
        }
    }

    async runAnalysis(jdText, weights) {
        const analyzeBtn = document.getElementById('analyze-btn');
        
        // Show loading state
        analyzeBtn.classList.add('btn--loading');
        analyzeBtn.disabled = true;

        try {
            // Run ranking engine (async — parses JD and scores candidates)
            this.rankingResults = await rankCandidates(jdText, weights);

            if (this.rankingResults.error) {
                this.showToast('⚠️', this.rankingResults.error);
                return;
            }

            if (!this.rankingResults.results || this.rankingResults.results.length === 0) {
                this.showToast('⚠️', 'No candidates could be scored. Please try a different job description.');
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
            const score = topCandidate.scores.composite;
            const aiMode = this.rankingResults.parsedJD?.parsedBy === 'llm' ? ' (AI-Enhanced)' : '';
            this.showToast('✅', `Ranked ${this.rankingResults.results.length} candidates${aiMode}. Top match: ${topCandidate.candidate.name} (${score})`);

        } catch (error) {
            console.error('Analysis error:', error);
            this.showToast('❌', error.message || 'Error during analysis. Please try again.');
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
