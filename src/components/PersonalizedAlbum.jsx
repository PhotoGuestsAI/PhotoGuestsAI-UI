import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import getBackendBaseUrl from "../utils/apiConfig";
import {motion} from "framer-motion";

const listVariants = {
    hidden: {opacity: 0},
    visible: {opacity: 1, transition: {staggerChildren: 0.2}},
};

const itemVariants = {
    hidden: {opacity: 0, y: 20},
    visible: {opacity: 1, y: 0},
};

const PersonalizedAlbum = ({user}) => {
    const {event_id, phone_number, guest_uuid} = useParams();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return;

        const fetchPhotos = async () => {
            try {
                const API_BASE_URL = getBackendBaseUrl();
                const response = await axios.get(
                    `${API_BASE_URL}/albums/get-personalized-album-photos/${event_id}/${phone_number}/${guest_uuid}`,
                    {
                        headers: {Authorization: `Bearer ${user.token}`},
                    }
                );

                setPhotos(response.data.photos || []);
            } catch (err) {
                console.error("Error fetching photos:", err);
                setError("Failed to load album.");
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [event_id, phone_number, guest_uuid, user]);

    if (!user) return null;
    if (loading) return <p className="text-center text-lg">Loading album...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
        <motion.div initial="hidden" animate="visible" exit="hidden">
            <div className="max-w-7xl mx-auto px-6 py-8">
                <motion.div className="flex justify-between items-center mb-8" variants={itemVariants}>
                    <h1 className="text-3xl font-bold text-gray-900">Your Personalized Album</h1>
                </motion.div>

                {photos.length === 0 ? (
                    <motion.p className="text-xl text-gray-600 col-span-full text-center bg-gray-100 p-8 rounded-lg">
                        No photos found for this album.
                    </motion.p>
                ) : (
                    <motion.div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={listVariants}>
                        {photos.map((photo, index) => (
                            <motion.div key={index} variants={itemVariants}>
                                <img
                                    src={photo}
                                    alt={`Album Photo ${index + 1}`}
                                    className="w-full h-40 object-cover rounded-lg shadow-md"
                                    onError={(e) => {
                                        e.target.src = "https://via.placeholder.com/150";
                                    }}
                                />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
};

export default PersonalizedAlbum;
