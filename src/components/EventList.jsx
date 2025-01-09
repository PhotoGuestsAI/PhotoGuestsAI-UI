import React, {useState, useEffect} from "react";
import axios from "axios";
import EventForm from "./EventForm";
import EventCard from "./EventCard";

const EventList = ({user}) => {
    const [events, setEvents] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        // Fetch user's events only once
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
    }, [user?.email]); // Only run when `user.email` changes

    const handleEventCreated = (newEvent) => {
        setEvents([...events, newEvent]);
        setShowForm(false);
    };

    return (
        <div>
            <h1>Welcome, {user.name}!</h1>
            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? "Cancel" : "Create New Event"}
            </button>
            {showForm && <EventForm user={user} onEventCreated={handleEventCreated}/>}
            <div>
                {events.length > 0 ? (
                    events.map((event) => <EventCard key={event.event_id} event={event}/>)
                ) : (
                    <p>No events found. Create a new one!</p>
                )}
            </div>
        </div>
    );
};

export default EventList;
