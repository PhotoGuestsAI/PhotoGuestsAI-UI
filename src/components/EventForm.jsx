import React, {useState} from "react";
import axios from "axios";
import "../styles/EventForm.css"; // Import styles

const EventForm = ({user, onEventCreated}) => {
    const [formData, setFormData] = useState({
        event_name: "",
        event_date: "",
        phone: "",
        photographer_name: user?.name || "",
        email: user?.email || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/events/", formData);
            onEventCreated(response.data);
        } catch (err) {
            setError("Failed to create the event. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="event-form-container">
            <h2>Create a New Event</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <label htmlFor="event_name">Event Name:</label>
                    <input
                        type="text"
                        id="event_name"
                        name="event_name"
                        value={formData.event_name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="event_date">Event Date:</label>
                    <input
                        type="date"
                        id="event_date"
                        name="event_date"
                        value={formData.event_date}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number:</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Creating..." : "Create Event"}
                </button>
            </form>
        </div>
    );
};

export default EventForm;
