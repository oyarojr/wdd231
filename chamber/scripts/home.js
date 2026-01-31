// ========================================
// NAIROBI CHAMBER OF COMMERCE - HOME PAGE
// ========================================

// Configuration
const WEATHER_CONFIG = {
    apiKey: 'YOUR_OPENWEATHERMAP_API_KEY', // Replace with actual API key
    city: 'Nairobi',
    countryCode: 'KE',
    units: 'metric'
};

// DOM Elements
const weatherContainer = document.getElementById('weatherContainer');
const spotlightsContainer = document.getElementById('spotlightsContainer');
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

    // Update aria-expanded
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
// WEATHER API FUNCTIONS
// ========================================

// Get weather icon emoji based on condition
function getWeatherIcon(weatherCode, description) {
    const code = weatherCode.toString();

    // Thunderstorm
    if (code.startsWith('2')) return '⛈️';

    // Drizzle
    if (code.startsWith('3')) return '🌦️';

    // Rain
    if (code.startsWith('5')) return '🌧️';

    // Snow
    if (code.startsWith('6')) return '❄️';

    // Atmosphere (fog, mist, etc.)
    if (code.startsWith('7')) return '🌫️';

    // Clear
    if (code === '800') {
        const hour = new Date().getHours();
        return (hour >= 6 && hour < 18) ? '☀️' : '🌙';
    }

    // Clouds
    if (code.startsWith('8')) {
        if (code === '801' || code === '802') return '⛅';
        return '☁️';
    }

    return '🌤️';
}

