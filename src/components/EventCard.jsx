import React from "react";
import "../styles/EventCard.css";

const EventCard = ({event}) => {
    return (
        <div className="event-card">
            <h3>{event.event_name}</h3>
            <p>Date: {event.event_date}</p>
            <p>Photographer: {event.photographer_name}</p>
            <p>Status: {event.status}</p>
        </div>
    );
};

export default EventCard;
