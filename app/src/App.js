import React, { useContext, useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import { UserContext } from "./context/UserContext";

const App = () => {
    const [message, setMessage] = useState("");
    const { token } = useContext(UserContext); // Use destructuring

    const getWelcomeMessage = async () => {
        try {
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            };

            const response = await fetch(
                "/api/v1/auth/welcome",
                requestOptions
            );

            if (!response.ok) {
                throw new Error("Failed to fetch message");
            }

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error("Error fetching welcome message:", error);
        }
    };

    useEffect(() => {
        getWelcomeMessage();
    }, [token]); // Re-fetch when token changes

    return (
        <>
            <Header title={message} />
            <div className="columns">
                <div className="column"></div>
                <div className="column m-5 is-two-thirds">
                    {!token ? (
                        <div className="columns">
                            <Register /> <Login />
                        </div>
                    ) : (
                        <p>Table</p>
                    )}
                </div>
                <div className="column"></div>
            </div>
        </>
    );
};

export default App;
