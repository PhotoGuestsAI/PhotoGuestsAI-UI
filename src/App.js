import React, {useState} from "react";
import {GoogleOAuthProvider, GoogleLogin} from "@react-oauth/google";
import EventList from "./components/EventList";

const App = () => {
    const [user, setUser] = useState(null);

    const handleLoginSuccess = async (credentialResponse) => {
        const {credential} = credentialResponse;

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/verify-token", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({token: credential}),
            });

            if (!response.ok) {
                throw new Error("Token verification failed");
            }

            const data = await response.json();
            setUser(data.user); // Set the logged-in user
        } catch (error) {
            console.error("Error verifying Google token:", error);
        }
    };

    return (
        <GoogleOAuthProvider clientId="134801815902-ab4t528nqfnkadh4c93otdk80kcc1mhc.apps.googleusercontent.com">
            <div>
                {/* Conditionally render header */}
                {!user ? (
                    <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => console.error("Login Failed")}
                    />
                ) : (
                    <>
                        {/* Event management functionality */}
                        <EventList user={user}/>
                    </>
                )}
            </div>
        </GoogleOAuthProvider>
    );
};

export default App;
