import React, { useState, useContext } from "react";
import Message from "./Message";
import { UserContext } from "../context/UserContext";

const Login = ({ switchToRegister }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const { setToken } = useContext(UserContext);

    const submitLogin = async () => {
        try {
            const response = await fetch("/api/v1/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (!response.ok) {
                setMessage(data.message || "Login failed. Try again.");
                setMessageType("error");
            } else {
                setToken(data.access_token);
            }
        } catch (error) {
            setMessage("Network error. Please try again.");
            setMessageType("error");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitLogin();
    };

    return (
        <div className="column is-vcentered is-flex is-justify-content-center">
            <div className="column is-one-third is-offset-one-third">
                <form className="box" onSubmit={handleSubmit}>
                    <h1 className="title has-text-centered">Login</h1>
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
                    <Message message={message} type={messageType} />
                    <br />
                    <button className="button is-primary" type="submit">
                        Login
                    </button>
                    <p className="has-text-centered mt-3">
                        Don't have an account?{" "}
                        <a
                            onClick={switchToRegister}
                            className="has-text-link"
                            style={{ cursor: "pointer" }}
                        >
                            Register here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
