import React, {useState} from "react";
import axios from "axios";
import "../styles/GuestSubmissionForm.css";
import {useParams} from "react-router-dom";

const countryCodes = {
    "IL": "+972", // Israel
    "US": "+1",   // United States
    "UK": "+44",  // United Kingdom
    "IN": "+91",  // India
};

const GuestSubmissionForm = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [countryCode, setCountryCode] = useState("+972"); // Default to Israel
    const [photo, setPhoto] = useState(null);
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const {eventId} = useParams(); // Get eventId from route params

    // Validate phone number (should be 9 digits for Israel)
    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{7,12}$/; // Adjusted for international formats
        return phoneRegex.test(phoneNumber);
    };

    const formatPhoneNumberForWhatsApp = (countryCode, phone) => {
        let formattedPhone = phone.replace(/^0+/, ""); // Remove leading zero(s)

        // Special handling for Argentina and Mexico
        if (countryCode === "+54" && !formattedPhone.startsWith("9")) {
            formattedPhone = "9" + formattedPhone;
        }
        if (countryCode === "+52" && !formattedPhone.startsWith("1")) {
            formattedPhone = "1" + formattedPhone;
        }

        return countryCode.replace("+", "") + formattedPhone;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePhoneNumber(phone)) {
            setErrorMessage("Please enter a valid phone number.");
            return;
        }

        const finalPhoneNumber = formatPhoneNumberForWhatsApp(countryCode, phone);
        console.log("Formatted WhatsApp Number:", finalPhoneNumber);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("phone", finalPhoneNumber);
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
                    <label>Country Code</label>
                    <select value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
                        {Object.entries(countryCodes).map(([country, code]) => (
                            <option key={country} value={code}>
                                {country} ({code})
                            </option>
                        ))}
                    </select>
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