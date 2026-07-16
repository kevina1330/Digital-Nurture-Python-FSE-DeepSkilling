// app.js - Async JavaScript & API Integration

// ============================================================
// TASK 1: Promises and async/await
// ============================================================

console.log('===== TASK 1: Promises and async/await =====');

// 1.1 Promise chain
function fetchUser(id) {
    console.log(`Fetching user ${id} with Promise...`);
    return fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(user => {
            console.log(`User ${id} (Promise):`, user.name);
            return user;
        })
        .catch(error => {
            console.error(`Error fetching user ${id}:`, error.message);
            throw error;
        });
}

// 1.2 async/await version
async function fetchUserAsync(id) {
    console.log(`Fetching user ${id} with async/await...`);
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const user = await response.json();
        console.log(`User ${id} (async/await):`, user.name);
        return user;
    } catch (error) {
        console.error(`Error fetching user ${id}:`, error.message);
        throw error;
    }
}

// 1.3 Simulate network delay
function fetchAllCourses() {
    console.log('Simulating network delay for courses...');
    return new Promise((resolve) => {
        setTimeout(() => {
            const courses = [
                { id: 1, name: 'Data Structures', code: 'CS201', credits: 4, grade: 'A' },
                { id: 2, name: 'Web Development', code: 'CS301', credits: 3, grade: 'B+' },
                { id: 3, name: 'Database Systems', code: 'CS202', credits: 3, grade: 'A-' },
                { id: 4, name: 'Machine Learning', code: 'CS401', credits: 4, grade: 'B' },
                { id: 5, name: 'Cloud Computing', code: 'CS302', credits: 3, grade: 'A' }
            ];
            console.log('Courses loaded after delay');
            resolve(courses);
        }, 1000);
    });
}

// 1.4 Promise.all
async function fetchUsersSimultaneously() {
    console.log('Fetching users simultaneously with Promise.all...');
    try {
        const [user1, user2] = await Promise.all([
            fetchUserAsync(1),
            fetchUserAsync(2)
        ]);
        console.log('Both users loaded together:', user1.name, '&', user2.name);
        return [user1, user2];
    } catch (error) {
        console.error('Error loading users simultaneously:', error.message);
        throw error;
    }
}

// ============================================================
// TASK 2: Fetch API with Error Handling
// ============================================================

console.log('\n===== TASK 2: Fetch API with Error Handling =====');

