import {getBackendBaseUrl} from "../utils/apiConfig";
import {useState, useEffect} from "react";
import axios from "axios";
import {useParams, useNavigate, Link} from "react-router-dom";
import EventQRCode from "./EventQRCode";
import {Calendar, Upload} from "lucide-react";

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [albumFile, setAlbumFile] = useState(null);
    const [uploadedAlbum, setUploadedAlbum] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [user, setUser] = useState(null);

    const {eventId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        setUser(storedUser);
    }, []);

    useEffect(() => {
        if (!eventId || !user?.token) return;

        const fetchEventDetails = async () => {
            try {
                const API_BASE_URL = getBackendBaseUrl();
                const response = await axios.get(`${API_BASE_URL}/events/${eventId}`, {
                    headers: {Authorization: `Bearer ${user.token}`},
                });

                setEvent(response.data);
                setUploadedAlbum(response.data.album_name || "אין אלבום שהועלה עדיין");

                if (response.data.email !== user.email) {
                    alert("אינך מורשה לצפות באירוע זה.");
                    navigate("/");
                } else {
                    setIsAuthorized(true);
                }
            } catch (error) {
                console.error("Error fetching event details:", error);
                alert("אירעה שגיאה בעת קבלת פרטי האירוע.");
            }
        };

        fetchEventDetails();
    }, [eventId, user, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return alert("לא נבחר קובץ.");
        setAlbumFile(file);
    };

    const handleUpload = async () => {
        if (!albumFile) return alert("אנא בחר קובץ לפני ההעלאה.");

        if (event?.status === "Album Uploaded") {
            return alert("❌ לא ניתן להעלות אלבום חדש. אלבום כבר הועלה בעבר.");
        }

        // Show confirmation dialog
        const confirmUpload = window.confirm(
            "⚠️ שים לב: לאחר ההעלאה, לא תוכל להחליף את האלבום. \n\nהאם אתה בטוח שזהו האלבום הנכון?"
        );

        if (!confirmUpload) {
            setAlbumFile(null);
            document.getElementById("albumUploadInput").value = "";
            return;
        }

        const formData = new FormData();
        formData.append("album", albumFile);

        try {
            const API_BASE_URL = getBackendBaseUrl();
            await axios.post(`${API_BASE_URL}/albums/${eventId}/upload-event-album`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${user?.token}`,
                },
            });

            setUploadedAlbum(albumFile.name);
            alert("📁 האלבום הועלה בהצלחה!");
            setAlbumFile(null);
            document.getElementById("albumUploadInput").value = "";
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("❌ אירעה שגיאה בעת העלאת הקובץ.");
        }
    };

    if (!event) return <div className="text-center text-lg text-gray-700">טוען...</div>;
    if (!isAuthorized) return <div className="text-center text-lg text-red-600">אין לך הרשאה לצפות באירוע זה.</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-5 w-5 ml-2"/>
                    <span>תאריך: {event.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">סטטוס: {event.status}</p>

                {/* Album Upload Section */}
                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-semibold mb-2">📤 העלה את האלבום</h3>

                    {event?.status === "Album Uploaded" ? (
                        <p className="text-red-600 font-semibold">❌ אלבום כבר הועלה. לא ניתן להעלות אלבום נוסף.</p>
                    ) : (
                        <>
                            {/* Upload file input */}
                            <input
                                type="file"
                                accept=".zip"
                                id="albumUploadInput"
                                onChange={handleFileChange}
                                className="w-full border border-gray-300 rounded p-2 mb-4"
                                disabled={event?.status === "אלבום הועלה"}
                            />

                            {/* Upload Button */}
                            <button
                                onClick={handleUpload}
                                className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
                                disabled={event?.status === "אלבום הועלה"}
                            >
                                <Upload className="h-5 w-5 ml-2"/> העלאת אלבום
                            </button>
                        </>
                    )}
                </div>

                {/* QR Code Section */}
                <div className="mb-6">
                    <EventQRCode eventId={event.event_id}/>
                </div>

                {/* Guest Submission Form Link */}
                <Link
                    to={`/events/${event.event_id}/guest-form`}
                    className="block text-center bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition"
                >
                    📋 מילוי טופס רישום אורחים
                </Link>
            </div>
        </div>
    );
};

export default EventDetail;
