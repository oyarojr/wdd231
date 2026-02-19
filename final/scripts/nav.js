// nav.js - Navigation module (ES Module)

const DARK_KEY = 'djs-dark-mode';

export function initNav() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.site-nav');

    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
            hamburger.setAttribute('aria-expanded', String(!isOpen));
            nav.classList.toggle('open', !isOpen);
        });

        // Close nav when a link is clicked (mobile)
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.setAttribute('aria-expanded', 'false');
                nav.classList.remove('open');
            });
        });
    }
}

export function initDarkMode() {
    const toggle = document.querySelector('.dark-mode-toggle');
    if (!toggle) return;

    // Apply saved preference
    const saved = localStorage.getItem(DARK_KEY);
    if (saved === 'true') {
        document.body.classList.add('dark');
        toggle.innerHTML = '☀️ Light';
    }

    toggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark');
        localStorage.setItem(DARK_KEY, String(isDark));
        toggle.innerHTML = isDark ? '☀️ Light' : '🌙 Dark';
    });
}