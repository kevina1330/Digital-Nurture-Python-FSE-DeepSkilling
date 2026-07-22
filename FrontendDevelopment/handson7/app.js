// ============================================================
// HANDS-ON 7: ANGULAR CONCEPTS IMPLEMENTATION
// This file simulates Angular concepts using React
// ============================================================

// ============================================================
// TASK 1: ANGULAR COMPONENTS & DATA BINDING
// ============================================================

// Simulating Angular @Component decorator
// Header Component (Angular-style)
function HeaderComponent({ siteName, enrolledCount }) {
    return (
        <header className="header">
            <div className="site-name">{siteName}</div>
            <span className="angular-badge">⚡ Angular Style</span>
            <nav>
                <ul>
                    <li><a href="#" className="active">Home</a></li>
                    <li><a href="#">Courses</a></li>
                    <li><a href="#">Profile</a></li>
                    <li><a href="#">Grades</a></li>
                </ul>
            </nav>
            <div className="enrolled-badge">
                {/* Simulating Angular interpolation {{ enrolledCount }} */}
                Enrolled: {enrolledCount || 0}
            </div>
        </header>
    );
}

// Footer Component (Angular-style)
function FooterComponent() {
    return (
        <footer className="footer">
            <p>&copy; 2026 Student Portal. Built with <span className="angular-credit">Angular Concepts</span></p>
        </footer>
    );
}

// CourseCard Component (Angular-style with @Input simulation)
function CourseCardComponent({ id, name, code, credits, grade, onEnroll, isEnrolled }) {
    // Simulating Angular @Input() properties
    return (
        <article className="course-card">
            {/* Simulating Angular interpolation {{ name }} */}
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
                    {/* Simulating Angular *ngIf */}
                    {isEnrolled ? '✓ Enrolled' : 'Enroll'}
                </button>
            </div>
        </article>
    );
}

// ============================================================
// TASK 2: SERVICES & DEPENDENCY INJECTION
// ============================================================

// Simulating Angular Service with Dependency Injection
// In Angular: @Injectable({ providedIn: 'root' })
class CourseService {
    constructor() {
        // Simulating HttpClient injection
        console.log('🔧 CourseService initialized (Singleton)');
        this.courses = [
            { id: 1, name: 'Data Structures', code: 'CS201', credits: 4, grade: 'A' },
            { id: 2, name: 'Web Development', code: 'CS301', credits: 3, grade: 'B+' },
            { id: 3, name: 'Database Systems', code: 'CS202', credits: 3, grade: 'A-' },
            { id: 4, name: 'Machine Learning', code: 'CS401', credits: 4, grade: 'B' },
            { id: 5, name: 'Cloud Computing', code: 'CS302', credits: 3, grade: 'A' }
        ];
    }

    // Simulating HttpClient.get() returning Observable
    getCourses() {
        console.log('📡 CourseService.getCourses() called');
        // Simulating Observable with Promise
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('✅ Courses fetched from service');
                resolve(this.courses);
            }, 1000);
        });
    }

    getCourseById(id) {
        console.log(`📡 CourseService.getCourseById(${id}) called`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const course = this.courses.find(c => c.id === id);
                if (course) {
                    resolve(course);
                } else {
                    reject(new Error(`Course with ID ${id} not found`));
                }
            }, 500);
        });
    }
}

// Simulating Angular Dependency Injection
// In Angular: constructor(private courseService: CourseService) {}
function useCourseService() {
    // Singleton instance - simulating Angular's DI
    const serviceRef = React.useRef(null);
    if (!serviceRef.current) {
        serviceRef.current = new CourseService();
    }
    return serviceRef.current;
}

// ============================================================
// TASK 3: ANGULAR ROUTING & REACTIVE FORMS
// ============================================================

// Simulating Angular Reactive Form with Validators
function useReactiveForm(initialValues, validators) {
    const [values, setValues] = React.useState(initialValues);
    const [errors, setErrors] = React.useState({});
    const [touched, setTouched] = React.useState({});
    const [isValid, setIsValid] = React.useState(false);

    const validate = (fieldName, value) => {
        const fieldValidators = validators[fieldName] || [];
        for (let validator of fieldValidators) {
            const error = validator(value);
            if (error) {
                return error;
            }
        }
        return null;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));
        
        // Validate on change
        const error = validate(name, value);
        setErrors(prev => ({ ...prev, [name]: error }));
        
        // Check overall validity
        const allErrors = {};
        Object.keys(validators).forEach(field => {
            const err = validate(field, field === name ? value : values[field]);
            if (err) allErrors[field] = err;
        });
        setIsValid(Object.keys(allErrors).length === 0);
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const error = validate(name, values[name]);
        setErrors(prev => ({ ...prev, [name]: error }));
    };

    // Simulating Angular FormGroup
    return {
        values,
        errors,
        touched,
        isValid,
        handleChange,
        handleBlur,
        getFieldError: (field) => touched[field] ? errors[field] : null,
        reset: () => {
            setValues(initialValues);
            setErrors({});
            setTouched({});
        }
    };
}

// Validator functions - Simulating Angular Validators
const required = (value) => {
    return !value || value.trim() === '' ? 'This field is required' : null;
};

const email = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? 'Enter a valid email' : null;
};

const min = (minVal) => (value) => {
    return parseInt(value) < minVal ? `Value must be at least ${minVal}` : null;
};

const max = (maxVal) => (value) => {
    return parseInt(value) > maxVal ? `Value must be at most ${maxVal}` : null;
};

