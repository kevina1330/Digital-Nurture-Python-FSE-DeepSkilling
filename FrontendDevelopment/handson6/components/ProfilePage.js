function ProfilePage() {
    const { enrolledCourses, unenroll } = useEnrollment();
    
    const handleUnenroll = (courseId) => {
        if (window.confirm('Are you sure you want to unenroll from this course?')) {
            unenroll(courseId);
        }
    };

    return (
        <div className="main-content">
            <h1>Student Profile</h1>
            
            <div className="profile-form">
                <h3>Personal Information</h3>
                <p><strong>Name:</strong> John Doe</p>
                <p><strong>Email:</strong> john@example.com</p>
                <p><strong>Semester:</strong> 6</p>
            </div>

            <div className="enrolled-section">
                <h3>📖 Enrolled Courses ({enrolledCourses.length})</h3>
                {enrolledCourses.length === 0 ? (
                    <p style={{ color: '#718096' }}>No courses enrolled yet.</p>
                ) : (
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
                )}
            </div>

            <StudentProfile />
        </div>
    );
}