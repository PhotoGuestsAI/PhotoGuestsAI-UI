import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {useParams, useNavigate, Link} from "react-router-dom"; // Import Link for navigation
import "../styles/EventDetail.css"; // Import CSS for styling
import EventQRCode from "./EventQRCode"; // Import the EventQRCode component

const EventStatus = {
    PENDING_UPLOAD: "Pending Upload",
    ALBUM_UPLOADED: "Album Uploaded",
    COMPLETED: "Completed",
};

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [albumFile, setAlbumFile] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const {eventId} = useParams(); // Get eventId from route params
    const navigate = useNavigate(); // Use useNavigate hook for navigation

    // Function to check authorization based on localStorage email
    const checkAuthorization = useCallback((eventEmail) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user?.email;

        if (userEmail === eventEmail) {
            setIsAuthorized(true);
        } else {
            setIsAuthorized(false);
            alert("You are not authorized to view this event.");
            navigate("/"); // Redirect to homepage or any other route you choose
        }
    }, [navigate]);

    // Memoize the fetchEventDetails function
    const fetchEventDetails = useCallback(async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/events/${eventId}`);
            console.log("Event Details: ", response.data);
            setEvent(response.data);

            // Check authorization
            checkAuthorization(response.data.email);
        } catch (error) {
            console.error("Error fetching event details:", error);
        }
    }, [eventId, checkAuthorization]); // Only depend on eventId and checkAuthorization

    // Ensure the fetchEventDetails function is called when the eventId changes
    useEffect(() => {
        if (eventId) {
            fetchEventDetails();  // No need to return a promise here
        }
    }, [eventId, fetchEventDetails]);  // Include fetchEventDetails in the dependency array

    // Handle album file selection
    const handleFileChange = (e) => {
        if (e.target.name === "album") {
            setAlbumFile(e.target.files[0]);
        }
    };

    // Handle album file upload
    const handleUpload = async () => {
        if (!albumFile) {
            alert("Please select the album zip file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append("album", albumFile);

        try {
            await axios.post(
                `http://127.0.0.1:8000/events/${eventId}/upload-event-album`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            alert("File uploaded successfully!");
            // Refetch event details to update the status
            const response = await axios.get(`http://127.0.0.1:8000/events/${eventId}`);
            setEvent(response.data); // Update the event details with new status
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    // Check if the user is authorized to view the event details
    if (!isAuthorized) {
        return <div>You are not authorized to view this event.</div>;
    }

    // Determine text for upload button based on event status
    const uploadButtonText =
        event.status === EventStatus.ALBUM_UPLOADED
            ? "Replace the Album"
            : "Upload the Album";

    return (
        <div className="event-detail-container">
            <h2 className="event-name">{event.event_name}</h2>
            <p className="event-date">Date: {event.event_date}</p>
            <p className="event-status">Status: {event.status}</p>

            <div className="upload-section">
                <br/>
                <h3>{uploadButtonText}</h3>
                <input
                    type="file"
                    name="album"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>

            <button onClick={handleUpload} className="upload-button">
                {uploadButtonText}
            </button>

            {/* Display the Event QR Code for guest form */}
            <div className="qr-code-section">
                <EventQRCode eventId={event.event_id}/>
            </div>

            {/* Add a link under the QR code to the guest submission form */}
            <div className="guest-form-link">
                <Link to={`/events/${event.event_id}/guest-form`}>
                    Fill out the Guest Submission Form
                </Link>
            </div>
        </div>
    );
};

export default EventDetail;
