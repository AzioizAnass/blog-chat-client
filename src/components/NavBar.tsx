import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlogChatLogo from '../assets/images/BlogChat.svg';
import { IoLogOut } from "react-icons/io5";
import { IoMdChatbubbles } from "react-icons/io";
import { MdArticle } from "react-icons/md";




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
                <img src={BlogChatLogo} alt="BC" />
            </div>
            <div className="nav-links">
                <Link to="/blog" className="nav-link">Articles <MdArticle /></Link>
                <Link to="/chat" className="nav-link">Chat <IoMdChatbubbles /></Link>
                <button onClick={handleLogout} className="nav-link logout-btn">
                    Logout <IoLogOut />
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
