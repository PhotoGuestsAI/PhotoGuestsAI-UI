import React from "react";
import {Link, useNavigate} from "react-router-dom";
import '../styles/Navbar.css';  // Make sure to import the CSS file

const Navbar = () => {
    const navigate = useNavigate();

    // Check if user is logged in by looking in localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = user && user.email; // User is logged in if email exists in localStorage

    const handleSignOut = () => {
        // Clear user data from localStorage and navigate to the home page
        localStorage.removeItem("user");
        navigate("/"); // Redirect to the home page after signing out
    };

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link to="/">Home</Link>
                </li>
                {/* Show Events link if the user is logged in */}
                {isLoggedIn && (
                    <li>
                        <Link to="/events">Events</Link>
                    </li>
                )}
                {isLoggedIn ?
                    <li>
                        <button onClick={handleSignOut}>Sign Out</button>
                    </li> : null
                }
            </ul>
        </nav>
    );
};

export default Navbar;
