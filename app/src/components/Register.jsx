import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import Message from "./Message";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const submitRegistration = async () => {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        };

        try {
            const response = await fetch("/api/v1/auth/signup", requestOptions);
            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Registration failed. Please try again.");
                setMessageType("error");
            } else {
                setMessage(data.message || "Registration successful, Check email to verify your account!!.");
                setMessageType("success");
            }
        } catch (error) {
            setMessage("Network error. Please try again.");
            setMessageType("error");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password === confirmationPassword && password.length >= 8) {
            submitRegistration();
        } else {
            setMessage(
                "Ensure that the passwords match and are greater than or equal to 8 characters."
            );
            setMessageType("error");
        }
    };

    return (
        <div className="column">
            <form className="box" onSubmit={handleSubmit}>
                <h1 className="title has-text-centered">Register</h1>
                <div className="field">
                    <label className="label">Email Address</label>
                    <div className="control">
                        <input
                            type="email"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Password</label>
                    <div className="control">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Confirm Password</label>
                    <div className="control">
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={confirmationPassword}
                            onChange={(e) => setConfirmationPassword(e.target.value)}
                            className="input"
                            required
                        />
                    </div>
                </div>
                <Message message={message} type={messageType} />
                <br />
                <button className="button is-primary" type="submit">
                    Register
                </button>
            </form>
        </div>
    );
};

export default Register;
