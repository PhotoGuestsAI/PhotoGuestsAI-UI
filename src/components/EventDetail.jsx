import React, {useState, useEffect} from "react";
import axios from "axios";
import {useParams} from "react-router-dom"; // Use useParams to get route params
import "../styles/EventDetail.css"; // Import CSS for styling

const EventDetail = () => {
    const [event, setEvent] = useState(null);
    const [guestListFile, setGuestListFile] = useState(null);
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
        if (e.target.name === "guestList") {
            setGuestListFile(e.target.files[0]);
        } else if (e.target.name === "album") {
            setAlbumFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!guestListFile || !albumFile) {
            alert("Please select both files before uploading.");
            return;
        }

        try {
            // Upload the guest list CSV
            const guestListUploadUrl = event.upload_urls.guest_list_upload_url;
            await axios.put(guestListUploadUrl, guestListFile, {
                headers: {
                    "Content-Type": "application/csv",
                },
            });

            // Upload the album ZIP file
            const albumUploadUrl = event.upload_urls.album_upload_url;
            await axios.put(albumUploadUrl, albumFile, {
                headers: {
                    "Content-Type": "application/zip",
                },
            });

            alert("Files uploaded successfully!");
        } catch (error) {
            console.error("Error uploading files:", error);
            alert("An error occurred while uploading the files.");
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
                <h3>Upload Guest List CSV</h3>
                <input
                    type="file"
                    name="guestList"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="file-input"
                />
            </div>

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
