import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Header = ({ title }) => {
    const { token, setToken } = useContext(UserContext);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const submitLogout = async () => {

        const requestOptions = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            const response = await fetch("/api/v1/auth/logout", requestOptions);
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed. Please try again!!.");
                setMessageType("error");
            } else {
                setToken(data.access_token);
            }
        } catch (error) {
            setMessage("Network error. Please try again!!.");
            setMessageType("error");
        }

        setToken(null);
        localStorage.removeItem("userToken"); // Ensure token is removed from localStorage
    };

    const handleLogout = (e) => {
        e.preventDefault();
        submitLogout();
    };

    return (
        <div className="has-text-centered m-6">
            <h1 className="title">{title}</h1>
            {token && (
                <button className="button" onClick={handleLogout}>
                    Logout
                </button>
            )}
        </div>
    );
};

export default Header;
