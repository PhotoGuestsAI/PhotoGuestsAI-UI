import React, {useState, useEffect} from "react";
import {BrowserRouter as Router, Routes, Route, Navigate, useNavigate} from "react-router-dom";
import {GoogleOAuthProvider, GoogleLogin} from "@react-oauth/google";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import GuestSubmissionForm from "./components/GuestSubmissionForm";
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";

// Create a wrapper component to use the useNavigate hook
const AppContent = ({user, setUser}) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

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
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
            console.error("Error verifying Google token:", error);
        }
    };

    return (
        <>
            <Navbar user={user} onLogout={handleLogout}/>
            <div className="container">
                {!user ? (
                    <div className="portfolio-section">
                        <h1>Photo Guests AI</h1>
                        <p>Welcome to Photo Guests AI, the easiest way to capture the memories of your events.</p>
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
                ) : (
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/events" element={user ? <EventList user={user}/> : <Navigate to="/"/>}/>
                        <Route path="/events/:eventId" element={user ? <EventDetail/> : <Navigate to="/"/>}/>
                        <Route path="/events/:eventId/guest-form"
                               element={user ? <GuestSubmissionForm/> : <Navigate to="/"/>}/>
                    </Routes>
                )}
            </div>
        </>
    );
};

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    return (
        <GoogleOAuthProvider clientId="134801815902-ab4t528nqfnkadh4c93otdk80kcc1mhc.apps.googleusercontent.com">
            <Router>
                <AppContent user={user} setUser={setUser}/>
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;