// Format date for forecast
function formatForecastDate(timestamp) {
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Fetch current weather and forecast
async function fetchWeatherData() {
    try {
        // Note: Using a real API key is required for production
        // For demonstration, we'll show sample data structure

        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${WEATHER_CONFIG.city},${WEATHER_CONFIG.countryCode}&units=${WEATHER_CONFIG.units}&appid=${WEATHER_CONFIG.apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${WEATHER_CONFIG.city},${WEATHER_CONFIG.countryCode}&units=${WEATHER_CONFIG.units}&appid=${WEATHER_CONFIG.apiKey}`;

        // Fetch both current weather and forecast
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather data unavailable');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);

    } catch (error) {
        console.error('Error fetching weather:', error);
        displayWeatherError();
    }
}

// Display weather data
function displayWeather(current, forecast) {
    const icon = getWeatherIcon(current.weather[0].id, current.weather[0].description);
    const temp = Math.round(current.main.temp);
    const description = current.weather[0].description;

    // Get daily forecast (one per day for next 3 days)
    const dailyForecasts = getDailyForecasts(forecast.list);

    const weatherHTML = `
        <div class="weather-current">
            <div class="weather-icon">${icon}</div>
            <h4 class="weather-temp">${temp}°C</h4>
            <p class="weather-description">${description}</p>
        </div>
        <div class="weather-forecast">
            ${dailyForecasts.map(day => `
                <div class="forecast-day">
                    <div class="forecast-date">${day.date}</div>
                    <div class="forecast-icon">${day.icon}</div>
                    <div class="forecast-temp">${day.temp}°C</div>
                </div>
            `).join('')}
        </div>
    `;

    weatherContainer.innerHTML = weatherHTML;
}

// Get daily forecasts (one per day)
function getDailyForecasts(forecastList) {
    const dailyData = {};
    const today = new Date().toDateString();

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000);
        const dateString = date.toDateString();

        // Skip today and limit to 3 days
        if (dateString !== today && Object.keys(dailyData).length < 3) {
            if (!dailyData[dateString]) {
                dailyData[dateString] = {
                    date: formatForecastDate(item.dt),
                    temp: Math.round(item.main.temp),
                    icon: getWeatherIcon(item.weather[0].id, item.weather[0].description),
                    description: item.weather[0].description
                };
            }
        }
    });

    return Object.values(dailyData);
}

// Display weather error
function displayWeatherError() {
    weatherContainer.innerHTML = `
        <div class="weather-error">
            <p>Unable to load weather data</p>
            <p style="font-size: 0.9rem; margin-top: 0.5rem;">Please check your API key configuration</p>
        </div>
    `;
}

// ========================================
// MEMBER SPOTLIGHTS FUNCTIONS
// ========================================

// Get company icon
function getCompanyIcon(companyName) {
    const name = companyName.toLowerCase();
    if (name.includes('bank') || name.includes('equity')) return '🏦';
    if (name.includes('coffee')) return '☕';
    if (name.includes('brew') || name.includes('tusker')) return '🍺';
    if (name.includes('telecom') || name.includes('safari')) return '📱';
    if (name.includes('group') || name.includes('wananchi')) return '📡';
    if (name.includes('market') || name.includes('nakumatt')) return '🛒';
    return '🏢';
}

// Get membership level class and text
function getMembershipClass(level) {
    return level === 3 ? 'gold' : level === 2 ? 'silver' : 'member';
}

function getMembershipText(level) {
    return level === 3 ? 'Gold Member' : level === 2 ? 'Silver Member' : 'Member';
}

// Create spotlight card HTML
function createSpotlightCard(member) {
    const membershipClass = getMembershipClass(member.membershipLevel);
    const membershipText = getMembershipText(member.membershipLevel);
    const icon = getCompanyIcon(member.name);

    return `
        <article class="spotlight-card">
            <div class="spotlight-header">
                <div class="spotlight-logo">
                    <span class="spotlight-logo-icon">${icon}</span>
                </div>
                <div class="spotlight-info">
                    <h4 class="spotlight-name">${member.name}</h4>
                    <span class="spotlight-membership ${membershipClass}">${membershipText}</span>
                </div>
            </div>
            <div class="spotlight-details">
                <div class="spotlight-detail">
                    <span class="spotlight-detail-icon">📍</span>
                    <span class="spotlight-detail-text">${member.address}, ${member.city}</span>
                </div>
                <div class="spotlight-detail">
                    <span class="spotlight-detail-icon">📞</span>
                    <span class="spotlight-detail-text">${member.phone}</span>
                </div>
                <div class="spotlight-detail">
                    <span class="spotlight-detail-icon">🌐</span>
                    <span class="spotlight-detail-text">
                        <a href="${member.website}" target="_blank" rel="noopener">
                            ${member.website.replace('https://', '').replace('http://', '')}
                        </a>
                    </span>
                </div>
            </div>
            <a href="${member.website}" target="_blank" rel="noopener" class="spotlight-link">
                Visit Website →
            </a>
        </article>
    `;
}

// Fetch and display member spotlights
async function fetchAndDisplaySpotlights() {
    try {
        spotlightsContainer.innerHTML = '<div class="loading">Loading featured members...</div>';

        const response = await fetch('data/members.json');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const members = await response.json();

        // Filter for Gold (3) and Silver (2) members only
        const premiumMembers = members.filter(member =>
            member.membershipLevel === 3 || member.membershipLevel === 2
        );

        if (premiumMembers.length === 0) {
            throw new Error('No premium members found');
        }

        // Randomly select 2-3 members
        const numberOfSpotlights = window.innerWidth >= 1024 ? 3 : 2;
        const selectedMembers = getRandomMembers(premiumMembers, numberOfSpotlights);

        // Clear loading state
        spotlightsContainer.innerHTML = '';

        // Create and append spotlight cards
        selectedMembers.forEach(member => {
            spotlightsContainer.innerHTML += createSpotlightCard(member);
        });

        // Add staggered animation
        const cards = document.querySelectorAll('.spotlight-card');
        cards.forEach((card, index) => {
            card.style.animation = `fadeInUp 0.6s ease-out ${0.15 * index}s both`;
        });

    } catch (error) {
        console.error('Error fetching spotlights:', error);
        spotlightsContainer.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-light);">
                <p>Unable to load featured members</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Error: ${error.message}</p>
            </div>
        `;
    }
}

// Get random members from array
function getRandomMembers(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
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

    // Fetch weather data
    if (weatherContainer) {
        fetchWeatherData();
    }

    // Fetch and display member spotlights
    if (spotlightsContainer) {
        fetchAndDisplaySpotlights();
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
            hamburger.setAttribute('aria-expanded', 'false');
        }

        // Reload spotlights if crossing 1024px threshold
        const spotlights = document.querySelectorAll('.spotlight-card');
        if ((window.innerWidth >= 1024 && spotlights.length === 2) ||
            (window.innerWidth < 1024 && spotlights.length === 3)) {
            fetchAndDisplaySpotlights();
        }
    }, 250);
});