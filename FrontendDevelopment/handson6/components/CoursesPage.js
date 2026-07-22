function CoursesPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [courses, setCourses] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const { useEnrollment } = window;
    
    // Use context for enrollment
    const { enrolledCourses, enroll } = useEnrollment();

    React.useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setCourses(coursesData);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="loading">📚 Loading courses...</div>;
    }

    return (
        <div className="main-content">
            <h1>Course Catalog</h1>
            
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="course-grid">
                {filteredCourses.map(course => (
                    <CourseCard
                        key={course.id}
                        {...course}
                        onEnroll={enroll}
                        isEnrolled={enrolledCourses.some(c => c.id === course.id)}
                    />
                ))}
            </div>

            {filteredCourses.length === 0 && (
                <p style={{ textAlign: 'center', color: '#718096' }}>
                    No courses found matching "{searchTerm}"
                </p>
            )}
        </div>
    );
}