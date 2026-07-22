function HomePage() {
    const { Link } = ReactRouterDOM;
    
    return (
        <section className="hero">
            <h1>Welcome to the Student Portal</h1>
            <p>Your gateway to academic success. Manage your courses, track grades, and stay informed.</p>
            <Link to="/courses">
                <button>Explore Courses</button>
            </Link>
        </section>
    );
}