// ============================================================
// HANDS-ON 8: VUE.JS CONCEPTS IMPLEMENTATION
// This file simulates Vue.js concepts using React
// ============================================================

// ============================================================
// TASK 1: VUE 3 COMPONENTS & REACTIVE DATA
// ============================================================

// Header Component - Simulating Vue SFC with <script setup>
function HeaderComponent({ siteName, enrolledCount }) {
    return (
        <header className="header">
            <div className="site-name">{siteName}</div>
            <span className="vue-badge">💚 Vue.js Style</span>
            <nav>
                <ul>
                    <li><a href="#" className="active">Home</a></li>
                    <li><a href="#">Courses</a></li>
                    <li><a href="#">Profile</a></li>
                    <li><a href="#">Grades</a></li>
                </ul>
            </nav>
            <div className="enrolled-badge">
                {/* Simulating Vue interpolation {{ enrolledCount }} */}
                Enrolled: {enrolledCount || 0}
            </div>
        </header>
    );
}

// Footer Component
function FooterComponent() {
    return (
        <footer className="footer">
            <p>&copy; 2026 Student Portal. Built with <span className="vue-credit">💚 Vue.js Concepts</span></p>
        </footer>
    );
}

// CourseCard Component - Simulating Vue SFC with defineProps
function CourseCardComponent({ id, name, code, credits, grade, onEnroll, isEnrolled }) {
    // Simulating Vue's defineProps
    // In Vue: const props = defineProps({ name: String, code: String, ... })
    return (
        <article className="course-card">
            {/* Simulating Vue interpolation {{ name }} */}
            <h3>{name}</h3>
            <p><strong>Code:</strong> {code}</p>
            <p><strong>Grade:</strong> {grade}</p>
            <span className="credits">Credits: {credits}</span>
            <div className="btn-group">
                <button 
                    className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                    onClick={() => onEnroll && onEnroll({ id, name, code, credits, grade })}
                    disabled={isEnrolled}
                >
                    {/* Simulating Vue v-if / v-else */}
                    {isEnrolled ? '✓ Enrolled' : 'Enroll'}
                </button>
            </div>
        </article>
    );
}

// ============================================================
// TASK 2: VUE ROUTER FOR NAVIGATION
// ============================================================

// Simulating Vue Router
function useVueRouter() {
    const [currentRoute, setCurrentRoute] = React.useState('/');
    
    const push = (path) => {
        console.log(`🔀 Navigating to: ${path}`);
        setCurrentRoute(path);
    };
    
    const goBack = () => {
        console.log('🔙 Going back');
        setCurrentRoute('/');
    };
    
    return { currentRoute, push, goBack };
}

// Navigation Guard - Simulating Vue Router beforeEach
function useNavigationGuard() {
    React.useEffect(() => {
        console.log('🚦 Navigation guard: Logging route changes');
        // In Vue: router.beforeEach((to, from) => { ... })
        return () => {
            console.log('🧹 Navigation guard cleanup');
        };
    }, []);
}

// ============================================================
// TASK 3: PINIA FOR STATE MANAGEMENT
// ============================================================

// Simulating Pinia Store
// In Vue: defineStore('enrollment', () => { ... })
function usePiniaStore() {
    // Simulating Pinia state with ref()
    const [enrolledCourses, setEnrolledCourses] = React.useState([]);
    
    // Simulating Pinia computed (getters)
    // In Vue: const totalCredits = computed(() => enrolledCourses.reduce(...))
    const totalCredits = React.useMemo(() => {
        return enrolledCourses.reduce((sum, course) => sum + course.credits, 0);
    }, [enrolledCourses]);
    
    // Simulating Pinia actions
    const enroll = (course) => {
        if (!enrolledCourses.find(c => c.id === course.id)) {
            setEnrolledCourses([...enrolledCourses, course]);
            console.log(`✅ Pinia: Enrolled in ${course.name}`);
        }
    };
    
    const unenroll = (courseId) => {
        const course = enrolledCourses.find(c => c.id === courseId);
        setEnrolledCourses(enrolledCourses.filter(c => c.id !== courseId));
        console.log(`❌ Pinia: Unenrolled from ${course?.name || 'course'}`);
    };
    
    const reset = () => {
        setEnrolledCourses([]);
        console.log('🔄 Pinia: Store reset');
    };
    
    // Simulating storeToRefs
    // In Vue: const { enrolledCourses, totalCredits } = storeToRefs(store)
    return {
        enrolledCourses,
        totalCredits,
        enroll,
        unenroll,
        reset
    };
}

