// modal.js - Modal dialog module (ES Module)

const overlay = document.getElementById('modal-overlay');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeBtn = document.getElementById('modal-close');

/**
 * Open modal with program detail data
 * @param {Object} program
 */
export function openModal(program) {
  if (!overlay) return;

  modalTitle.textContent = program.name;

  modalContent.innerHTML = `
    <div class="djs-modal-section">
      <h4>Program Overview</h4>
      <p>${program.description}</p>
    </div>
    <div class="djs-modal-section">
      <h4>Details</h4>
      <div class="djs-modal-detail-grid">
        <div class="djs-modal-detail">
          <span class="label">Grade Level</span>
          <span class="value">${program.grade}</span>
        </div>
        <div class="djs-modal-detail">
          <span class="label">Category</span>
          <span class="value">${program.category}</span>
        </div>
        <div class="djs-modal-detail">
          <span class="label">Teacher</span>
          <span class="value">${program.teacher}</span>
        </div>
        <div class="djs-modal-detail">
          <span class="label">Capacity</span>
          <span class="value">${program.capacity} students</span>
        </div>
      </div>
    </div>
    <div class="djs-modal-section">
      <h4>Schedule</h4>
      <p><strong>${program.schedule}</strong></p>
    </div>
    <div class="djs-modal-section">
      <h4>Skills Developed</h4>
      <div class="skills-list">
        ${program.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
      </div>
    </div>
  `;

  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  closeBtn.focus();
  document.body.style.overflow = 'hidden';
}

/**
 * Close modal
 */
export function closeModal() {
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Initialize modal event listeners
 */
export function initModal() {
  if (!overlay) return;

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}