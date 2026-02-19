// form-action.js - Display submitted form data (ES Module)
import { initNav, initDarkMode } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initDarkMode();
    displayFormData();
});

function displayFormData() {
    const params = new URLSearchParams(window.location.search);
    const container = document.getElementById('form-data');

    const fields = [
        { key: 'parent-name', label: 'Parent / Guardian Name' },
        { key: 'email', label: 'Email Address' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'child-name', label: "Child's Name" },
        { key: 'child-age', label: "Child's Age" },
        { key: 'grade', label: 'Grade Applying For' },
        { key: 'inquiry', label: 'Inquiry Type' },
        { key: 'message', label: 'Message' },
    ];

    const rows = fields
        .filter(f => params.has(f.key) && params.get(f.key).trim() !== '')
        .map(f => `
      <div class="data-row">
        <span class="data-label">${f.label}</span>
        <span class="data-value">${escapeHtml(params.get(f.key))}</span>
      </div>
    `).join('');

    if (rows) {
        container.innerHTML = rows;
    } else {
        container.innerHTML = '<p>No form data received. <a href="contact.html">Go back to the form.</a></p>';
    }
}

function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}