import {QRCodeCanvas} from "qrcode.react";

const EventQRCode = ({eventId}) => {
    const API_BASE_URL = "http://photoguests.com";
    const eventFormUrl = `${API_BASE_URL}/guest-form/${eventId}`;

    return (
        <div className="text-center bg-white/30 backdrop-blur-md shadow-lg border border-white/20 rounded-xl p-6"
             dir="rtl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">סרקו כדי למלא את טופס האורחים</h3>
            <div className="inline-block p-4 bg-white rounded-lg shadow-md">
                <QRCodeCanvas value={eventFormUrl} size={256}/>
            </div>
        </div>
    );
};

export default EventQRCode;
