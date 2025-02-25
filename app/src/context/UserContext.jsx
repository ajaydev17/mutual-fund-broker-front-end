import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("userToken") || "");

    // Store token only when it changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("userToken", token);
        }
    }, [token]);

    return (
        <UserContext.Provider value={{ token, setToken }}>
            {children}
        </UserContext.Provider>
    );
};
