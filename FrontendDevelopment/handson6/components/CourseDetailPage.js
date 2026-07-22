function CourseDetailPage() {
    const { useParams, useNavigate } = ReactRouterDOM;
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    
    const { enrolledCourses, enroll } = useEnrollment();
    const isEnrolled = course ? enrolledCourses.some(c => c.id === course.id) : false;

    React.useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const found = coursesData.find(c => c.id === parseInt(id));
            setCourse(found);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [id]);

    const handleEnroll = () => {
        if (course) {
            enroll(course);
            navigate('/profile');
        }
    };

    if (loading) {
        return <div className="loading">📚 Loading course details...</div>;
    }

    if (!course) {
        return (
            <div className="main-content">
                <h2>Course not found</h2>
                <button onClick={() => navigate('/courses')} className="back-btn">Back to Courses</button>
            </div>
        );
    }

    return (
        <div className="main-content">
            <div className="course-detail">
                <button onClick={() => navigate('/courses')} className="back-btn">← Back to Courses</button>
                
                <h1>{course.name}</h1>
                <p><strong>Course Code:</strong> {course.code}</p>
                <p><strong>Credits:</strong> {course.credits}</p>
                <p><strong>Grade:</strong> {course.grade}</p>
                
                <div className="description-box">
                    <h4>Course Description</h4>
                    <p>This is a comprehensive course on {course.name}. Students will learn key concepts and gain practical skills.</p>
                </div>

                <button
                    className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                    onClick={handleEnroll}
                    disabled={isEnrolled}
                >
                    {isEnrolled ? '✓ Already Enrolled' : 'Enroll in this Course'}
                </button>
            </div>
        </div>
    );
}