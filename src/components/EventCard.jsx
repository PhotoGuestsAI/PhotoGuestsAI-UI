import React from "react";
import "../styles/EventCard.css";

const EventCard = ({event}) => {
    return (
        <div className="event-card">
            <h3>{event.name}</h3>
            <p>Date: {event.date}</p>
            <p>Status: {event.status}</p>
        </div>
    );
};

export default EventCard;
