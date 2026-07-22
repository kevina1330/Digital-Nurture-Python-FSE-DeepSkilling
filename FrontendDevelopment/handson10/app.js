// ============================================================
// HANDS-ON 10: API INTEGRATION & ADVANCED STATE MANAGEMENT
// This file implements Redux Toolkit patterns with Axios
// ============================================================

// ============================================================
// TASK 1: CENTRALISED API SERVICE LAYER
// ============================================================

// API Client Configuration
const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// Create Axios instance with configuration
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Request Interceptor - Adds auth token and logs
apiClient.interceptors.request.use(
    (config) => {
        // Add Authorization header (mock token)
        config.headers.Authorization = 'Bearer mock-jwt-token-12345';
        console.log(`📡 API Request: ${config.method.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => {
        console.error('❌ Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Returns data directly and handles errors
apiClient.interceptors.response.use(
    (response) => {
        console.log(`✅ API Response: ${response.config.url} - Status: ${response.status}`);
        return response.data; // Return data directly (not the whole response)
    },
    (error) => {
        // Standardize error object
        const standardizedError = {
            message: error.response?.data?.message || error.message || 'Unknown error occurred',
            statusCode: error.response?.status || 500,
            url: error.config?.url || 'unknown',
            timestamp: new Date().toISOString()
        };
        console.error(`❌ API Error: ${standardizedError.message} (${standardizedError.statusCode})`);
        return Promise.reject(standardizedError);
    }
);

// ============================================================
// TASK 1: COURSE API FUNCTIONS
// ============================================================

const courseApi = {
    // Get all courses (maps posts from JSONPlaceholder to courses)
    getAllCourses: async () => {
        try {
            const posts = await apiClient.get('/posts?_limit=5');
            // Map posts to course format
            return posts.map(post => ({
                id: post.id,
                name: post.title.split(' ').slice(0, 3).join(' ') || 'Course ' + post.id,
                code: `CS${String(100 + post.id).padStart(3, '0')}`,
                credits: Math.floor(Math.random() * 3) + 3, // Random credits 3-5
                grade: ['A', 'A-', 'B+', 'B', 'B-'][Math.floor(Math.random() * 5)],
                originalTitle: post.title,
                body: post.body
            }));
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            throw error;
        }
    },

    // Get course by ID
    getCourseById: async (id) => {
        try {
            const post = await apiClient.get(`/posts/${id}`);
            return {
                id: post.id,
                name: post.title.split(' ').slice(0, 3).join(' ') || 'Course ' + post.id,
                code: `CS${String(100 + post.id).padStart(3, '0')}`,
                credits: Math.floor(Math.random() * 3) + 3,
                grade: ['A', 'A-', 'B+', 'B', 'B-'][Math.floor(Math.random() * 5)],
                originalTitle: post.title,
                body: post.body,
                description: `This is a comprehensive course based on: "${post.title}". Students will learn key concepts and gain practical skills in this area of study.`
            };
        } catch (error) {
            console.error(`Failed to fetch course ${id}:`, error);
            throw error;
        }
    },

    // Enroll student in course (simulated)
    enrollStudent: async (studentId, courseId) => {
        try {
            // Simulate enrollment API call
            const result = await apiClient.post('/posts', {
                userId: studentId,
                courseId: courseId,
                enrollmentDate: new Date().toISOString(),
                status: 'active'
            });
            return {
                success: true,
                enrollmentId: result.id || Math.floor(Math.random() * 1000),
                studentId: studentId,
                courseId: courseId,
                message: 'Successfully enrolled in course'
            };
        } catch (error) {
            console.error('Failed to enroll:', error);
            throw error;
        }
    }
};

// ============================================================
// TASK 2: REDUX TOOLKIT PATTERNS (Async Thunks)
// ============================================================

// Simulating Redux Toolkit's createSlice and createAsyncThunk
function createSlice({ name, initialState, reducers, extraReducers }) {
    let state = initialState;
    const listeners = [];
    
    const dispatch = (action) => {
        if (reducers && reducers[action.type]) {
            state = reducers[action.type](state, action);
        }
        listeners.forEach(listener => listener(state));
        return action;
    };
    
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    };
    
    const getState = () => state;
    
    return { dispatch, subscribe, getState, state };
}

// Simulating Redux Toolkit's createAsyncThunk
function createAsyncThunk(typePrefix, payloadCreator) {
    const pending = `${typePrefix}/pending`;
    const fulfilled = `${typePrefix}/fulfilled`;
    const rejected = `${typePrefix}/rejected`;
    
    return {
        typePrefix,
        pending,
        fulfilled,
        rejected,
        payloadCreator,
        // Action creators
        pendingAction: () => ({ type: pending, payload: undefined }),
        fulfilledAction: (payload) => ({ type: fulfilled, payload }),
        rejectedAction: (error) => ({ type: rejected, payload: undefined, error })
    };
}

// ============================================================
// TASK 2: COURSE SLICE WITH ASYNC THUNK
// ============================================================

// Initial state
const initialCourseState = {
    courses: [],
    loading: false,
    error: null,
    selectedCourse: null
};

// Create async thunk for fetching courses
const fetchAllCoursesThunk = createAsyncThunk(
    'courses/fetchAll',
    async () => {
        return await courseApi.getAllCourses();
    }
);

// Create async thunk for fetching single course
const fetchCourseByIdThunk = createAsyncThunk(
    'courses/fetchById',
    async (id) => {
        return await courseApi.getCourseById(id);
    }
);

// Reducers
const courseReducers = {
    'courses/fetchAll/pending': (state) => {
        return { ...state, loading: true, error: null };
    },
    'courses/fetchAll/fulfilled': (state, action) => {
        return { ...state, loading: false, courses: action.payload };
    },
    'courses/fetchAll/rejected': (state, action) => {
        return { ...state, loading: false, error: action.error?.message || 'Failed to fetch courses' };
    },
    'courses/fetchById/pending': (state) => {
        return { ...state, loading: true, error: null };
    },
    'courses/fetchById/fulfilled': (state, action) => {
        return { ...state, loading: false, selectedCourse: action.payload };
    },
    'courses/fetchById/rejected': (state, action) => {
        return { ...state, loading: false, error: action.error?.message || 'Failed to fetch course' };
    }
};

// Create the slice
const courseSlice = createSlice({
    name: 'courses',
    initialState: initialCourseState,
    reducers: courseReducers
});

// ============================================================
// TASK 3: ENROLLMENT SLICE (Pinia-style)
// ============================================================

// Initial enrollment state
const initialEnrollmentState = {
    enrolledCourses: [],
    totalCredits: 0,
    enrollmentHistory: []
};

// Simulating Pinia-style store
function createEnrollmentStore() {
    let state = { ...initialEnrollmentState };
    const listeners = [];
    
    // Getters (computed)
    const getters = {
        getEnrolledCount: () => state.enrolledCourses.length,
        getTotalCredits: () => state.enrolledCourses.reduce((sum, c) => sum + c.credits, 0),
        getIsEnrolled: (courseId) => state.enrolledCourses.some(c => c.id === courseId)
    };
    
    // Actions
    const actions = {
        enroll: (course) => {
            if (!getters.getIsEnrolled(course.id)) {
                state.enrolledCourses.push(course);
                state.totalCredits = getters.getTotalCredits();
                state.enrollmentHistory.push({
                    courseId: course.id,
                    courseName: course.name,
                    action: 'enroll',
                    timestamp: new Date().toISOString()
                });
                console.log(`✅ Store: Enrolled in ${course.name}`);
                listeners.forEach(l => l(state));
            }
        },
        
        unenroll: (courseId) => {
            const course = state.enrolledCourses.find(c => c.id === courseId);
            if (course) {
                state.enrolledCourses = state.enrolledCourses.filter(c => c.id !== courseId);
                state.totalCredits = getters.getTotalCredits();
                state.enrollmentHistory.push({
                    courseId: courseId,
                    courseName: course.name,
                    action: 'unenroll',
                    timestamp: new Date().toISOString()
                });
                console.log(`❌ Store: Unenrolled from ${course.name}`);
                listeners.forEach(l => l(state));
            }
        },
        
        reset: () => {
            state = { ...initialEnrollmentState };
            console.log('🔄 Store: Reset');
            listeners.forEach(l => l(state));
        }
    };
    
    const subscribe = (listener) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) listeners.splice(index, 1);
        };
    };
    
    const getState = () => state;
    
    return {
        getState,
        subscribe,
        ...getters,
        ...actions
    };
}

// ============================================================
// TASK 3: GLOBAL ERROR HANDLER (Error Boundary)
// ============================================================

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('💥 Error Boundary caught:', error, errorInfo);
        this.setState({ errorInfo });
        // Log to error reporting service
        this.logErrorToService(error, errorInfo);
    }

    logErrorToService(error, errorInfo) {
        // Simulate logging to a service like Sentry, LogRocket, etc.
        console.log('📤 Error logged to service:', {
            error: error.message,
            stack: error.stack,
            componentStack: errorInfo?.componentStack,
            timestamp: new Date().toISOString()
        });
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        if (this.props.onReset) {
            this.props.onReset();
        }
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-boundary">
                    <h2>⚠️ Something went wrong</h2>
                    <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
                    {this.state.errorInfo && (
                        <details style={{ marginBottom: '1rem', textAlign: 'left' }}>
                            <summary>Error Details</summary>
                            <pre style={{ 
                                padding: '0.5rem', 
                                background: '#f7fafc', 
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                overflow: 'auto'
                            }}>
                                {this.state.errorInfo.componentStack}
                            </pre>
                        </details>
                    )}
                    <button onClick={this.handleReset}>
                        🔄 Try Again
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

// ============================================================
// HOOKS FOR STATE MANAGEMENT
// ============================================================

// Hook to use course slice (simulating useSelector and useDispatch)
function useCourseSlice() {
    const [state, setState] = React.useState(courseSlice.getState());
    const [, forceUpdate] = React.useState({});
    
    React.useEffect(() => {
        const unsubscribe = courseSlice.subscribe(() => {
            setState(courseSlice.getState());
            forceUpdate({});
        });
        return unsubscribe;
    }, []);
    
    const dispatch = courseSlice.dispatch;
    
    const fetchCourses = async () => {
        dispatch(fetchAllCoursesThunk.pendingAction());
        try {
            const courses = await fetchAllCoursesThunk.payloadCreator();
            dispatch(fetchAllCoursesThunk.fulfilledAction(courses));
        } catch (error) {
            dispatch(fetchAllCoursesThunk.rejectedAction(error));
        }
    };
    
    const fetchCourse = async (id) => {
        dispatch(fetchCourseByIdThunk.pendingAction());
        try {
            const course = await fetchCourseByIdThunk.payloadCreator(id);
            dispatch(fetchCourseByIdThunk.fulfilledAction(course));
        } catch (error) {
            dispatch(fetchCourseByIdThunk.rejectedAction(error));
        }
    };
    
    return {
        state,
        fetchCourses,
        fetchCourse,
        loading: state.loading,
        error: state.error,
        courses: state.courses,
        selectedCourse: state.selectedCourse
    };
}

// ============================================================
// COMPONENTS
// ============================================================

function HeaderComponent({ siteName, enrolledCount }) {
    return (
        <header className="header">
            <div className="site-name">{siteName}</div>
            <span className="state-badge">⚡ Redux Toolkit Pattern</span>
            <nav>
                <ul>
                    <li><a href="#" className="active">Home</a></li>
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

function FooterComponent() {
    return (
        <footer className="footer">
            <p>&copy; 2026 Student Portal. <span className="state-credit">⚡ Advanced State Management Patterns</span></p>
        </footer>
    );
}

function CourseCardComponent({ course, onEnroll, isEnrolled }) {
    return (
        <article className="course-card">
            <span className="course-id">ID: {course.id}</span>
            <h3>{course.name}</h3>
            <p><strong>Code:</strong> {course.code}</p>
            <p><strong>Grade:</strong> {course.grade}</p>
            <p><strong>Credits:</strong> {course.credits}</p>
            <div className="btn-group">
                <button 
                    className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                    onClick={() => onEnroll(course)}
                    disabled={isEnrolled}
                >
                    {isEnrolled ? '✓ Enrolled' : 'Enroll'}
                </button>
            </div>
        </article>
    );
}

function ProfileComponent() {
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
        console.log('📝 Profile updated:', profile);
        setIsEditing(false);
    };

    return (
        <div className="profile-form">
            <h3>Student Profile</h3>
            
            {isEditing ? (
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={profile.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={profile.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Semester:</label>
                        <input type="number" name="semester" value={profile.semester} onChange={handleChange} min="1" max="8" />
                    </div>
                    <div className="btn-group">
                        <button type="submit" className="save-btn">Save</button>
                        <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </form>
            ) : (
                <div>
                    <p><strong>Name:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Semester:</strong> {profile.semester}</p>
                    <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
                </div>
            )}
        </div>
    );
}

// ============================================================
// MAIN APP COMPONENT
// ============================================================

function AppContent() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [apiStatus, setApiStatus] = React.useState('idle'); // idle | loading | success | error
    const [apiError, setApiError] = React.useState(null);
    
    // Course store (Redux Toolkit pattern)
    const courseStore = useCourseSlice();
    
    // Enrollment store (Pinia pattern)
    const enrollmentStore = React.useMemo(() => createEnrollmentStore(), []);
    const [enrollmentState, setEnrollmentState] = React.useState(enrollmentStore.getState());
    
    // Subscribe to enrollment store
    React.useEffect(() => {
        const unsubscribe = enrollmentStore.subscribe(() => {
            setEnrollmentState(enrollmentStore.getState());
        });
        return unsubscribe;
    }, [enrollmentStore]);

    // Load courses on mount
    React.useEffect(() => {
        console.log('⚡ App: Loading courses with async thunk...');
        setApiStatus('loading');
        courseStore.fetchCourses()
            .then(() => {
                setApiStatus('success');
                console.log('✅ Courses loaded successfully');
            })
            .catch((error) => {
                setApiStatus('error');
                setApiError(error.message);
                console.error('❌ Failed to load courses:', error);
            });
    }, []);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleEnroll = (course) => {
        enrollmentStore.enroll(course);
    };

    const handleUnenroll = (courseId) => {
        enrollmentStore.unenroll(courseId);
    };

    const handleReset = () => {
        console.log('🔄 Resetting app...');
        courseStore.fetchCourses();
        enrollmentStore.reset();
    };

    const filteredCourses = courseStore.courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <HeaderComponent 
                siteName="Student Portal" 
                enrolledCount={enrollmentStore.getEnrolledCount()} 
            />
            
            {/* Hero Section */}
            <section className="hero">
                <h1>Welcome to the Student Portal</h1>
                <p>Advanced State Management with Redux Toolkit Patterns</p>
                <span className="api-status">
                    API Status: {apiStatus === 'loading' && '⏳ Loading...'}
                    {apiStatus === 'success' && '✅ Connected'}
                    {apiStatus === 'error' && '❌ Error'}
                    {apiStatus === 'idle' && '⏳ Initializing...'}
                </span>
            </section>

            {/* Main Content */}
            <main className="main-content">
                <h1>Course Catalog</h1>
                
                {/* API Status Bar */}
                <div className="api-status-bar">
                    <div className="status-item">
                        <span className={`status-dot ${apiStatus === 'success' ? 'online' : apiStatus === 'loading' ? 'loading' : apiStatus === 'error' ? 'error' : ''}`}></span>
                        <span>API: {apiStatus === 'success' ? 'Online' : apiStatus === 'loading' ? 'Loading...' : apiStatus === 'error' ? 'Error' : 'Idle'}</span>
                    </div>
                    <div className="status-item">
                        <span>📚 Courses: {courseStore.courses.length}</span>
                    </div>
                    <div className="status-item">
                        <span>📖 Enrolled: {enrollmentStore.getEnrolledCount()}</span>
                    </div>
                    <div className="status-item">
                        <span>💳 Total Credits: {enrollmentStore.getTotalCredits()}</span>
                    </div>
                    <button 
                        onClick={handleReset}
                        style={{
                            padding: '0.25rem 0.75rem',
                            backgroundColor: '#2b6cb0',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.75rem'
                        }}
                    >
                        Reset Store
                    </button>
                </div>

                {/* Search Controls */}
                <div className="controls">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <button onClick={() => courseStore.fetchCourses()} disabled={courseStore.loading}>
                        {courseStore.loading ? 'Loading...' : 'Refresh Courses'}
                    </button>
                </div>

                {/* Error Display */}
                {courseStore.error && (
                    <div style={{
                        padding: '1rem',
                        background: '#fff5f5',
                        border: '1px solid #fc8181',
                        borderRadius: '8px',
                        marginBottom: '1rem',
                        color: '#e53e3e'
                    }}>
                        <strong>⚠️ Error:</strong> {courseStore.error}
                    </div>
                )}

                {/* Loading State */}
                {courseStore.loading && (
                    <div className="loading">
                        <div className="loading-spinner"></div>
                        <p>Loading courses...</p>
                    </div>
                )}

                {/* Course Grid */}
                {!courseStore.loading && (
                    <div className="course-grid">
                        {filteredCourses.map(course => (
                            <CourseCardComponent
                                key={course.id}
                                course={course}
                                onEnroll={handleEnroll}
                                isEnrolled={enrollmentStore.getIsEnrolled(course.id)}
                            />
                        ))}
                    </div>
                )}

                {!courseStore.loading && filteredCourses.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#718096' }}>
                        No courses found matching "{searchTerm}"
                    </p>
                )}

                {/* Enrolled Courses */}
                {enrollmentState.enrolledCourses.length > 0 && (
                    <div className="enrolled-section">
                        <h3>📖 Enrolled Courses ({enrollmentState.enrolledCourses.length})</h3>
                        <ul>
                            {enrollmentState.enrolledCourses.map(course => (
                                <li key={course.id}>
                                    <span>{course.name} ({course.code})</span>
                                    <button className="remove-btn" onClick={() => handleUnenroll(course.id)}>
                                        Remove
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <p style={{ marginTop: '0.5rem', fontWeight: 'bold', color: '#2b6cb0' }}>
                            Total Credits: {enrollmentState.totalCredits}
                        </p>
                    </div>
                )}

                {/* Profile */}
                <ProfileComponent />
            </main>

            <FooterComponent />
        </div>
    );
}

// ============================================================
// APP WITH ERROR BOUNDARY
// ============================================================

function App() {
    const [resetKey, setResetKey] = React.useState(0);
    
    const handleReset = () => {
        setResetKey(prev => prev + 1);
    };
    
    return (
        <ErrorBoundary key={resetKey} onReset={handleReset}>
            <AppContent />
        </ErrorBoundary>
    );
}

// ============================================================
// MOUNT APP
// ============================================================

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

console.log('============================================');
console.log('✅ Hands-On 10: Advanced State Management');
console.log('============================================');
console.log('📌 Patterns Implemented:');
console.log('  - Centralised API Service Layer (Axios)');
console.log('  - Request/Response Interceptors');
console.log('  - Redux Toolkit Patterns (createSlice, createAsyncThunk)');
console.log('  - Async Thunks with Loading/Error States');
console.log('  - Pinia-style Store (Actions, Getters)');
console.log('  - Error Boundary (Global Error Handling)');
console.log('  - Selectors (Computed Values)');
console.log('  - API Error Standardization');
console.log('  - Loading States with Spinners');
console.log('  - Retry Pattern');
console.log('  - State Reset');
console.log('============================================');
console.log('\n📊 Try these actions:');
console.log('  - Search for courses');
console.log('  - Enroll in courses');
console.log('  - Remove enrolled courses');
console.log('  - Click "Refresh Courses"');
console.log('  - Click "Reset Store"');
console.log('  - Open browser console to see logs');
console.log('============================================');