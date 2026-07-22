function CourseCard({ id, name, code, credits, grade, onEnroll, isEnrolled }) {
    const { Link } = ReactRouterDOM;
    
    return (
        <article className="course-card">
            <h3><Link to={`/courses/${id}`}>{name}</Link></h3>
            <p><strong>Code:</strong> {code}</p>
            <p><strong>Grade:</strong> {grade}</p>
            <span className="credits">Credits: {credits}</span>
            <div className="btn-group">
                <button 
                    className={`enroll-btn ${isEnrolled ? 'enrolled' : ''}`}
                    onClick={() => onEnroll && onEnroll({ id, name, code, credits, grade })}
                    disabled={isEnrolled}
                >
                    {isEnrolled ? '✓ Enrolled' : 'Enroll'}
                </button>
                <Link to={`/courses/${id}`} className="details-btn">
                    Details
                </Link>
            </div>
        </article>
    );
}