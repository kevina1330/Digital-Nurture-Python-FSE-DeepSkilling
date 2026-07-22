function StudentProfile() {
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
        console.log('Profile updated:', profile);
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