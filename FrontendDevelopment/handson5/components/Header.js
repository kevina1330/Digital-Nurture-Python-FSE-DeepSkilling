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