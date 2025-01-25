import React, {useState, useEffect, useCallback} from "react";
import axios from "axios";
import {useParams, useNavigate, Link} from "react-router-dom";
import "../styles/EventDetail.css";
import EventQRCode from "./EventQRCode";

const EventStatus = {
    PENDING_UPLOAD: "Pending Upload",
    ALBUM_UPLOADED: "Album Uploaded",
    COMPLETED: "Completed",
};

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [albumFile, setAlbumFile] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const {eventId} = useParams();
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    // Function to check authorization
    const checkAuthorization = useCallback(
        (eventEmail) => {
            const userEmail = user?.email;

            if (userEmail === eventEmail) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                alert("You are not authorized to view this event.");
                navigate("/");
            }
        },
        [navigate, user?.email]
    );

    // Fetch event details
    const fetchEventDetails = useCallback(async () => {
        try {
            const response = await axios.get(
                `http://127.0.0.1:8000/events/${eventId}`,
                {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            setEvent(response.data);
            checkAuthorization(response.data.email);
        } catch (error) {
            console.error("Error fetching event details:", error);
            alert("An error occurred while fetching event details.");
        }
    }, [eventId, checkAuthorization, user?.token]);

    // Fetch event details on component mount
    useEffect(() => {
        if (eventId && user?.token) {
            fetchEventDetails();
        }
    }, [eventId, user?.token, fetchEventDetails]);

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
                        Authorization: `Bearer ${user?.token}`,
                    },
                }
            );
            alert("File uploaded successfully!");
            fetchEventDetails(); // Refetch event details to update the status
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };

    if (!event) {
        return <div>Loading...</div>;
    }

    if (!isAuthorized) {
        return <div>You are not authorized to view this event.</div>;
    }

    const uploadButtonText =
        event.status === EventStatus.ALBUM_UPLOADED
            ? "Replace the Album"
            : "Upload the Album";

    return (
        <div className="event-detail-container">
            <h2 className="event-name">{event.name}</h2>
            <p className="event-date">Date: {event.date}</p>
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

            <div className="qr-code-section">
                <EventQRCode eventId={event.event_id}/>
            </div>

            <div className="guest-form-link">
                <Link to={`/events/${event.event_id}/guest-form`}>
                    Fill out the Guest Submission Form
                </Link>
            </div>
        </div>
    );
};

export default EventDetail;
