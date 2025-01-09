import React, {useState} from "react";
import axios from "axios";

const EventForm = ({user, onEventCreated}) => {
    const [eventName, setEventName] = useState("");
    const [eventDate, setEventDate] = useState("");
    const [phone, setPhone] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newEvent = {
            event_name: eventName,
            event_date: eventDate,
            phone: phone,
            email: user.email,
            photographer_name: user.name,
        };

        try {
            const response = await axios.post("http://127.0.0.1:8000/events/", newEvent);
            onEventCreated(response.data); // Notify parent component
        } catch (error) {
            console.error("Error creating event:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Event Name:</label>
                <input
                    type="text"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Event Date:</label>
                <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Phone:</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Create Event</button>
        </form>
    );
};

export default EventForm;
