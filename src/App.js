import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {GoogleOAuthProvider, GoogleLogin} from "@react-oauth/google";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import GuestSubmissionForm from "./components/GuestSubmissionForm"; // Add this import
import "./App.css";

const App = () => {
    const [user, setUser] = useState(null);

    // Load user from localStorage on component mount
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

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
            setUser(data.user); // Set the logged-in user
            localStorage.setItem("user", JSON.stringify(data.user)); // Save the user to localStorage
        } catch (error) {
            console.error("Error verifying Google token:", error);
        }
    };

    const handleLogout = () => {
        // Remove user from localStorage
        localStorage.removeItem("user");
        setUser(null); // Update state to reflect user is logged out
    };

    return (
        <GoogleOAuthProvider clientId="134801815902-ab4t528nqfnkadh4c93otdk80kcc1mhc.apps.googleusercontent.com">
            <Router>
                <div className="container">
                    {!user ? (
                        <>
                            <div className="portfolio-section">
                                <h1>Photo Guests AI</h1>
                                <p>Welcome to Photo Guests AI, the easiest way to capture the memories of your
                                    events.</p>
                                <p>Sign in below to get started and create your first event!</p>
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
                                            Sign in with Google
                                        </button>
                                    )}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <button onClick={handleLogout} className="logoutButton">
                                Sign Out
                            </button>
                            {/* Event List Component */}
                            <Routes>
                                <Route path="/" element={<EventList user={user}/>}/>
                                <Route path="/events/:eventId" element={<EventDetail/>}/>
                                <Route path="/guest-form/:eventId" element={<GuestSubmissionForm/>}/> {/* New route */}
                            </Routes>
                        </>
                    )}
                </div>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
