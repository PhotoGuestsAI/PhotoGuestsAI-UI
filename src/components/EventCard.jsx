import React from "react";

const EventCard = ({event}) => {
    return (
        <div>
            <h3>{event.event_name}</h3>
            <p>Date: {event.event_date}</p>
            <p>Phone: {event.phone}</p>
            <p>Status: {event.status}</p>
        </div>
    );
};

export default EventCard;
