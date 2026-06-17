// ============================================
// TalentLens — Entry Point
// ============================================

import { TalentLensApp } from './ui/app.js';

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TalentLensApp();
    console.log('🔍 TalentLens initialized');
});
