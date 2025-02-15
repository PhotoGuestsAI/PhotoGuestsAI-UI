import {useState, useEffect} from "react";
import axios from "axios";
import {useParams, useNavigate, Link} from "react-router-dom";
import EventQRCode from "./EventQRCode";
import {Calendar, Upload} from "lucide-react";

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [albumFile, setAlbumFile] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const {eventId} = useParams();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const checkAuthorization = (eventEmail) => {
        const userEmail = user?.email;
        setIsAuthorized(userEmail === eventEmail);
        if (userEmail !== eventEmail) {
            alert("You are not authorized to view this event.");
            navigate("/");
        }
    };

    const fetchEventDetails = async () => {
        try {
            const response = await axios.get(`http://50.19.49.233:8000//events/${eventId}`, {
                headers: {Authorization: `Bearer ${user?.token}`},
            });
            setEvent(response.data);
            checkAuthorization(response.data.email);
        } catch (error) {
            console.error("Error fetching event details:", error);
            alert("An error occurred while fetching event details.");
        }
    };

    useEffect(() => {
        if (eventId && user?.token) {
            fetchEventDetails();
        }
    }, [eventId, user?.token]); // Removed unnecessary dependencies


    const handleFileChange = (e) => setAlbumFile(e.target.files[0]);

    const handleUpload = async () => {
        if (!albumFile) return alert("Please select a file before uploading.");

        const formData = new FormData();
        formData.append("album", albumFile);

        try {
            await axios.post(`http://http://50.19.49.233:8000/events/${eventId}/upload-event-album`, formData, {
                headers: {"Content-Type": "multipart/form-data", Authorization: `Bearer ${user?.token}`},
            });
            alert("File uploaded successfully!");
            fetchEventDetails();
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };

    if (!event) return <div className="text-center text-lg text-gray-700">Loading...</div>;
    if (!isAuthorized) return <div className="text-center text-lg text-red-600">You are not authorized to view this
        event.</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{event.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                    <Calendar className="h-5 w-5 mr-2"/>
                    <span>Date: {event.date}</span>
                </div>
                <p className="text-sm text-gray-600 mb-6">Status: {event.status}</p>

                <div className="bg-gray-50 p-4 rounded-md mb-6">
                    <h3 className="text-lg font-semibold mb-2">Upload or Replace the Album</h3>
                    <input type="file" accept=".zip" onChange={handleFileChange}
                           className="w-full border border-gray-300 rounded p-2 mb-4"/>
                    <button onClick={handleUpload}
                            className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition flex items-center justify-center">
                        <Upload className="h-5 w-5 mr-2"/> Upload Album
                    </button>
                </div>

                <div className="mb-6">
                    <EventQRCode eventId={event.event_id}/>
                </div>

                <Link to={`/events/${event.event_id}/guest-form`}
                      className="block text-center bg-green-600 text-white p-3 rounded-md hover:bg-green-700 transition">
                    Fill out the Guest Submission Form
                </Link>
            </div>
        </div>
    );
};

export default EventDetail;
