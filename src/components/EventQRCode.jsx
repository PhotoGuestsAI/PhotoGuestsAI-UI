import React from 'react';
import {QRCodeCanvas} from 'qrcode.react';

const EventQRCode = ({eventId}) => {
    const eventFormUrl = `http://localhost:3000/guest-form/${eventId}`;

    return (
        <div>
            <h3>Scan to Fill the Guest Form</h3>
            <QRCodeCanvas value={eventFormUrl} size={256}/>
        </div>
    );
};

export default EventQRCode;
