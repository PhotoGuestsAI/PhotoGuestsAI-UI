import React, {useState, useEffect} from "react";
import axios from "axios";
import EventForm from "./EventForm";
import EventCard from "./EventCard";
import "../styles/EventList.css"; // CSS for styling

const EventList = ({user}) => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/events?email=${user.email}`);
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        if (user?.email) {
            fetchEvents();
        }
    }, [user?.email]);

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
                    events.map((event) => <EventCard key={event.event_id} event={event}/>)
                ) : (
                    <p className="no-events-message">No events found. Create a new one!</p>
                )}
            </div>
        </div>
    );
};

export default EventList;
