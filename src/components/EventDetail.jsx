import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom"; // Use useParams to get route params
import "../styles/EventDetail.css"; // Import CSS for styling

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [albumFile, setAlbumFile] = useState(null);

    const {eventId} = useParams(); // Get eventId from route params

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/events/${eventId}`
                );
                console.log("Event Details: ", response.data);  // Print the event details
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event details:", error);
            }
        };

        if (eventId) {
            fetchEventDetails();
        }
    }, [eventId]);

    const handleFileChange = (e) => {
        if (e.target.name === "album") {
            setAlbumFile(e.target.files[0]);
        }
    };

    // EventDetail.jsx (Frontend)
    const handleUpload = async () => {
        if (!albumFile) {
            alert("Please select the album zip file before uploading.");
            return;
        }

        const formData = new FormData();
        formData.append('album', albumFile);

        try {
            // Send the file to the backend to upload to S3
            await axios.post(
                `http://127.0.0.1:8000/events/${eventId}/upload-event-album`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );
            alert("File uploaded successfully!");
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    };


    if (!event) {
        return <div>Loading...</div>;
    }

    return (
        <div className="event-detail-container">
            <h2 className="event-name">{event.event_name}</h2>
            <p className="event-date">Date: {event.event_date}</p>
            <p className="photographer-name">Photographer: {event.photographer_name}</p>
            <p className="event-status">Status: {event.status}</p>

            <div className="upload-section">
                <h3>Upload Album Photos</h3>
                <input
                    type="file"
                    name="album"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>

            <button onClick={handleUpload} className="upload-button">Upload Files</button>
        </div>
    );
};

export default EventDetail;
