import React, {useState} from "react";
import axios from "axios";
import "../styles/GuestSubmissionForm.css";
import {useParams} from "react-router-dom";

const GuestSubmissionForm = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {eventId} = useParams(); // Get eventId from route params


    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phoneNumber);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhoneNumber(phone)) {
            setErrorMessage("Please enter a valid 10-digit phone number.");
            return;
        }

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", phone);
        formData.append("photo", photo);

        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/events/${eventId}/submit-guest`,
                formData,
                {headers: {"Content-Type": "multipart/form-data"}}
            );
            setMessage(response.data.message);
            setErrorMessage(""); // Clear any previous error message
            setName(""); // Clear form after success
            setPhone("");
            setPhoto(null);
        } catch (error) {
            console.error("Error submitting guest:", error);
            setErrorMessage("An error occurred while submitting your details.");
        }
    };

    return (
        <div className="guest-form-container">
            <h2 className="form-title">Guest Submission</h2>
            <form onSubmit={handleSubmit} className="guest-form">
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Enter your full name"
                    />
                </div>

                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="Enter your phone number"
                    />
                </div>

                <div className="form-group">
                    <label>Photo</label>
                    <input
                        type="file"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        accept="image/*"
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Submit</button>
            </form>

            {message && <div className="success-message">{message}</div>}
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default GuestSubmissionForm;
