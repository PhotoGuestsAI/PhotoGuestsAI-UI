import React, {useState} from "react";
import axios from "axios";
import "../styles/EventForm.css"; // Import styles

const EventForm = ({user, onEventCreated}) => {
    const [formData, setFormData] = useState({
        name: "",
        date: "",
        phone: "",
        username: user?.name || "",
        email: user?.email || "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [validationError, setValidationError] = useState("");

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;

        if (!emailRegex.test(formData.email)) {
            setValidationError("Invalid email format.");
            return false;
        }
        if (!phoneRegex.test(formData.phone)) {
            setValidationError("Phone number must be 10-15 digits.");
            return false;
        }

        setValidationError(""); // Clear any previous validation errors
        return true;
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData((prevData) => ({...prevData, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

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
            {validationError && <p className="error-message">{validationError}</p>}
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleSubmit} className="event-form">
                <div className="form-group">
                    <label htmlFor="event_name">Event Name:</label>
                    <input
                        type="text"
                        id="event_name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="event_date">Event Date:</label>
                    <input
                        type="date"
                        id="event_date"
                        name="date"
                        value={formData.date}
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
