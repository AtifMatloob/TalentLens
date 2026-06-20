// ============================================
// TalentLens — Recruiters UI & Resume Uploads
// ============================================

import { candidateService } from '../data/candidate-service.js';
import { parseCandidateResume } from '../engine/candidate-parser.js';

let appInstance = null;

export function initRecruitersView(app) {
    appInstance = app;

    // View elements
    const createBtn = document.getElementById('btn-create-recruiter');
    const modal = document.getElementById('create-recruiter-modal');
    const modalClose = document.getElementById('recruiter-modal-close-btn');
    const modalCancel = document.getElementById('recruiter-modal-cancel');
    const modalSave = document.getElementById('recruiter-modal-save');

    // Form inputs
    const nameInput = document.getElementById('recruiter-name-input');
    const roleInput = document.getElementById('recruiter-role-input');
    const deptInput = document.getElementById('recruiter-dept-input');
    const avatarInput = document.getElementById('recruiter-avatar-input');

    // Drag and Drop Upload elements
    const uploadZone = document.getElementById('resume-upload-zone');
    const fileInput = document.getElementById('resume-file-input');

    // Setup Event Listeners

    // Open/Close Create Modal
    createBtn?.addEventListener('click', () => {
        modal.classList.add('modal-overlay--active');
        nameInput.value = '';
        roleInput.value = '';
        deptInput.value = '';
        avatarInput.selectedIndex = 0;
    });

    const closeModal = () => {
        modal.classList.remove('modal-overlay--active');
    };

    modalClose?.addEventListener('click', closeModal);
    modalCancel?.addEventListener('click', closeModal);

    // Save recruiter profile
    modalSave?.addEventListener('click', () => {
        const name = nameInput.value.trim();
        const role = roleInput.value.trim();
        const dept = deptInput.value.trim();
        const avatar = avatarInput.value;

        if (!name || !role || !dept) {
            appInstance.showToast('⚠️', 'Please fill in all recruiter profile fields');
            return;
        }

        candidateService.addRecruiter(name, role, dept, avatar);
        appInstance.showToast('👥', `Profile created for ${name}`);
        closeModal();
        renderRecruiterList();
    });

    // File selection / dropzone events
    uploadZone?.addEventListener('click', () => fileInput?.click());

    uploadZone?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('upload-zone--active');
        uploadZone.style.borderColor = 'var(--color-accent-indigo)';
        uploadZone.style.background = 'rgba(129, 140, 248, 0.05)';
    });

    const resetUploadZoneStyle = () => {
        uploadZone.style.borderColor = 'var(--color-border)';
        uploadZone.style.background = 'transparent';
    };

    uploadZone?.addEventListener('dragleave', (e) => {
        e.preventDefault();
        resetUploadZoneStyle();
    });

    uploadZone?.addEventListener('drop', (e) => {
        e.preventDefault();
        resetUploadZoneStyle();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleResumeUploads(files);
        }
    });

    fileInput?.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            handleResumeUploads(files);
        }
    });

    // Initial render
    renderRecruiterList();
}

/**
 * Render list of recruiter cards
 */