// 2.1 Reusable API fetch function
async function apiFetch(url) {
    console.log(`API Fetch: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(`API Fetch successful: ${url}`);
        return data;
    } catch (error) {
        console.error(`API Fetch error:`, error.message);
        throw new Error(`API Error: ${error.message}`);
    }
}

// DOM Elements
const courseGrid = document.querySelector('.course-grid');
const loadingMessage = document.getElementById('loading-message');
const totalCreditsDisplay = document.getElementById('total-credits');
const notificationContainer = document.getElementById('notification-container');
const notificationError = document.getElementById('notification-error');
const retryButton = document.getElementById('retry-notifications');

// 2.2 Render courses with loading state
async function loadCourses() {
    console.log('Loading courses...');
    try {
        // Show loading
        loadingMessage.style.display = 'block';
        loadingMessage.textContent = 'Loading courses...';
        loadingMessage.style.color = '#718096';
        
        // Fetch courses with simulated delay
        const courses = await fetchAllCourses();
        
        // Render courses
        renderCourses(courses);
        
        // Hide loading
        loadingMessage.style.display = 'none';
        console.log('Courses rendered successfully');
    } catch (error) {
        loadingMessage.textContent = '❌ Error loading courses: ' + error.message;
        loadingMessage.style.color = 'red';
        console.error('Failed to load courses:', error);
    }
}

function renderCourses(courses) {
    courseGrid.innerHTML = '';
    
    courses.forEach(course => {
        const article = document.createElement('article');
        article.className = 'course-card';
        article.dataset.id = course.id;
        article.innerHTML = `
            <h3>${course.name}</h3>
            <p><strong>Code:</strong> ${course.code}</p>
            <p><strong>Grade:</strong> ${course.grade}</p>
            <span class="credits">Credits: ${course.credits}</span>
        `;
        courseGrid.appendChild(article);
    });
    
    const total = courses.reduce((sum, c) => sum + c.credits, 0);
    totalCreditsDisplay.textContent = `Total Credits: ${total}`;
}

// 2.3 Load notifications from API
async function loadNotifications() {
    console.log('Loading notifications...');
    try {
        // Clear previous errors
        notificationError.innerHTML = '';
        retryButton.style.display = 'none';
        
        // Show loading
        notificationContainer.innerHTML = '<div class="loading-spinner">Loading notifications</div>';
        
        // Fetch posts from API
        const posts = await apiFetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        
        // Render notifications
        notificationContainer.innerHTML = '';
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'notification-card';
            card.innerHTML = `
                <h4>${post.title}</h4>
                <p>${post.body.substring(0, 100)}...</p>
                <small>Post #${post.id}</small>
            `;
            notificationContainer.appendChild(card);
        });
        
        console.log('Notifications loaded successfully');
    } catch (error) {
        notificationContainer.innerHTML = '';
        notificationError.innerHTML = `
            <div class="error-message">
                ⚠️ ${error.message}
            </div>
        `;
        retryButton.style.display = 'inline-block';
        console.error('Failed to load notifications:', error);
    }
}

// 2.4 Test 404 error
async function testErrorHandling() {
    console.log('Testing error handling with 404...');
    try {
        await apiFetch('https://jsonplaceholder.typicode.com/nonexistent');
    } catch (error) {
        console.log('✅ Expected error caught:', error.message);
    }
}

// Retry handler
retryButton.addEventListener('click', loadNotifications);

// ============================================================
// TASK 3: Introduction to Axios
// ============================================================

console.log('\n===== TASK 3: Introduction to Axios =====');

// 3.1 Axios interceptor
axios.interceptors.request.use(
    config => {
        console.log(`📡 API call started: ${config.url}`);
        return config;
    },
    error => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// 3.2 Axios version of apiFetch
async function axiosFetch(url, params = {}) {
    console.log(`Axios Fetch: ${url}`, params);
    try {
        const response = await axios.get(url, { params });
        console.log(`Axios Fetch successful: ${url}`);
        return response.data;
    } catch (error) {
        console.error(`Axios Fetch error:`, error.message);
        if (error.response) {
            throw new Error(`HTTP ${error.response.status}: ${error.response.statusText}`);
        } else if (error.request) {
            throw new Error('Network error - server not responding');
        } else {
            throw new Error(error.message);
        }
    }
}

// 3.3 Load user posts with Axios
async function loadUserPosts(userId) {
    console.log(`Loading posts for user ${userId} with Axios...`);
    try {
        const posts = await axiosFetch('https://jsonplaceholder.typicode.com/posts', { userId });
        console.log(`User ${userId} posts:`, posts.length, 'posts found');
        return posts;
    } catch (error) {
        console.error('Error loading user posts:', error.message);
        throw error;
    }
}

// 3.4 Compare fetch vs axios
/*
============================================================
DIFFERENCES BETWEEN FETCH AND AXIOS
============================================================

1. Error Handling:
   - Fetch: Only rejects on network errors (not on HTTP errors like 404 or 500)
   - Axios: Rejects on all non-2xx status codes by default

2. JSON Parsing:
   - Fetch: Requires manual .json() call on response
   - Axios: Automatically parses JSON response

3. Request Configuration:
   - Fetch: Uses options object (method, headers, body)
   - Axios: Uses simpler config (method, url, data)

4. Request Cancellation:
   - Fetch: Uses AbortController API
   - Axios: Built-in cancel token

5. Interceptors:
   - Fetch: No built-in interceptors
   - Axios: Request and response interceptors

6. Timeout:
   - Fetch: No built-in timeout
   - Axios: Built-in timeout option

7. Browser Support:
   - Fetch: Modern browsers only (requires polyfill for older browsers)
   - Axios: Better browser support (works on older browsers)
============================================================
*/

// ============================================================
// INITIALIZATION
// ============================================================

async function init() {
    console.log('\n🚀 Initializing Student Portal...');
    console.log('============================================\n');
    
    // Task 1: Promises and async/await
    console.log('📌 TASK 1: Promises and async/await');
    console.log('--------------------------------------------');
    await fetchUser(1);
    await fetchUserAsync(2);
    await fetchUsersSimultaneously();
    
    console.log('\n✅ Task 1 completed\n');
    
    // Task 2: Fetch API with Error Handling
    console.log('📌 TASK 2: Fetch API with Error Handling');
    console.log('--------------------------------------------');
    await loadCourses();
    await loadNotifications();
    await testErrorHandling();
    
    console.log('\n✅ Task 2 completed\n');
    
    // Task 3: Introduction to Axios
    console.log('📌 TASK 3: Introduction to Axios');
    console.log('--------------------------------------------');
    await loadUserPosts(1);
    
    console.log('\n✅ Task 3 completed\n');
    
    console.log('============================================');
    console.log('🎉 All tasks completed successfully!');
    console.log('============================================');
    
    // Display summary in the UI
    const selectedCourse = document.getElementById('selected-course');
    if (selectedCourse) {
        selectedCourse.innerHTML = `
            <strong>✅ Application Ready!</strong><br>
            Courses loaded: ${courseGrid.children.length}<br>
            Notifications loaded: ${notificationContainer.children.length}<br>
            Check the console for detailed logs
        `;
        selectedCourse.style.background = '#c6f6d5';
        selectedCourse.style.borderColor = '#48bb78';
    }
}

// Run the application
init().catch(error => {
    console.error('Fatal error during initialization:', error);
});