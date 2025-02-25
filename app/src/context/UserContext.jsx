import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("userToken") || "");

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) return; // Prevent unnecessary API calls

            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            };

            try {
                const response = await fetch("/api/v1/auth/me", requestOptions);

                if (response.status === 401) {
                    console.warn("Unauthorized! Logging out...");
                    setToken(null);
                    localStorage.removeItem("userToken");
                }
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, [token]);

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
