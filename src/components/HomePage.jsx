import {getBackendBaseUrl} from "../utils/apiConfig";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import {GoogleLogin} from "@react-oauth/google";
import {Camera, Users, Calendar, ArrowLeft, UserCheck, UploadCloud, Share2, Send, CreditCard} from "lucide-react";
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
        <motion.div initial="hidden" animate="visible" exit="hidden" dir="rtl">
            {/* 🟡 Header Section */}
            <motion.header
                className="py-20 sm:py-28 bg-gradient-to-b from-blue-700 to-blue-500 text-white text-center"
                variants={fadeIn}
            >
                <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight">
                    ברוכים הבאים ל <span className="text-yellow-300">PhotoGuests</span>
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto">
                    שירות חדשני ליצירת אלבומים אישיים בהתאמה אישית! השירות מיועד לאנשים פרטיים וגם לצלמים
                    המעוניינים להציע את השירות ללקוחותיהם כתוספת לאלבום שהם מספקים בסוף האירוע.
                </p>
            </motion.header>

            {/* 🟡 Main Content */}
            <motion.main className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 mt-16">
                {/* 🟠 Feature Section */}
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={fadeIn}>
                    <FeatureCard icon={<Camera/>} title="אלבומים חכמים" description="תמונות מותאמות אישית לכל משתתף."/>
                    <FeatureCard icon={<Users/>} title="ניהול אורחים" description="קבלת מידע ותמונות בקלות מכל אורח."/>
                    <FeatureCard icon={<Calendar/>} title="הפקת אירועים" description="פתרון מושלם לאירועים וצלמים."/>
                </motion.div>

                {/* 🟠 Step-by-Step Guide Section */}
                <motion.div
                    className="mt-20 bg-blue-500 text-white rounded-2xl shadow-lg p-12 text-center"
                    variants={fadeIn}
                >
                    <h2 className="text-4xl font-extrabold">📷 איך זה עובד?</h2>
                    <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
                        התהליך פשוט ומהיר! בצע את הצעדים הבאים כדי ליצור אלבומים מותאמים אישית לכל משתתף.
                    </p>

                    {/* Steps Section */}
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-10 text-center">
                        <StepCard icon={<UserCheck/>} step="1" title="הירשם" description="הירשם והתחבר לחשבון שלך."/>
                        <StepCard icon={<CreditCard/>} step="2" title="צור אירוע"
                                  description="בחר מספר אורחים ותמונות -> תשלום."/>
                        <StepCard icon={<Share2/>} step="3" title="שיתוף קישור או QR"
                                  description="שלח לאורחים קישור טופס רישום / העבר אלינו רשימת מספרים ונדאג לזה."/>
                        <StepCard icon={<UploadCloud/>} step="4" title="העלה את האלבום"
                                  description="העלה את תמונות האירוע."/>
                        <StepCard icon={<Send/>} step="5" title="שליחת תמונות" description="האורחים יקבלו אלבום אישי!"/>
                    </motion.div>
                </motion.div>

                {/* 🟠 Call-to-Action Section */}
                <motion.div
                    className="mt-16 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-2xl shadow-xl p-12 text-center"
                    variants={fadeIn}
                >
                    <h2 className="text-4xl font-extrabold">🚀 הצטרפו עכשיו!</h2>
                    <p className="mt-4 text-lg text-blue-100 max-w-3xl mx-auto">
                        תנו לאורחים שלכם חוויית צילום בלתי נשכחת עם אלבומים מותאמים אישית 🎉📸
                    </p>

                    <div className="mt-8 flex justify-center">
                        {user ? (
                            <motion.button
                                onClick={handleEventListNav}
                                className="px-8 py-4 bg-yellow-400 text-blue-900 font-semibold text-lg rounded-full hover:bg-yellow-300 transition flex items-center justify-center shadow-lg"
                                whileHover={{scale: 1.05}}
                            >
                                לאירועים שלי <ArrowLeft className="mr-2 h-6 w-6"/>
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

/* 📌 Feature Cards */
const FeatureCard = ({icon, title, description}) => (
    <motion.div
        className="bg-white/30 backdrop-blur-md shadow-lg border border-white/20 rounded-xl p-6"
        whileHover={{scale: 1.05}}
    >
        <div className="flex items-center space-x-4 flex-row-reverse">
            <div className="bg-blue-500 text-white p-3 rounded-full">{icon}</div>
            <div>
                <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-base text-gray-700">{description}</p>
            </div>
        </div>
    </motion.div>
);

/* 📌 Step Cards */
const StepCard = ({icon, step, title, description}) => (
    <motion.div
        className="bg-white/30 backdrop-blur-md shadow-lg border border-white/20 rounded-xl p-6"
        whileHover={{scale: 1.05}}
    >
        <div className="flex flex-col items-center">
            <div className="bg-blue-500 text-white p-3 rounded-full">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mt-4">שלב {step}: {title}</h3>
            <p className="mt-2 text-base text-gray-700">{description}</p>
        </div>
    </motion.div>
);

export default HomePage;
