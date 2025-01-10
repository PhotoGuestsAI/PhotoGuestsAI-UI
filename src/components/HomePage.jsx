import React from 'react';
import {useNavigate} from 'react-router-dom';
import {GoogleLogin} from '@react-oauth/google';  // Import GoogleLogin for the login functionality
import '../styles/HomePage.css';  // CSS styles for the homepage

const HomePage = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));  // Check if user is logged in

    const handleEventListNav = () => {
        if (user) {
            navigate('/events');  // Navigate to the event list page if logged in
        } else {
            // If the user is not logged in, handle login directly
            alert("Please log in first to access the events.");
        }
    };

    // Handle login success
    const handleLoginSuccess = async (credentialResponse) => {
        const {credential} = credentialResponse;

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/verify-token", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: credential}),
            });

            if (!response.ok) {
                throw new Error("Token verification failed");
            }

            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data.user)); // Save user info in localStorage
            navigate("/events"); // Redirect to events page after successful login
        } catch (error) {
            console.error("Error verifying Google token:", error);
        }
    };

    return (
        <div className="home-page-container">
            <header className="home-page-header">
                <h1>Welcome to PhotoGuestsAI!</h1>
                <p>Your personal event management platform to handle photo albums and guest submissions.</p>
            </header>

            <section className="service-description">
                <h2>What We Do</h2>
                <p>
                    We provide a simple and efficient way to create and manage events, upload event albums, and manage
                    guest submissions with ease. Whether you're organizing a small gathering or a large event, we are
                    here
                    to help make your experience smoother.
                </p>
            </section>

            <section className="cta-button">
                {user ? (
                    <button onClick={handleEventListNav} className="event-list-button">
                        View My Events
                    </button>
                ) : (
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => console.error("Login Failed")}
                        useOneTap
                        render={(renderProps) => (
                            <button
                                onClick={renderProps.onClick}
                                className="google-sign-in-btn"
                                disabled={renderProps.disabled}
                            >
                                Login to Create Event
                            </button>
                        )}
                    />
                )}
            </section>
        </div>
    );
};

export default HomePage;
