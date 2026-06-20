// ============================================
// TalentLens — Candidate & Recruiter Service
// ============================================

import { CANDIDATES } from './candidates.js';

class CandidateService {
    constructor() {
        this.storageKeyCandidates = 'talentlens_custom_candidates';
        this.storageKeyRecruiters = 'talentlens_recruiters';
        this.storageKeyActiveRecruiter = 'talentlens_active_recruiter';

        this.init();
    }

    init() {
        // Load custom candidates
        try {
            this.customCandidates = JSON.parse(localStorage.getItem(this.storageKeyCandidates)) || [];
        } catch (e) {
            console.error("Error loading candidates from localStorage:", e);
            this.customCandidates = [];
        }

        // Load modifications for default candidates
        try {
            this.modifiedDefaults = JSON.parse(localStorage.getItem('talentlens_modified_defaults')) || {};
        } catch (e) {
            this.modifiedDefaults = {};
        }
        
        // Load recruiters. If none exist, create defaults.
        try {
            this.recruiters = JSON.parse(localStorage.getItem(this.storageKeyRecruiters));
        } catch (e) {
            console.error("Error loading recruiters from localStorage:", e);
            this.recruiters = null;
        }

        if (!this.recruiters || !Array.isArray(this.recruiters) || this.recruiters.length === 0) {
            this.recruiters = [
                { id: 'default', name: 'Global Pool', role: 'System Recruiter', department: 'All Departments', avatar: '🌐' },
                { id: 'recruiter_1', name: 'Sarah Jenkins', role: 'Senior Tech Recruiter', department: 'Engineering', avatar: '👩‍💼' },
                { id: 'recruiter_2', name: 'Michael Chen', role: 'Executive Recruiter', department: 'Leadership', avatar: '👨‍💼' }
            ];
            localStorage.setItem(this.storageKeyRecruiters, JSON.stringify(this.recruiters));
        }

        // Active recruiter
        this.activeRecruiterId = localStorage.getItem(this.storageKeyActiveRecruiter) || 'default';
        if (!this.recruiters.some(r => r.id === this.activeRecruiterId)) {
            this.activeRecruiterId = 'default';
            localStorage.setItem(this.storageKeyActiveRecruiter, 'default');
        }
    }

    getRecruiters() {
        return this.recruiters;
    }

    getActiveRecruiter() {
        return this.recruiters.find(r => r.id === this.activeRecruiterId) || this.recruiters[0];
    }

    setActiveRecruiter(id) {
        if (this.recruiters.some(r => r.id === id)) {
            this.activeRecruiterId = id;
            localStorage.setItem(this.storageKeyActiveRecruiter, id);
            return true;
        }
        return false;
    }

    addRecruiter(name, role, department, avatar) {
        const id = 'recruiter_' + Date.now();
        const newRecruiter = { id, name, role, department, avatar: avatar || '🧑‍💼' };
        this.recruiters.push(newRecruiter);
        localStorage.setItem(this.storageKeyRecruiters, JSON.stringify(this.recruiters));
        return newRecruiter;
    }

    deleteRecruiter(id) {
        if (id === 'default') return false;
        
        // Delete candidates uploaded by this recruiter
        this.customCandidates = this.customCandidates.filter(c => c.uploadedBy !== id);
        localStorage.setItem(this.storageKeyCandidates, JSON.stringify(this.customCandidates));

        // Delete recruiter
        this.recruiters = this.recruiters.filter(r => r.id !== id);
        localStorage.setItem(this.storageKeyRecruiters, JSON.stringify(this.recruiters));

        if (this.activeRecruiterId === id) {
            this.setActiveRecruiter('default');
        }
        return true;
    }

    getCandidates() {
        const activeId = this.activeRecruiterId;
        
        // Custom candidates for active recruiter (or all if active is 'default')
        let recruiterCustom = [];
        if (activeId === 'default') {
            recruiterCustom = this.customCandidates;
        } else {
            recruiterCustom = this.customCandidates.filter(c => c.uploadedBy === activeId);
        }

        // Apply modifications to default candidates
        const modifiedDefaultsList = CANDIDATES.map(c => {
            if (this.modifiedDefaults[c.id]) {
                return { ...c, ...this.modifiedDefaults[c.id] };
            }
            return c;
        });
        
        return [...modifiedDefaultsList, ...recruiterCustom];
    }

    addCandidate(candidateData) {
        const candidate = {
            ...candidateData,
            id: candidateData.id || ('custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5)),
            uploadedBy: this.activeRecruiterId,
            uploadedAt: new Date().toISOString()
        };

        this.customCandidates.push(candidate);
        localStorage.setItem(this.storageKeyCandidates, JSON.stringify(this.customCandidates));
        return candidate;
    }

    updateCandidate(id, updatedData) {
        // Check if it's a default candidate
        const isDefault = CANDIDATES.some(c => c.id === id);
        if (isDefault) {
            this.modifiedDefaults[id] = {
                ...(this.modifiedDefaults[id] || {}),
                ...updatedData
            };
            localStorage.setItem('talentlens_modified_defaults', JSON.stringify(this.modifiedDefaults));
            return { id, ...updatedData };
        }

        // Otherwise custom candidate
        const index = this.customCandidates.findIndex(c => c.id === id);
        if (index !== -1) {
            this.customCandidates[index] = {
                ...this.customCandidates[index],
                ...updatedData
            };
            localStorage.setItem(this.storageKeyCandidates, JSON.stringify(this.customCandidates));
            return this.customCandidates[index];
        }
        return null;
    }

    deleteCandidate(id) {
        this.customCandidates = this.customCandidates.filter(c => c.id !== id);
        localStorage.setItem(this.storageKeyCandidates, JSON.stringify(this.customCandidates));
        if (this.modifiedDefaults[id]) {
            delete this.modifiedDefaults[id];
            localStorage.setItem('talentlens_modified_defaults', JSON.stringify(this.modifiedDefaults));
        }
        return true;
    }
}

export const candidateService = new CandidateService();
