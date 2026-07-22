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