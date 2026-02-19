// data.js - Data fetching module (ES Module)

/**
 * Fetch programs from local JSON file
 * @returns {Promise<Array>} Array of program objects
 */
export async function fetchPrograms() {
    try {
        const response = await fetch('./data/programs.json');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data.programs;
    } catch (error) {
        console.error('Failed to fetch programs data:', error);
        throw error;
    }
}

/**
 * Get unique categories from programs array
 * @param {Array} programs
 * @returns {Array} unique categories
 */
export function getCategories(programs) {
    const cats = programs.map(p => p.category);
    return ['All', ...new Set(cats)];
}

/**
 * Filter programs by category
 * @param {Array} programs
 * @param {string} category
 * @returns {Array}
 */
export function filterByCategory(programs, category) {
    if (category === 'All') return programs;
    return programs.filter(p => p.category === category);
}