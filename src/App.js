import React, {useState, useEffect} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    useNavigate,
    useLocation,
} from "react-router-dom";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {motion, AnimatePresence} from "framer-motion";
import EventList from "./components/EventList";
import EventDetail from "./components/EventDetail";
import GuestSubmissionForm from "./components/GuestSubmissionForm";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import "./index.css";

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
                        <Routes>
                            <Route path="/" element={<HomePage user={user} setUser={setUser}/>}/>
                            <Route path="/events" element={<EventList user={user}/>}/>
                            <Route path="/events/:eventId" element={<EventDetail/>}/>
                            <Route path="/events/:eventId/guest-form" element={<GuestSubmissionForm/>}/>
                        </Routes>
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
