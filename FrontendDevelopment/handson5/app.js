// app.js - React Application

// ============================================================
// TASK 1: Components
// ============================================================

// Header Component
function Header({ siteName, enrolledCount }) {
    return (
        <header className="header">
            <div className="site-name">{siteName}</div>
            <nav>
                <ul>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">Courses</a></li>
                    <li><a href="#">Profile</a></li>
                    <li><a href="#">Grades</a></li>
                </ul>
            </nav>
            <div className="enrolled-badge">
                Enrolled: {enrolledCount || 0}
            </div>
        </header>
    );
}

// Footer Component
function Footer() {
    return (
        <footer className="footer">
            <p>&copy; 2026 Student Portal. All rights reserved.</p>
        </footer>
    );
}

// CourseCard Component
function CourseCard({ id, name, code, credits, grade, onEnroll, isEnrolled }) {
    return (
        <article className="course-card">
            <h3>{name}</h3>
            <p><strong>Code:</strong> {code}</p>
            <p><strong>Grade:</strong> {grade}</p>
            <span className="credits">Credits: {credits}</span>
            <br />
            <button 
                className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                onClick={() => onEnroll && onEnroll({ id, name, code, credits, grade })}
                disabled={isEnrolled}
            >
                {isEnrolled ? '✓ Enrolled' : 'Enroll'}
            </button>
        </article>
    );
}

// StudentProfile Component (Task 3)
function StudentProfile() {
    // Local state for profile
    const [profile, setProfile] = React.useState({
        name: 'John Doe',
        email: 'john@example.com',
        semester: 6
    });
    const [isEditing, setIsEditing] = React.useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: name === 'semester' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Profile updated:', profile);
        setIsEditing(false);
    };

    return (
        <div className="enrolled-section" style={{ marginTop: '2rem' }}>
            <h3>Student Profile</h3>
            
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.25rem' }}>
                            Name:
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                width: '100%'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.25rem' }}>
                            Email:
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                width: '100%'
                            }}
                        />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ display: 'block', fontWeight: '500', marginBottom: '0.25rem' }}>
                            Semester:
                        </label>
                        <input
                            type="number"
                            name="semester"
                            value={profile.semester}
                            onChange={handleChange}
                            min="1"
                            max="8"
                            style={{
                                padding: '0.5rem',
                                border: '1px solid #e2e8f0',
                                borderRadius: '4px',
                                width: '100%'
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="submit" style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#2b6cb0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Save
                        </button>
                        <button type="button" onClick={() => setIsEditing(false)} style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#718096',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Semester:</strong> {profile.semester}</p>
                    <button onClick={() => setIsEditing(true)} style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#2b6cb0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}>
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// TASK 2: App Component with State and Effects
// ============================================================

function App() {
    // State variables
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [enrolledCourses, setEnrolledCourses] = React.useState([]);

    // ============================================================
    // TASK 3: useEffect Hook
    // ============================================================

    // Load courses on mount (empty dependency array)
    React.useEffect(() => {
        console.log('🔄 useEffect: Loading courses...');
        setLoading(true);
        
        // Simulate API call with setTimeout
        const timer = setTimeout(() => {
            try {
                // Use coursesData from data.js
                setCourses(coursesData);
                setLoading(false);
                console.log('✅ Courses loaded successfully');
            } catch (err) {
                setError(err.message);
                setLoading(false);
                console.error('❌ Error loading courses:', err);
            }
        }, 1500);

        // Cleanup function
        return () => {
            clearTimeout(timer);
            console.log('🧹 Cleanup: Timer cleared');
        };
    }, []); // Empty dependency array = runs once on mount

    // Log when courses change (with dependency array)
    React.useEffect(() => {
        if (courses.length > 0) {
            console.log(`📊 Courses updated: ${courses.length} courses loaded`);
        }
    }, [courses]); // Runs when courses state changes

    // ============================================================
    // Event Handlers
    // ============================================================

    // Handle enrollment
    const handleEnroll = (course) => {
        // Check if already enrolled
        if (!enrolledCourses.find(c => c.id === course.id)) {
            setEnrolledCourses([...enrolledCourses, course]);
            console.log(`✅ Enrolled in: ${course.name}`);
        }
    };

    // Handle search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        console.log(`🔍 Searching: "${e.target.value}"`);
    };

    // Filter courses based on search
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // ============================================================
    // Render
    // ============================================================

    // Loading state
    if (loading) {
        return (
            <div>
                <Header siteName="Student Portal" enrolledCount={enrolledCourses.length} />
                <div className="loading">
                    <p>📚 Loading courses...</p>
                </div>
                <Footer />
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div>
                <Header siteName="Student Portal" enrolledCount={enrolledCourses.length} />
                <div className="loading" style={{ color: 'red' }}>
                    <p>❌ Error: {error}</p>
                </div>
                <Footer />
            </div>
        );
    }

    // Main render
    return (
        <div>
            <Header siteName="Student Portal" enrolledCount={enrolledCourses.length} />
            
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to the Student Portal</h1>
                <p>Your gateway to academic success. Manage your courses, track grades, and stay informed.</p>
                <button>Explore Courses</button>
            </section>

            {/* Main Content */}
            <main className="main-content">
                <h1>Course Catalog</h1>
                
                {/* Search Controls */}
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {/* Course Grid */}
                <div className="course-grid">
                    {filteredCourses.map(course => (
                        <CourseCard
                            key={course.id}
                            {...course}
                            onEnroll={handleEnroll}
                            isEnrolled={enrolledCourses.some(c => c.id === course.id)}
                        />
                    ))}
                </div>

                {filteredCourses.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#718096' }}>
                        No courses found matching "{searchTerm}"
                    </p>
                )}

                {/* Enrolled Courses Section */}
                {enrolledCourses.length > 0 && (
                    <div className="enrolled-section">
                        <h3>📖 Enrolled Courses ({enrolledCourses.length})</h3>
                        <ul>
                            {enrolledCourses.map(course => (
                                <li key={course.id}>• {course.name} ({course.code})</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Student Profile (Task 3) */}
                <StudentProfile />
            </main>

            <Footer />
        </div>
    );
}

// ============================================================
// MOUNT REACT APP
// ============================================================

// Mount the React app to the root element
ReactDOM.createRoot(document.getElementById('root')).render(<App />);

console.log('🚀 React App Mounted Successfully!');
console.log('============================================');
console.log('✅ Hands-On 5 Features:');
console.log('  - React Components (Header, Footer, CourseCard)');
console.log('  - Props passing');
console.log('  - useState for state management');
console.log('  - useEffect for side effects');
console.log('  - Dynamic list rendering with .map()');
console.log('  - Search filtering');
console.log('  - Enroll functionality with state');
console.log('  - Student Profile with form');
console.log('============================================');