// ========================================
// NAIROBI CHAMBER OF COMMERCE - DIRECTORY
// ========================================

// DOM Elements
const memberDirectory = document.getElementById('memberDirectory');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');

// ========================================
// FOOTER DATE MANAGEMENT
// ========================================
function updateFooterDates() {
    const currentYear = new Date().getFullYear();
    const copyrightYear = document.getElementById('copyrightYear');
    if (copyrightYear) {
        copyrightYear.textContent = currentYear;
    }

    const lastModified = document.getElementById('lastModified');
    if (lastModified) {
        lastModified.textContent = document.lastModified;
    }
}

// ========================================
// MOBILE MENU TOGGLE
// ========================================
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navigation.classList.toggle('active');
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
        }
    }
});

// ========================================
// VIEW TOGGLE - GRID vs LIST
// ========================================
function switchView(view) {
    if (view === 'grid') {
        memberDirectory.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        localStorage.setItem('preferredView', 'grid');
    } else if (view === 'list') {
        memberDirectory.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        localStorage.setItem('preferredView', 'list');
    }
}

// Event listeners for view buttons
if (gridViewBtn) {
    gridViewBtn.addEventListener('click', () => switchView('grid'));
}

if (listViewBtn) {
    listViewBtn.addEventListener('click', () => switchView('list'));
}

// Load preferred view from localStorage
function loadPreferredView() {
    const preferredView = localStorage.getItem('preferredView') || 'grid';
    switchView(preferredView);
}

// ========================================
// MEMBER DATA FETCHING & DISPLAY
// ========================================

function getMembershipLevel(level) {
    switch (level) {
        case 3:
            return 'gold';
        case 2:
            return 'silver';
        case 1:
            return 'member';
        default:
            return 'member';
    }
}

function getMembershipText(level) {
    switch (level) {
        case 3:
            return 'Gold Member';
        case 2:
            return 'Silver Member';
        case 1:
            return 'Member';
        default:
            return 'Member';
    }
}

function getCompanyIcon(companyName) {
    // Return emoji icons based on company type
    const name = companyName.toLowerCase();
    if (name.includes('bank') || name.includes('equity')) return '🏦';
    if (name.includes('coffee')) return '☕';
    if (name.includes('brew') || name.includes('tusker')) return '🍺';
    if (name.includes('telecom') || name.includes('safari')) return '📱';
    if (name.includes('group') || name.includes('wananchi')) return '📡';
    if (name.includes('market') || name.includes('nakumatt')) return '🛒';
    return '🏢';
}

function createMemberCard(member) {
    const membershipClass = getMembershipLevel(member.membershipLevel);
    const membershipText = getMembershipText(member.membershipLevel);
    const icon = getCompanyIcon(member.name);

    return `
        <article class="member-card">
            <div class="membership-badge ${membershipClass}">${membershipText}</div>
            <div class="member-image-container">
                <span class="member-image-placeholder">${icon}</span>
            </div>
            <div class="member-info">
                <h2>${member.name}</h2>
                <p><strong>📍</strong> ${member.address}, ${member.city}</p>
                <p><strong>📞</strong> ${member.phone}</p>
                <p><strong>🌐</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website.replace('https://', '').replace('http://', '')}</a></p>
                ${member.description ? `<p style="margin-top: 0.75rem; color: var(--text-light); font-style: italic;">${member.description}</p>` : ''}
                ${member.founded ? `<p><strong>Founded:</strong> ${member.founded}</p>` : ''}
                <a href="${member.website}" target="_blank" rel="noopener" class="member-link">Visit Website →</a>
            </div>
        </article>
    `;
}

async function fetchAndDisplayMembers() {
    try {
        // Show loading state
        memberDirectory.innerHTML = '<div class="loading">Loading members...</div>';

        // Fetch the JSON data
        const response = await fetch('data/members.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const members = await response.json();

        // Sort members by membership level (highest first) then by name
        members.sort((a, b) => {
            if (b.membershipLevel !== a.membershipLevel) {
                return b.membershipLevel - a.membershipLevel;
            }
            return a.name.localeCompare(b.name);
        });

        // Clear loading state
        memberDirectory.innerHTML = '';

        // Create and append member cards
        members.forEach(member => {
            memberDirectory.innerHTML += createMemberCard(member);
        });

        // Add staggered animation to cards
        const cards = document.querySelectorAll('.member-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.6s ease-out ${0.1 * index}s both`;
        });

    } catch (error) {
        console.error('Error fetching members:', error);
        memberDirectory.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <p>Sorry, we couldn't load the member directory.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Error: ${error.message}</p>
            </div>
        `;
    }
}

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
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Update footer dates
    updateFooterDates();

    // Set active navigation link
    setActiveNavLink();

    // Load preferred view
    loadPreferredView();

    // Fetch and display members
    if (memberDirectory) {
        fetchAndDisplayMembers();
    }
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
        }
    }, 250);
});