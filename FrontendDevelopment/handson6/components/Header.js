function Header({ siteName, enrolledCount }) {
    const { Link, NavLink } = ReactRouterDOM;
    
    return (
        <header className="header">
            <div className="site-name">{siteName}</div>
            <nav>
                <ul>
                    <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink></li>
                    <li><NavLink to="/courses" className={({ isActive }) => isActive ? 'active' : ''}>Courses</NavLink></li>
                    <li><NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>Profile</NavLink></li>
                    <li><NavLink to="/grades" className={({ isActive }) => isActive ? 'active' : ''}>Grades</NavLink></li>
                </ul>
            </nav>
            <div className="enrolled-badge">
                Enrolled: {enrolledCount || 0}
            </div>
        </header>
    );
}