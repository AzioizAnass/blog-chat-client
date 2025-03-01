import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="nav-brand">
                Blog-Chat
            </div>
            <div className="nav-links">
                <Link to="/blog" className="nav-link">Articles</Link>
                <Link to="/chat" className="nav-link">Chat</Link>
                <Link to="/profile" className="nav-link">My Profile</Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
