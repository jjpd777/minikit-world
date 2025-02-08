
const PRAYER_CATEGORIES = [
    "Mother", "Father", "Son", "Daughter", "Friends", "Health", "Abundance", "Strength"
];

const selectedCategories = new Set();

function initializeCategories() {
    const categoryGrid = document.getElementById('categoryGrid');
    PRAYER_CATEGORIES.forEach(category => {
        const div = document.createElement('div');
        div.className = 'category';
        div.textContent = category;
        div.onclick = () => toggleCategory(div, category);
        categoryGrid.appendChild(div);
    });
}

function toggleCategory(element, category) {
    if (selectedCategories.has(category)) {
        selectedCategories.delete(category);
        element.classList.remove('selected');
    } else {
        selectedCategories.add(category);
        element.classList.add('selected');
    }
}

document.addEventListener('DOMContentLoaded', initializeCategories);
