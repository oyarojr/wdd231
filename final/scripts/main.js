// main.js - Main entry point (ES Module)
import { initNav, initDarkMode } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initDarkMode();
    updateFooterYear();
});

function updateFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}