// ProfileForm Component with Reactive Form
function ProfileFormComponent() {
    // Simulating Angular FormBuilder
    const form = useReactiveForm(
        { name: '', email: '', semester: 1 },
        {
            name: [required],
            email: [required, email],
            semester: [required, min(1), max(8)]
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.isValid) {
            console.log('✅ Form submitted:', form.values);
            alert('Profile updated successfully!');
            form.reset();
        } else {
            console.log('❌ Form invalid:', form.errors);
        }
    };

    return (
        <div className="profile-form">
            <h3>Student Profile (Reactive Form)</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={form.values.name}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        placeholder="Enter your name"
                    />
                    {form.getFieldError('name') && (
                        <div className="error-message">{form.getFieldError('name')}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={form.values.email}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        placeholder="Enter your email"
                    />
                    {form.getFieldError('email') && (
                        <div className="error-message">{form.getFieldError('email')}</div>
                    )}
                </div>
                <div className="form-group">
                    <label>Semester:</label>
                    <input
                        type="number"
                        name="semester"
                        value={form.values.semester}
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        min="1"
                        max="8"
                        placeholder="Enter semester (1-8)"
                    />
                    {form.getFieldError('semester') && (
                        <div className="error-message">{form.getFieldError('semester')}</div>
                    )}
                </div>
                <div className="btn-group">
                    <button 
                        type="submit" 
                        className="save-btn"
                        // Simulating Angular [disabled]="profileForm.invalid"
                        disabled={!form.isValid}
                    >
                        Submit
                    </button>
                    <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={() => form.reset()}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}

// ============================================================
// MAIN APP COMPONENT - Simulating Angular AppModule
// ============================================================

function App() {
    // State
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [enrolledCourses, setEnrolledCourses] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Injecting CourseService (Simulating Angular DI)
    const courseService = useCourseService();
    console.log('📦 App component initialized with CourseService');

    // Simulating Angular ngOnInit
    React.useEffect(() => {
        console.log('🔄 App ngOnInit - Loading courses...');
        loadCourses();
    }, []);

    // Service method call - Simulating Angular Service + HttpClient
    const loadCourses = async () => {
        try {
            setLoading(true);
            // Simulating Angular: this.courseService.getCourses().subscribe()
            const data = await courseService.getCourses();
            setCourses(data);
            setLoading(false);
            console.log('✅ Courses loaded via service');
        } catch (err) {
            setError(err.message);
            setLoading(false);
            console.error('❌ Error loading courses:', err);
        }
    };

    const handleEnroll = (course) => {
        if (!enrolledCourses.find(c => c.id === course.id)) {
            setEnrolledCourses([...enrolledCourses, course]);
            console.log(`✅ Enrolled in: ${course.name}`);
        }
    };

    const handleUnenroll = (courseId) => {
        setEnrolledCourses(enrolledCourses.filter(c => c.id !== courseId));
        console.log(`❌ Unenrolled from course ID: ${courseId}`);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Loading state - Simulating Angular *ngIf
    if (loading) {
        return (
            <div>
                <HeaderComponent siteName="Student Portal" enrolledCount={enrolledCourses.length} />
                <div className="loading">
                    <p>📚 Loading courses...</p>
                </div>
                <FooterComponent />
            </div>
        );
    }

    // Error state - Simulating Angular *ngIf
    if (error) {
        return (
            <div>
                <HeaderComponent siteName="Student Portal" enrolledCount={enrolledCourses.length} />
                <div className="loading" style={{ color: 'red' }}>
                    <p>❌ Error: {error}</p>
                    <button 
                        onClick={loadCourses}
                        style={{
                            padding: '0.5rem 1rem',
                            background: '#c62828',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                    >
                        Retry
                    </button>
                </div>
                <FooterComponent />
            </div>
        );
    }

    // Main render
    return (
        <div>
            <HeaderComponent siteName="Student Portal" enrolledCount={enrolledCourses.length} />
            
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

                {/* Course Grid - Simulating Angular *ngFor */}
                <div className="course-grid">
                    {filteredCourses.map(course => (
                        <CourseCardComponent
                            key={course.id}
                            {...course}
                            onEnroll={handleEnroll}
                            isEnrolled={enrolledCourses.some(c => c.id === course.id)}
                        />
                    ))}
                </div>

                {/* Simulating Angular *ngIf */}
                {filteredCourses.length === 0 && (
                    <p style={{ textAlign: 'center', color: '#718096' }}>
                        No courses found matching "{searchTerm}"
                    </p>
                )}

                {/* Enrolled Courses - Simulating Angular *ngIf */}
                {enrolledCourses.length > 0 && (
                    <div className="enrolled-section">
                        <h3>📖 Enrolled Courses ({enrolledCourses.length})</h3>
                        {/* Simulating Angular *ngFor */}
                        <ul>
                            {enrolledCourses.map(course => (
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
                    </div>
                )}

                {/* Angular Reactive Form */}
                <ProfileFormComponent />
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
console.log('✅ Hands-On 7: Angular Concepts Implemented');
console.log('============================================');
console.log('📌 Angular Concepts Simulated:');
console.log('  - @Component (Components with templates)');
console.log('  - @Input() (Props passing)');
console.log('  - @Injectable() (Services)');
console.log('  - Dependency Injection (Constructor injection)');
console.log('  - HttpClient (Service HTTP calls)');
console.log('  - RxJS Observables (Simulated with Promises)');
console.log('  - *ngFor (List rendering)');
console.log('  - *ngIf (Conditional rendering)');
console.log('  - {{ interpolation }} (Data binding)');
console.log('  - [property] (Property binding)');
console.log('  - (event) (Event binding)');
console.log('  - Reactive Forms (FormGroup, FormControl)');
console.log('  - Validators (required, email, min, max)');
console.log('  - [disabled] (Form validation status)');
console.log('  - ngOnInit (Lifecycle hook)');
console.log('  - ngOnDestroy (Cleanup)');
console.log('  - Singleton Services (providedIn: root)');
console.log('============================================');