// ============================================================
// TASK 1: VUE 3 COMPONENTS & REACTIVE DATA (continued)
// ============================================================

// Profile Component with Composition API
function ProfileComponent() {
    // Simulating Vue's ref() for reactive data
    // In Vue: const name = ref('John Doe')
    const [profile, setProfile] = React.useState({
        name: 'John Doe',
        email: 'john@example.com',
        semester: 6
    });
    const [isEditing, setIsEditing] = React.useState(false);

    // Simulating Vue's computed property
    // In Vue: const displayName = computed(() => profile.name.toUpperCase())
    const displayName = React.useMemo(() => {
        return profile.name.toUpperCase();
    }, [profile.name]);

    // Simulating Vue's watch
    // In Vue: watch(() => profile, (newVal) => { console.log('Profile changed', newVal) })
    React.useEffect(() => {
        console.log('👀 Vue watch: Profile changed', profile);
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: name === 'semester' ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('📝 Profile submitted:', profile);
        setIsEditing(false);
    };

    return (
        <div className="profile-form">
            <h3>Student Profile (Composition API)</h3>
            
            {/* Simulating Vue v-if / v-else */}
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        {/* Simulating Vue v-model */}
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Semester:</label>
                        <input
                            type="number"
                            name="semester"
                            value={profile.semester}
                            onChange={handleChange}
                            min="1"
                            max="8"
                        />
                    </div>
                    <div className="btn-group">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    {/* Simulating Vue computed property display */}
                    <p><strong>Name:</strong> {profile.name} ({displayName})</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Semester:</strong> {profile.semester}</p>
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                        Edit Profile
                    </button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================

function App() {
    // Simulating Vue's reactive data with ref()
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [searchTerm, setSearchTerm] = React.useState('');
    
    // Simulating Vue Router
    const router = useVueRouter();
    useNavigationGuard(); // Simulating router.beforeEach
    
    // Simulating Pinia Store
    const store = usePiniaStore();
    
    // Simulating Vue's onMounted lifecycle
    // In Vue: onMounted(() => { loadCourses() })
    React.useEffect(() => {
        console.log('💚 Vue onMounted: Loading courses...');
        loadCourses();
        
        // Simulating Vue onUnmounted
        return () => {
            console.log('🧹 Vue onUnmounted: Cleanup');
        };
    }, []);

    // Simulating Vue's computed property for filtered courses
    // In Vue: const filteredCourses = computed(() => courses.filter(...))
    const filteredCourses = React.useMemo(() => {
        return courses.filter(course =>
            course.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [courses, searchTerm]);

    const loadCourses = async () => {
        try {
            setLoading(true);
            // Simulating API call
            const timer = setTimeout(() => {
                const data = [
                    { id: 1, name: 'Data Structures', code: 'CS201', credits: 4, grade: 'A' },
                    { id: 2, name: 'Web Development', code: 'CS301', credits: 3, grade: 'B+' },
                    { id: 3, name: 'Database Systems', code: 'CS202', credits: 3, grade: 'A-' },
                    { id: 4, name: 'Machine Learning', code: 'CS401', credits: 4, grade: 'B' },
                    { id: 5, name: 'Cloud Computing', code: 'CS302', credits: 3, grade: 'A' }
                ];
                setCourses(data);
                setLoading(false);
                console.log('✅ Vue: Courses loaded');
            }, 1000);
            
            return () => clearTimeout(timer);
        } catch (error) {
            console.error('❌ Vue: Error loading courses:', error);
            setLoading(false);
        }
    };

    const handleEnroll = (course) => {
        store.enroll(course);
    };

    const handleUnenroll = (courseId) => {
        store.unenroll(courseId);
    };

    const handleSearch = (e) => {
        // Simulating Vue's v-model
        setSearchTerm(e.target.value);
        console.log(`🔍 Vue v-model: searchTerm = "${e.target.value}"`);
    };

    // Loading state - Simulating Vue v-if
    if (loading) {
        return (
            <div>
                <HeaderComponent siteName="Student Portal" enrolledCount={store.enrolledCourses.length} />
                <div className="loading">
                    <p>📚 Loading courses...</p>
                </div>
                <FooterComponent />
            </div>
        );
    }

    // Main render - Simulating Vue template
    return (
        <div>
            <HeaderComponent siteName="Student Portal" enrolledCount={store.enrolledCourses.length} />
            
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to the Student Portal</h1>
                <p>Your gateway to academic success. Manage your courses, track grades, and stay informed.</p>
                <button onClick={() => router.push('/courses')}>
                    Explore Courses
                </button>
            </section>

            {/* Main Content */}
            <main className="main-content">
                <h1>Course Catalog</h1>
                
                {/* Search Controls - Simulating Vue v-model */}
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>

                {/* Course Grid - Simulating Vue v-for */}
                <div className="course-grid">
                    {filteredCourses.map(course => (
                        <CourseCardComponent
                            key={course.id}
                            {...course}
                            onEnroll={handleEnroll}
                            isEnrolled={store.enrolledCourses.some(c => c.id === course.id)}
                        />
                    ))}
                </div>

                {/* Simulating Vue v-if for empty state */}
                {filteredCourses.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#718096' }}>
                        No courses found matching "{searchTerm}"
                    </p>
                )}

                {/* Simulating Vue v-if for enrolled courses */}
                {store.enrolledCourses.length > 0 && (
                    <div className="enrolled-section">
                        <h3>📖 Enrolled Courses ({store.enrolledCourses.length})</h3>
                        {/* Simulating Vue v-for */}
                        <ul>
                            {store.enrolledCourses.map(course => (
                                <li key={course.id}>
                                    <span>{course.name} ({course.code})</span>
                                    <button 
                                        className="remove-btn" 
                                        onClick={() => handleUnenroll(course.id)}
                                    >
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        
                        {/* Simulating Vue computed property display */}
                        <div className="computed-display">
                            <strong>Total Credits:</strong> {store.totalCredits} 
                            <span style={{ marginLeft: '1rem', fontSize: '0.875rem', color: '#718096' }}>
                                (computed by Pinia getter)
                            </span>
                        </div>
                    </div>
                )}

                {/* Profile Component */}
                <ProfileComponent />
                
                {/* Simulating Pinia store actions */}
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button 
                        onClick={store.reset}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#e53e3e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Reset Store
                    </button>
                    <button 
                        onClick={() => console.log('📦 Current state:', {
                            courses: courses.length,
                            enrolled: store.enrolledCourses,
                            totalCredits: store.totalCredits
                        })}
                        style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#42b883',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Log Store State
                    </button>
                </div>
            </main>

            <FooterComponent />
        </div>
    );
}

// ============================================================
// MOUNT APP
// ============================================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('============================================');
console.log('✅ Hands-On 8: Vue.js Concepts Implemented');
console.log('============================================');
console.log('📌 Vue.js Concepts Simulated:');
console.log('  - Vue 3 Composition API (ref, reactive)');
console.log('  - Single-File Components (SFC)');
console.log('  - defineProps (Props declaration)');
console.log('  - Template Syntax (Interpolation)');
console.log('  - v-if / v-else (Conditional rendering)');
console.log('  - v-for (List rendering)');
console.log('  - v-model (Two-way binding)');
console.log('  - v-bind (Property binding)');
console.log('  - v-on (Event handling)');
console.log('  - Computed Properties (cached values)');
console.log('  - Watchers (Reactive side effects)');
console.log('  - Lifecycle Hooks (onMounted, onUnmounted)');
console.log('  - Vue Router (useRouter, useRoute)');
console.log('  - Navigation Guards (beforeEach)');
console.log('  - Pinia State Management (defineStore)');
console.log('  - Pinia Actions (enroll, unenroll)');
console.log('  - Pinia Getters (totalCredits)');
console.log('  - storeToRefs (Destructuring)');
console.log('============================================');