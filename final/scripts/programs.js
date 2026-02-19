// programs.js - Programs page module (ES Module)
import { fetchPrograms, getCategories, filterByCategory } from './data.js';
import { openModal, initModal } from './modal.js';
import { initNav, initDarkMode } from './nav.js';

let allPrograms = [];

const CATEGORY_ICONS = {
    'Core Academic': '📚',
    'Enrichment': '🎨',
    'Health & Wellness': '⚽',
    'Technology': '💻',
    'Extracurricular': '🏆',
};

document.addEventListener('DOMContentLoaded', async () => {
    initNav();
    initDarkMode();
    initModal();
    updateFooterYear();
    await loadPrograms();
});

async function loadPrograms() {
    const grid = document.getElementById('programs-grid');
    const filterBar = document.getElementById('filter-bar');

    grid.innerHTML = `<div class="loading" style="grid-column:1/-1"><div class="loading-spinner"></div><p>Loading programs...</p></div>`;

    try {
        allPrograms = await fetchPrograms();
        renderFilterButtons(filterBar, allPrograms);
        renderPrograms(allPrograms);
    } catch (error) {
        grid.innerHTML = `<div class="no-results" style="grid-column:1/-1"><p>⚠️ Failed to load programs. Please try again.</p></div>`;
    }
}

function renderFilterButtons(container, programs) {
    const categories = getCategories(programs);

    container.innerHTML = categories.map(cat =>
        `<button class="filter-btn ${cat === 'All' ? 'active' : ''}" data-category="${cat}">${cat}</button>`
    ).join('');

    container.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filtered = filterByCategory(allPrograms, btn.dataset.category);
            renderPrograms(filtered);
        });
    });
}

function renderPrograms(programs) {
    const grid = document.getElementById('programs-grid');

    if (programs.length === 0) {
        grid.innerHTML = `<div class="no-results" style="grid-column:1/-1"><p>No programs found in this category.</p></div>`;
        return;
    }

    grid.innerHTML = programs.map(program => `
    <article class="program-card" data-id="${program.id}" role="button" tabindex="0" aria-label="View details for ${program.name}">
      <div class="program-card-header">
        <h3>${CATEGORY_ICONS[program.category] || '📋'} ${program.name}</h3>
        <span class="category-badge">${program.category}</span>
      </div>
      <div class="program-card-body">
        <p>${program.description}</p>
        <div class="program-info">
          <div class="info-item">
            <div class="info-label">Grade</div>
            <div class="info-value">${program.grade}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Capacity</div>
            <div class="info-value">${program.capacity} pupils</div>
          </div>
          <div class="info-item">
            <div class="info-label">Teacher</div>
            <div class="info-value">${program.teacher.split(' ').slice(0, 2).join(' ')}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Days</div>
            <div class="info-value">${program.schedule.split(',')[0]}</div>
          </div>
        </div>
        <div class="skills-list">
          ${program.skills.map(s => `<span class="skill-tag">${s}</span>`).join('')}
        </div>
      </div>
    </article>
  `).join('');

    // Attach click/keyboard listeners
    grid.querySelectorAll('.program-card').forEach(card => {
        const id = parseInt(card.dataset.id);
        const program = allPrograms.find(p => p.id === id);

        card.addEventListener('click', () => openModal(program));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openModal(program);
            }
        });
    });
}

function updateFooterYear() {
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
}