import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {Home, Calendar, LogOut} from "lucide-react";

const Navbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const isLoggedIn = user && user.email;

    const handleSignOut = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">
                    PhotoGuestsAI
                </Link>
                <div className="flex space-x-4">
                    <Link to="/" className="text-gray-700 hover:text-blue-600 flex items-center">
                        <Home className="h-5 w-5 mr-1"/> Home
                    </Link>
                    {isLoggedIn && (
                        <Link to="/events" className="text-gray-700 hover:text-blue-600 flex items-center">
                            <Calendar className="h-5 w-5 mr-1"/> Events
                        </Link>
                    )}
                    {isLoggedIn && (
                        <button onClick={handleSignOut} className="text-gray-700 hover:text-blue-600 flex items-center">
                            <LogOut className="h-5 w-5 mr-1"/> Sign Out
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
