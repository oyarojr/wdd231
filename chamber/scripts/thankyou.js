// ========================================
// NAIROBI CHAMBER OF COMMERCE - THANK YOU PAGE
// ========================================

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');
const summaryContent = document.getElementById('summaryContent');

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
// PARSE URL PARAMETERS
// ========================================
function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    return {
        firstName: params.get('firstName') || '',
        lastName: params.get('lastName') || '',
        email: params.get('email') || '',
        mobile: params.get('mobile') || '',
        businessName: params.get('businessName') || '',
        membershipLevel: params.get('membershipLevel') || '',
        timestamp: params.get('timestamp') || ''
    };
}

// ========================================
// FORMAT MEMBERSHIP LEVEL
// ========================================
function formatMembershipLevel(level) {
    const levels = {
        'np': 'NP Membership (Non-Profit)',
        'bronze': 'Bronze Membership',
        'silver': 'Silver Membership',
        'gold': 'Gold Membership'
    };
    return levels[level] || level;
}

// ========================================
// FORMAT TIMESTAMP
// ========================================
function formatTimestamp(isoString) {
    if (!isoString) return 'Not available';

    try {
        const date = new Date(isoString);
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Africa/Nairobi'
        };
        return date.toLocaleDateString('en-US', options);
    } catch (error) {
        return isoString;
    }
}

// ========================================
// DISPLAY FORM DATA
// ========================================
function displayFormData() {
    const formData = getUrlParameters();

    // Check if we have form data
    if (!formData.firstName && !formData.lastName && !formData.email) {
        summaryContent.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-lg); color: var(--text-light);">
                <p>No application data found. Please <a href="join.html" style="color: var(--primary); font-weight: 600;">submit the application form</a>.</p>
            </div>
        `;
        return;
    }

    // Create summary items for required fields only
    const summaryHTML = `
        <div class="summary-item">
            <div class="summary-label">First Name</div>
            <div class="summary-value">${formData.firstName}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Last Name</div>
            <div class="summary-value">${formData.lastName}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Email Address</div>
            <div class="summary-value">${formData.email}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Mobile Phone</div>
            <div class="summary-value">${formData.mobile}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Business/Organization</div>
            <div class="summary-value">${formData.businessName}</div>
        </div>
        <div class="summary-item">
            <div class="summary-label">Membership Level</div>
            <div class="summary-value">${formatMembershipLevel(formData.membershipLevel)}</div>
        </div>
        <div class="summary-item" style="grid-column: 1 / -1;">
            <div class="summary-label">Submission Date & Time</div>
            <div class="summary-value">${formatTimestamp(formData.timestamp)}</div>
        </div>
    `;

    summaryContent.innerHTML = summaryHTML;
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Set active navigation link
    setActiveNavLink();

    // Display form data
    displayFormData();
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