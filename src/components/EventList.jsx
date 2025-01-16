import React, {useState, useEffect} from "react";
import axios from "axios";
import {Link} from "react-router-dom"; // Import Link from React Router for navigation
import EventForm from "./EventForm";
import EventCard from "./EventCard";
import "../styles/EventList.css"; // CSS for styling

const EventList = ({user}) => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/events", // Removed email query param
                    {
                        headers: {
                            Authorization: `Bearer ${user.token}`, // Include the JWT token in the Authorization header
                        },
                    }
                );
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        if (user?.token) {
            fetchEvents(); // Ensure token exists before making the request
        }
    }, [user?.token]);

    const handleEventCreated = (newEvent) => {
        setEvents((prevEvents) => [...prevEvents, newEvent]); // Append the new event
        setShowForm(false); // Hide the form after event creation
    };

    return (
        <div className="event-list-container">
            {!showForm && (
                <div className="welcome-container">
                    <h1>Welcome, {user.name}!</h1>
                    <button
                        className="toggle-form-button"
                        onClick={() => setShowForm((prev) => !prev)}
                    >
                        Create New Event
                    </button>
                </div>
            )}
            {showForm && <EventForm user={user} onEventCreated={handleEventCreated}/>}
            <div className="events-container">
                {events.length > 0 ? (
                    events.map((event) => (
                        <Link to={`/events/${event.event_id}`} key={event.event_id}>
                            <EventCard event={event}/>
                        </Link>
                    ))
                ) : (
                    <p className="no-events-message">No events found. Create a new one!</p>
                )}
            </div>
        </div>
    );
};

export default EventList;
