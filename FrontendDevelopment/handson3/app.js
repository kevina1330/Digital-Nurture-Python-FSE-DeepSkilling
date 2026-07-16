// app.js - Main application using ES6 modules
import courses from './data.js';

// ============================================================
// TASK 1: ES6+ Syntax Practice
// ============================================================

console.log('===== TASK 1: ES6+ Syntax Practice =====');

// 1. Destructuring and map
const courseStrings = courses.map(({ name, code, credits }) => 
    `${code} — ${name} (${credits} credits)`
);
console.log('Formatted course strings:', courseStrings);

// 2. Filter - courses with credits >= 4
const advancedCourses = courses.filter(({ credits }) => credits >= 4);
console.log('Advanced courses (4+ credits):', advancedCourses);
console.log('Count of advanced courses:', advancedCourses.length);

// 3. Reduce - total credits
const totalCredits = courses.reduce((sum, { credits }) => sum + credits, 0);
console.log('Total credits:', totalCredits);

// 4. Arrow function with template literal
const formatCourse = (course) => `${course.code}: ${course.name} (${course.credits} credits)`;
console.log('Formatted using arrow function:', courses.map(formatCourse));

// ============================================================
// TASK 2: DOM Selection & Dynamic Rendering
// ============================================================

console.log('\n===== TASK 2: DOM Selection & Dynamic Rendering =====');

// Select DOM elements
const courseGrid = document.querySelector('.course-grid');
const totalCreditsDisplay = document.getElementById('total-credits');
const selectedCourseDisplay = document.getElementById('selected-course');

// Function to render courses
function renderCourses(courseList = courses) {
    console.log('Rendering', courseList.length, 'courses');
    
    // Clear the grid
    courseGrid.innerHTML = '';
    
    // Use DocumentFragment for batch DOM updates (better performance)
    const fragment = document.createDocumentFragment();
    
    courseList.forEach(course => {
        // Create article element
        const article = document.createElement('article');
        article.className = 'course-card';
        article.dataset.id = course.id;
        
        // Build inner HTML using template literal
        article.innerHTML = `
            <h3>${course.name}</h3>
            <p><strong>Code:</strong> ${course.code}</p>
            <p><strong>Grade:</strong> ${course.grade}</p>
            <span class="credits">Credits: ${course.credits}</span>
        `;
        
        fragment.appendChild(article);
    });
    
    // Append all cards at once
    courseGrid.appendChild(fragment);
    
    // Update total credits
    const total = courseList.reduce((sum, c) => sum + c.credits, 0);
    if (totalCreditsDisplay) {
        totalCreditsDisplay.textContent = `Total Credits: ${total}`;
    }
}

// Initial render
renderCourses();

// ============================================================
// TASK 3: Event Listeners & Interactivity
// ============================================================

console.log('\n===== TASK 3: Event Listeners & Interactivity =====');

// 1. Search functionality
const searchInput = document.getElementById('search-courses');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        console.log('Searching for:', searchTerm);
        
        const filtered = courses.filter(({ name }) => 
            name.toLowerCase().includes(searchTerm)
        );
        
        renderCourses(filtered);
        
        // Update selected course display
        if (selectedCourseDisplay) {
            selectedCourseDisplay.textContent = `Found ${filtered.length} course(s) matching "${searchTerm}"`;
        }
    });
}

// 2. Sort button
const sortButton = document.getElementById('sort-credits');
if (sortButton) {
    sortButton.addEventListener('click', () => {
        console.log('Sorting by credits (descending)');
        
        const sorted = [...courses].sort((a, b) => b.credits - a.credits);
        renderCourses(sorted);
        
        if (selectedCourseDisplay) {
            selectedCourseDisplay.textContent = 'Courses sorted by credits (highest first)';
        }
    });
}

// 3. Event delegation for course card clicks
if (courseGrid) {
    courseGrid.addEventListener('click', (e) => {
        // Find the closest course-card element
        const card = e.target.closest('.course-card');
        
        if (card) {
            const courseId = parseInt(card.dataset.id);
            const course = courses.find(c => c.id === courseId);
            
            if (course) {
                console.log('Course clicked:', course.name);
                
                // Update selected course display
                if (selectedCourseDisplay) {
                    selectedCourseDisplay.innerHTML = `
                        <strong>Selected Course:</strong> ${course.name} 
                        (${course.code}) - Grade: ${course.grade}
                    `;
                }
                
                // Show alert
                alert(`${course.name} - Grade: ${course.grade}`);
            }
        }
    });
}

// Log completion
console.log('✅ Hands-On 3 completed successfully!');
console.log('Features implemented:');
console.log('  - ES6+ features (destructuring, map, filter, reduce, arrow functions, template literals)');
console.log('  - Dynamic DOM rendering with DocumentFragment');
console.log('  - Search with real-time filtering');
console.log('  - Sort by credits');
console.log('  - Event delegation for card clicks');