import React, {useState} from "react";
import axios from "axios";
import {Calendar, Phone, User} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {getBackendBaseUrl, getVipUsers} from "../utils/apiConfig";

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
    const [successMessage, setSuccessMessage] = useState("");
    const [validationError, setValidationError] = useState("");

    const validateForm = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;
        if (!emailRegex.test(formData.email)) return setValidationError("Invalid email format.");
        if (!phoneRegex.test(formData.phone)) return setValidationError("Phone number must be 10-15 digits.");
        setValidationError("");
        return true;
    };

    const handleInputChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

    const handleDateChange = (date) => {
        setFormData({...formData, date: date ? date.toISOString().split('T')[0] : ""});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            const API_BASE_URL = getBackendBaseUrl();
            const token = user?.token;
            if (!token) {
                setError("Authentication required. Please log in again.");
                setLoading(false);
                return;
            }

            const dataWithToken = {
                ...formData,
                token: token
            };

            const VIP_USERS = getVipUsers();
            if (VIP_USERS.includes(user.email)) {
                const eventResponse = await axios.post(`${API_BASE_URL}/events/`, dataWithToken, {
                    headers: {Authorization: `Bearer ${token}`},
                });

                if (eventResponse.status === 200) {
                    setSuccessMessage("Event created successfully!");
                    setFormData({name: "", date: "", phone: "", username: user.name, email: user.email});
                    onEventCreated();
                    return;
                } else {
                    throw new Error("Failed to create event.");
                }
            }

            const paymentResponse = await axios.post(`${API_BASE_URL}/payment/create-payment`, dataWithToken, {
                headers: {Authorization: `Bearer ${token}`},
            });

            if (paymentResponse.data.approval_url) {
                window.location.href = paymentResponse.data.approval_url;
            } else {
                throw new Error("Failed to create PayPal payment.");
            }
        } catch (err) {
            setError("Failed to process payment. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/30 backdrop-blur-md shadow-lg border border-white/20 rounded-xl p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Event</h2>
            {validationError && <p className="text-red-500 mb-4">{validationError}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {successMessage && <p className="text-green-600 mb-4">{successMessage}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <InputField icon={<User/>} name="name" value={formData.name} onChange={handleInputChange}
                            placeholder="Enter event name"/>
                <DateInputField icon={<Calendar/>} name="date" value={formData.date} onChange={handleDateChange}/>
                <InputField icon={<Phone/>} name="phone" value={formData.phone} onChange={handleInputChange}
                            placeholder="Enter phone number"/>
                <button type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition"
                        disabled={loading}>
                    {loading ? "Creating..." : "Create Event"}
                </button>
            </form>
        </div>
    );
};

const InputField = ({icon, ...props}) => (
    <div className="flex items-center bg-gray-100 border rounded-md p-3">
        {icon}
        <input {...props}
               className="flex-1 bg-transparent border-none outline-none ml-3 text-gray-900 placeholder-gray-500"
               required/>
    </div>
);

const DateInputField = ({icon, name, value, onChange}) => (
    <div className="flex items-center bg-gray-100 border rounded-md p-3">
        {icon}
        <DatePicker
            selected={value ? new Date(value) : null}
            onChange={onChange}
            dateFormat="yyyy-MM-dd"
            className="flex-1 bg-transparent border-none outline-none ml-3 text-gray-900 placeholder-gray-500"
            required
        />
    </div>
);

export default EventForm;