import { llmClient } from '../engine/llm-api.js';

export function initApiSettings() {
    const modal = document.getElementById('api-settings-modal');
    const closeBtn = document.getElementById('api-modal-close-btn');
    const cancelBtn = document.getElementById('api-modal-cancel');
    const saveBtn = document.getElementById('api-modal-save');
    const input = document.getElementById('api-key-input');
    const settingsBtn = document.getElementById('btn-api-settings');

    const closeModal = () => {
        modal.classList.remove('modal-overlay--active');
    };

    const openModal = () => {
        input.value = llmClient.apiKey;
        modal.classList.add('modal-overlay--active');
    };

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    settingsBtn.addEventListener('click', openModal);

    saveBtn.addEventListener('click', () => {
        const key = input.value.trim();
        llmClient.setApiKey(key);
        closeModal();
    });

    // Close on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // The modal opens only from the header button so it never blocks login.
}
