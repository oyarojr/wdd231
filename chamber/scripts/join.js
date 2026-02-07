// ========================================
// NAIROBI CHAMBER OF COMMERCE - JOIN PAGE
// ========================================

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');
const membershipForm = document.getElementById('membershipForm');
const timestampField = document.getElementById('timestamp');
const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
const modals = document.querySelectorAll('.modal');
const modalCloseButtons = document.querySelectorAll('.modal-close');

// ========================================
// MOBILE MENU TOGGLE
// ========================================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navigation.classList.toggle('active');
    
    const isExpanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', isExpanded);
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth < 768) {
        if (!hamburger.contains(e.target) && !navigation.contains(e.target)) {
            hamburger.classList.remove('active');
            navigation.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }
});

// ========================================
// ACTIVE NAV LINK HIGHLIGHTING
// ========================================
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========================================
// TIMESTAMP HANDLING
// ========================================
function setTimestamp() {
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toISOString();
    }
}

// ========================================
// MODAL FUNCTIONALITY
// ========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        // Focus on close button for accessibility
        const closeButton = modal.querySelector('.modal-close');
        if (closeButton) {
            closeButton.focus();
        }
    }
}

function closeModal(modal) {
    if (modal) {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = ''; // Restore scrolling
    }
}

function closeAllModals() {
    modals.forEach(modal => closeModal(modal));
}

// Event listeners for learn more buttons
learnMoreButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const modalId = button.getAttribute('data-modal');
        openModal(modalId);
    });
});

// Event listeners for modal close buttons
modalCloseButtons.forEach(button => {
    button.addEventListener('click', () => {
        const modal = button.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside the modal content
modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// ========================================
// FORM VALIDATION & SUBMISSION
// ========================================
if (membershipForm) {
    membershipForm.addEventListener('submit', (e) => {
        // Set timestamp before submission
        setTimestamp();
        
        // Basic validation is handled by HTML5 attributes
        // Additional custom validation can be added here if needed
        
        // The form will submit to thankyou.html via GET method
        // URL parameters will contain the form data
    });
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Set active navigation link
    setActiveNavLink();
    
    // Set initial timestamp
    setTimestamp();
    
    // Initialize modals as hidden
    modals.forEach(modal => {
        modal.setAttribute('aria-hidden', 'true');
    });
});

// ========================================
// HANDLE WINDOW RESIZE
// ========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Reset mobile menu on larger screens
        if (window.innerWidth >= 768) {
            hamburger.classList.remove('active');
            navigation.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }, 250);
});