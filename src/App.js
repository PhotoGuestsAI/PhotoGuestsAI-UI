import React, {useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation,
} from "react-router-dom";
import {GoogleOAuthProvider, GoogleLogin} from "@react-oauth/google";
import {motion, AnimatePresence} from "framer-motion";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import GuestSubmissionForm from "./components/GuestSubmissionForm";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import "./index.css"; // Ensure we use the optimized Tailwind styles

// Animation Variants
const pageVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0, transition: {duration: 0.5}},
    exit: {opacity: 0, y: -20, transition: {duration: 0.3}},
};

const AppContent = ({user, setUser}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/");
    };

    const handleLoginSuccess = async (credentialResponse) => {
        const {credential} = credentialResponse;

        try {
            const response = await fetch("http://50.19.49.233:8000/auth/verify-token", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: credential}),
            });

            if (!response.ok) throw new Error("Token verification failed");

            const data = await response.json();
            const userWithToken = {...data.user, token: data.user.token};
            setUser(userWithToken);
            localStorage.setItem("user", JSON.stringify(userWithToken));
        } catch (error) {
            console.error("Error verifying Google token:", error);
        }
    };

    return (
        <>
            <Navbar user={user} onLogout={handleLogout}/>
            <div className="container mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial="hidden"
                        animate="visible"
                        variants={pageVariants}
                    >
                        {!user ? (
                            <div className="flex flex-col items-center text-center mt-20">
                                <h1 className="text-4xl font-bold text-gray-900">PhotoGuestsAI</h1>
                                <p className="mt-4 text-lg text-gray-600">
                                    The easiest way to capture the memories of your events.
                                </p>
                                <p className="mt-2 text-gray-500">
                                    Sign in below to get started and create your first event!
                                </p>
                                <GoogleLogin
                                    onSuccess={handleLoginSuccess}
                                    onError={() => console.error("Login Failed")}
                                    useOneTap
                                    render={(renderProps) => (
                                        <motion.button
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                            className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-md shadow-md hover:bg-blue-700 transition"
                                            whileHover={{scale: 1.05}}
                                        >
                                            Sign in with Google
                                        </motion.button>
                                    )}
                                />
                            </div>
                        ) : (
                            <Routes>
                                <Route path="/" element={<HomePage/>}/>
                                <Route path="/events" element={<EventList user={user}/>}/>
                                <Route path="/events/:eventId" element={<EventDetail/>}/>
                                <Route path="/events/:eventId/guest-form" element={<GuestSubmissionForm/>}/>
                            </Routes>
                        )}
                    </motion.div>
                </AnimatePresence>
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
