// contact.js - Contact page module (ES Module)
import { initNav, initDarkMode } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initDarkMode();
    updateFooterYear();
    initFormValidation();
});

function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        // Native form action handles submission; we just do extra UX
        const btn = form.querySelector('button[type="submit"]');
        if (btn) {
            btn.textContent = 'Submitting...';
            btn.disabled = true;
        }
    });
}

function updateFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}