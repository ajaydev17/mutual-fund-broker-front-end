import React, { useContext, useEffect, useState } from "react";
import Register from "./components/Register";
import Login from "./components/Login";
import Header from "./components/Header";
import Table from "./components/Table";
import { UserContext } from "./context/UserContext";

const App = () => {
    const [message, setMessage] = useState("");
    const { token } = useContext(UserContext);
    const [showLogin, setShowLogin] = useState(false);

    const getWelcomeMessage = async () => {
        try {
            const response = await fetch("/api/v1/auth/welcome", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Failed to fetch message");

            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error("Error fetching welcome message:", error);
        }
    };

    useEffect(() => {
        getWelcomeMessage();
    }, [token]);

    return (
        <>
            <Header title={message} />
            <div className="columns">
                <div className="column"></div>
                <div className="column m-5 is-two-thirds">
                    {!token ? (
                        <div className="columns">
                            {showLogin ? (
                                <Login switchToRegister={() => setShowLogin(false)} />
                            ) : (
                                <Register switchToLogin={() => setShowLogin(true)} />
                            )}
                        </div>
                    ) : (
                        <Table />
                    )}
                </div>
                <div className="column"></div>
            </div>
        </>
    );
};

export default App;
