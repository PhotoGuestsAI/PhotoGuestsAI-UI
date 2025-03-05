import {getBackendBaseUrl} from "../utils/apiConfig";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {GoogleLogin} from "@react-oauth/google";
import {Camera, Users, Calendar, ArrowLeft} from "lucide-react";
import {useEffect} from "react";

const fadeIn = {
    hidden: {opacity: 0, y: 30},
    visible: {opacity: 1, y: 0, transition: {duration: 0.8}},
};

const HomePage = ({user, setUser}) => {
    const navigate = useNavigate();

    useEffect(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (savedUser) setUser(savedUser);
    }, []);

    const handleLoginSuccess = async (credentialResponse) => {
        const {credential} = credentialResponse;

        try {
            const API_BASE_URL = getBackendBaseUrl();
            const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: credential}),
            });

            if (!response.ok) throw new Error("אימות אסימון נכשל");

            const data = await response.json();
            const userWithToken = {...data.user, token: data.user.token};

            localStorage.setItem("user", JSON.stringify(userWithToken));
            setUser(userWithToken);

            // ✅ Force UI re-render by navigating to another route and back
            navigate(0);
        } catch (error) {
            console.error("Error verifying Google token:", error);
        }
    };

    const handleEventListNav = () => {
        if (user) navigate("/events");
        else alert("אנא התחבר תחילה כדי לגשת לאירועים.");
    };

    return (
        <motion.div initial="hidden" animate="visible" exit="hidden" dir="rtl"> {}
            <motion.header
                className="py-20 sm:py-28 bg-gradient-to-b from-blue-700 to-blue-500 text-white text-center"
                variants={fadeIn}
            >
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                    ברוכים הבאים ל <span className="text-yellow-300">PhotoGuests</span>
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
                    ניהול אירועים חכם בעזרת AI לחוויית אורחים חלקה ואלבומי תמונות חכמים.
                </p>
            </motion.header>

            <motion.main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-16">
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={fadeIn}>
                    <FeatureCard icon={<Camera/>} title="אלבומי תמונות חכמים"
                                 description="ארגון אירועים חכמים בעזרת AI."/>
                    <FeatureCard icon={<Users/>} title="ניהול אורחים" description="שפר את האינטראקציה עם האורחים שלך."/>
                    <FeatureCard icon={<Calendar/>} title="תכנון אירועים" description="תכנן והפק אירועים מוצלחים."/>
                </motion.div>

                <motion.div
                    className="mt-20 bg-blue-900 text-white rounded-xl shadow-lg overflow-hidden p-12 text-center"
                    variants={fadeIn}
                >
                    <h2 className="text-3xl font-extrabold">🚀 מוכן להרים את האירועים שלך לשלב הבא?</h2>
                    <p className="mt-4 text-lg text-blue-200">
                        הצטרף ל-PhotoGuests היום ושדרג את ניהול האירועים שלך.
                    </p>
                    <div className="mt-8">
                        {user ? (
                            <motion.button
                                onClick={handleEventListNav}
                                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition flex items-center justify-center"
                                whileHover={{scale: 1.05}}
                            >
                                לאירועים שלי <ArrowLeft className="mr-2 h-6 w-6"/> {/* Changed to ArrowLeft for RTL */}
                            </motion.button>
                        ) : (
                            <GoogleLogin onSuccess={handleLoginSuccess} onError={() => console.error("Login Failed")}/>
                        )}
                    </div>
                </motion.div>
            </motion.main>
        </motion.div>
    );
};

const FeatureCard = ({icon, title, description}) => (
    <motion.div
        className="bg-white/30 backdrop-blur-md shadow-lg border border-white/20 rounded-xl p-6"
        whileHover={{scale: 1.05}}
    >
        <div className="flex items-center space-x-4 flex-row-reverse"> {}
            <div className="bg-blue-500 text-white p-3 rounded-full">{icon}</div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-base text-gray-700">{description}</p>
            </div>
        </div>
    </motion.div>
);

export default HomePage;
