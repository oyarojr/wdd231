// ========================================
// NAIROBI CHAMBER OF COMMERCE - DISCOVER PAGE
// ========================================

// Import attractions data
import attractions from '../data/attractions.mjs';

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navigation = document.querySelector('.navigation');
const visitorMessage = document.getElementById('visitorMessage');
const attractionsGallery = document.getElementById('attractionsGallery');

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
// VISITOR MESSAGE USING localStorage
// ========================================
function displayVisitorMessage() {
    const lastVisit = localStorage.getItem('lastVisitDate');
    const currentVisit = Date.now();
    let message = '';

    if (!lastVisit) {
        // First visit
        message = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifference = currentVisit - parseInt(lastVisit);
        const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (daysDifference < 1) {
            // Less than a day
            message = "Back so soon! Awesome!";
        } else if (daysDifference === 1) {
            // Exactly 1 day
            message = "You last visited 1 day ago.";
        } else {
            // More than 1 day
            message = `You last visited ${daysDifference} days ago.`;
        }
    }

    // Store current visit date
    localStorage.setItem('lastVisitDate', currentVisit.toString());

    // Display message
    if (visitorMessage) {
        visitorMessage.textContent = message;
    }
}

// ========================================
// LAZY LOADING IMPLEMENTATION
// ========================================
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                const src = img.getAttribute('data-src');

                if (src) {
                    img.src = src;
                    img.removeAttribute('data-src');
                    img.classList.add('loaded');
                }

                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });

    // Observe all images with data-src attribute
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// CREATE ATTRACTION CARD
// ========================================
function createAttractionCard(attraction) {
    const card = document.createElement('article');
    card.className = 'attraction-card';

    card.innerHTML = `
        <figure class="card-figure">
            <img 
                class="card-image" 
                data-src="${attraction.image}" 
                alt="${attraction.imageAlt}"
                width="300"
                height="200">
        </figure>
        <div class="card-content">
            <h2 class="card-title">${attraction.name}</h2>
            <address class="card-address">${attraction.address}</address>
            <p class="card-description">${attraction.description}</p>
            <button class="learn-more-btn" aria-label="Learn more about ${attraction.name}">
                Learn More →
            </button>
        </div>
    `;

    return card;
}

// ========================================
// DISPLAY ATTRACTIONS
// ========================================
function displayAttractions() {
    try {
        // Clear loading state
        attractionsGallery.innerHTML = '';

        // Create and append attraction cards
        attractions.forEach(attraction => {
            const card = createAttractionCard(attraction);
            attractionsGallery.appendChild(card);
        });

        // Setup lazy loading for images
        setupLazyLoading();

        // Add staggered animation
        const cards = document.querySelectorAll('.attraction-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.6s ease-out ${0.1 * index}s both`;
        });

    } catch (error) {
        console.error('Error displaying attractions:', error);
        attractionsGallery.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: var(--text-light);">
                <p>Sorry, we couldn't load the attractions.</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Error: ${error.message}</p>
            </div>
        `;
    }
}

// ========================================
// ADD FADEUP ANIMATION
// ========================================
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Set active navigation link
    setActiveNavLink();

    // Display visitor message
    displayVisitorMessage();

    // Display attractions
    displayAttractions();
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