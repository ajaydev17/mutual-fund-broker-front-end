import React, { useState } from "react";
import Message from "./Message";

const Register = ({ switchToLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmationPassword, setConfirmationPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const submitRegistration = async () => {
        try {
            const response = await fetch("/api/v1/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || "Registration failed. Try again.");
                setMessageType("error");
            } else {
                setMessage(
                    data.message ||
                        "Registration successful. Verify your email!"
                );
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
            setMessage("Passwords must match and be at least 8 characters.");
            setMessageType("error");
        }
    };

    return (
        <div className="column is-vcentered is-flex is-justify-content-center">
            <div className="column is-one-third is-offset-one-third">
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
                                placeholder="Confirm password"
                                value={confirmationPassword}
                                onChange={(e) =>
                                    setConfirmationPassword(e.target.value)
                                }
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
                    <br />
                    <br />
                    <p className="has-text-centered mt-3">
                        Already have an account?{" "}
                        <a
                            onClick={switchToLogin}
                            className="has-text-link"
                            style={{ cursor: "pointer" }}
                        >
                            Login here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