export function renderRecruiterList() {
    const container = document.getElementById('recruiters-list-container');
    if (!container) return;

    container.innerHTML = '';
    const recruiters = candidateService.getRecruiters();
    const activeRecruiter = candidateService.getActiveRecruiter();

    // Re-verify active panel is shown for selected recruiter
    showActiveRecruiterPanel(activeRecruiter);

    recruiters.forEach(recruiter => {
        const card = document.createElement('div');
        const isActive = recruiter.id === activeRecruiter.id;
        card.className = `recruiter-card ${isActive ? 'recruiter-card--active' : ''}`;
        
        // Count candidates uploaded by this recruiter
        const allCandidates = candidateService.customCandidates || [];
        const count = recruiter.id === 'default' 
            ? 22 + allCandidates.filter(c => c.uploadedBy === 'default').length 
            : allCandidates.filter(c => c.uploadedBy === recruiter.id).length;

        card.innerHTML = `
            <div>
                <div class="recruiter-card__avatar">${recruiter.avatar}</div>
                <div class="recruiter-card__name">${recruiter.name}</div>
                <div class="recruiter-card__role">${recruiter.role}</div>
                <div class="recruiter-card__dept">🏢 ${recruiter.department}</div>
            </div>
            <div>
                <div class="recruiter-card__stats">
                    📂 candidate pool: <strong>${count}</strong>
                </div>
                <div class="recruiter-card__actions">
                    ${recruiter.id !== 'default' ? `<button class="btn btn--ghost btn--sm btn-delete-recruiter" data-id="${recruiter.id}">Delete</button>` : ''}
                    <button class="btn btn--primary btn--sm btn-select-recruiter" data-id="${recruiter.id}">${isActive ? 'Active' : 'Select'}</button>
                </div>
            </div>
        `;

        // Switch profile click
        card.addEventListener('click', (e) => {
            if (e.target.closest('.btn-delete-recruiter')) return;
            selectRecruiter(recruiter.id);
        });

        // Select button handler
        card.querySelector('.btn-select-recruiter').addEventListener('click', (e) => {
            e.stopPropagation();
            selectRecruiter(recruiter.id);
        });

        // Delete button handler
        const deleteBtn = card.querySelector('.btn-delete-recruiter');
        deleteBtn?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete profile for ${recruiter.name}? All their uploaded resumes will be deleted.`)) {
                candidateService.deleteRecruiter(recruiter.id);
                appInstance.showToast('🗑️', `Deleted recruiter profile`);
                renderRecruiterList();
                // If rankings list is active, make sure to invalidate ranking cache
                appInstance.rankingResults = null;
                document.getElementById('nav-results').disabled = true;
                document.getElementById('nav-compare').disabled = true;
                document.getElementById('nav-insights').disabled = true;
            }
        });

        container.appendChild(card);
    });
}

function selectRecruiter(id) {
    candidateService.setActiveRecruiter(id);
    renderRecruiterList();
    appInstance.showToast('👤', `Switched active recruiter to ${candidateService.getActiveRecruiter().name}`);
    
    // Invalidate analysis cache since active pool changed
    appInstance.rankingResults = null;
    document.getElementById('nav-results').disabled = true;
    document.getElementById('nav-compare').disabled = true;
    document.getElementById('nav-insights').disabled = true;
}

function showActiveRecruiterPanel(recruiter) {
    const panel = document.getElementById('active-recruiter-details-panel');
    const heading = document.getElementById('active-recruiter-title-heading');
    if (!panel || !heading) return;

    panel.style.display = 'block';
    heading.innerHTML = `Manage candidates for <span class="gradient-text">${recruiter.name}</span>`;

    renderCandidatePoolList();
}

/**
 * Render active recruiter candidate pool list
 */
function renderCandidatePoolList() {
    const listContainer = document.getElementById('pool-candidates-list');
    const poolDesc = document.getElementById('candidate-pool-desc');
    if (!listContainer || !poolDesc) return;

    listContainer.innerHTML = '';
    const activeRecruiter = candidateService.getActiveRecruiter();
    const candidates = candidateService.getCandidates();

    // Separate default and custom candidates
    const defaultCandidatesCount = 22;
    const customCount = activeRecruiter.id === 'default'
        ? candidateService.customCandidates.length
        : candidateService.customCandidates.filter(c => c.uploadedBy === activeRecruiter.id).length;

    poolDesc.textContent = `${defaultCandidatesCount} system default profiles + ${customCount} custom recruiter uploads.`;

    if (candidates.length === 0) {
        listContainer.innerHTML = `
            <div style="color: var(--color-text-muted); text-align: center; padding: 20px;">
                No candidates available. Upload resumes to get started.
            </div>
        `;
        return;
    }

    candidates.forEach(candidate => {
        const item = document.createElement('div');
        item.className = 'pool-candidate-item';
        
        const isCustom = candidate.id.startsWith('custom_') || candidate.id.startsWith('c_temp_');

        item.innerHTML = `
            <div class="pool-candidate-item__info">
                <span class="pool-candidate-item__avatar">${candidate.avatar || '🧑‍💻'}</span>
                <div>
                    <div class="pool-candidate-item__name">${candidate.name}</div>
                    <div class="pool-candidate-item__title">${candidate.currentTitle} at ${candidate.currentCompany}</div>
                </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span class="badge ${isCustom ? 'badge--success' : 'badge--info'}">${isCustom ? 'Uploaded' : 'Default'}</span>
                ${isCustom ? `<button class="btn btn--ghost btn--sm btn-delete-candidate" data-id="${candidate.id}" style="padding: 4px 8px; font-size: 10px;">Delete</button>` : ''}
            </div>
        `;

        const deleteBtn = item.querySelector('.btn-delete-candidate');
        deleteBtn?.addEventListener('click', () => {
            if (confirm(`Delete candidate ${candidate.name} from this pool?`)) {
                candidateService.deleteCandidate(candidate.id);
                appInstance.showToast('🗑️', `Deleted candidate ${candidate.name}`);
                renderCandidatePoolList();
                renderRecruiterList(); // update statistics count

                // Invalidate analysis cache
                appInstance.rankingResults = null;
                document.getElementById('nav-results').disabled = true;
                document.getElementById('nav-compare').disabled = true;
                document.getElementById('nav-insights').disabled = true;
            }
        });

        listContainer.appendChild(item);
    });
}

/**
 * Handle Drag & Drop and file selection PDF uploads
 */
async function handleResumeUploads(files) {
    const queueContainer = document.getElementById('upload-queue-container');
    const queueList = document.getElementById('upload-queue-list');
    if (!queueContainer || !queueList) return;

    queueContainer.style.display = 'block';

    for (const file of files) {
        if (file.type !== 'application/pdf') {
            appInstance.showToast('❌', `${file.name} is not a PDF file`);
            continue;
        }

        // Add to queue UI
        const queueItem = document.createElement('div');
        queueItem.className = 'upload-queue-item';
        queueItem.innerHTML = `
            <span class="upload-queue-item__name">📄 ${file.name}</span>
            <span class="upload-queue-item__status badge badge--warning">Extracting...</span>
        `;
        queueList.appendChild(queueItem);
        queueList.scrollTop = queueList.scrollHeight; // scroll to bottom

        const statusBadge = queueItem.querySelector('.upload-queue-item__status');

        try {
            // Step 1: Extract PDF text client side
            const text = await extractTextFromPdf(file);
            
            // Step 2: Parse text using AI/NLP engine
            if (statusBadge) {
                statusBadge.textContent = 'Parsing Resume...';
                statusBadge.className = 'upload-queue-item__status badge badge--info';
            }

            const parsedCandidate = await parseCandidateResume(text);

            // Add candidate to active recruiter pool
            candidateService.addCandidate(parsedCandidate);

            // Step 3: Finished
            if (statusBadge) {
                statusBadge.textContent = 'Done ✓';
                statusBadge.className = 'upload-queue-item__status badge badge--success';
            }

            appInstance.showToast('✅', `Parsed and added candidate ${parsedCandidate.name}`);
            
            // Invalidate analysis cache since candidate pool updated
            appInstance.rankingResults = null;
            document.getElementById('nav-results').disabled = true;
            document.getElementById('nav-compare').disabled = true;
            document.getElementById('nav-insights').disabled = true;

        } catch (error) {
            console.error(`Error processing resume ${file.name}:`, error);
            if (statusBadge) {
                statusBadge.textContent = 'Failed ❌';
                statusBadge.className = 'upload-queue-item__status badge badge--danger';
            }
            appInstance.showToast('❌', `Failed to parse ${file.name}: ${error.message}`);
        }
    }

    // Refresh candidate list and recruiter stats count
    renderCandidatePoolList();
    renderRecruiterList();
}

/**
 * PDF.js client-side text extractor
 */
async function extractTextFromPdf(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdfjsLib = window.pdfjsLib || window['pdfjs-dist/build/pdf'];
    if (!pdfjsLib) {
        throw new Error('PDF.js library is not available. Please verify cdn scripts in index.html.');
    }
    
    // Set worker url
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
    
    return text;
}
