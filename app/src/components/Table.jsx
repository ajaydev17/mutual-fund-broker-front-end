import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

import Message from "./Message";
import InvestmentModal from "./InvestmentModal";
import { UserContext } from "../context/UserContext";

const Table = () => {
    const { token, setToken } = useContext(UserContext);
    const [investments, setInvestments] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loaded, setLoaded] = useState(false);
    const [activeModal, setActiveModal] = useState(false);
    const [schemeCode, setSchemeCode] = useState("");

    const handleUpdate = async (schemeCode) => {
        setSchemeCode(schemeCode);
        setActiveModal(true);
    };

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

    const handleDelete = async (schemeCode) => {
        const requestOptions = {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({
                scheme_code: schemeCode,
            }),
        };

        const response = await fetch(`/api/v1/investment/delete-an-investment/${schemeCode}`, requestOptions);
        if (!response.ok) {
            setMessage("Failed to delete an investment");
            setMessageType("error");
        }

        getInvestments();
    };

    const getInvestments = async () => {
        const requestOptions = {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        };

        const response = await fetch("/api/v1/auth/me", requestOptions);

        if (!response.ok) {
            setMessage("Something went wrong. Couldn't load the investments");
            setMessageType("error");
        } else {
            const data = await response.json();
            setInvestments(data.investments);
            setLoaded(true);
        }
    };

    useEffect(() => {
        getInvestments();
    }, []);

    const handleModal = () => {
        setActiveModal(!activeModal);
        getInvestments();
        setSchemeCode(null);
    };

    return (
        <>
            <InvestmentModal
                active={activeModal}
                handleModal={handleModal}
                token={token}
                scheme_code={schemeCode}
                setMessage={setMessage}
                setMessageType={setMessageType}
            />

            {/* Wrapper for Create Investment & Logout Buttons */}
            <div
                className="is-flex is-align-items-center p-4"
                style={{ justifyContent: "center", position: "relative" }}
            >
                {token && (
                    <div
                        className="buttons"
                        style={{ position: "absolute", right: 1 }}
                    >
                        <button
                            className="button is-primary"
                            onClick={() => setActiveModal(true)}
                        >
                            Create An Investment
                        </button>
                        <button
                            className="button is-danger"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
            <br />
            <br />
            <Message message={message} type={messageType} />

            {loaded && investments ? (
                <table className="table is-fullwidth">
                    <thead>
                        <tr>
                            <th>Scheme Code</th>
                            <th>Scheme Name</th>
                            <th>Units</th>
                            <th>NAV</th>
                            <th>Current Value</th>
                            <th>Date</th>
                            <th>Fund Family</th>
                        </tr>
                    </thead>
                    <tbody>
                        {investments.map((investment) => (
                            <tr key={investment.scheme_code}>
                                <td>{investment.scheme_code}</td>
                                <td title={investment.scheme_name}>
                                    {investment.scheme_name.length > 20
                                        ? investment.scheme_name.substring(
                                              0,
                                              20
                                          ) + "..."
                                        : investment.scheme_name}
                                </td>
                                <td>{investment.units}</td>
                                <td>{investment.nav}</td>
                                <td>{investment.current_value}</td>
                                <td>{investment.date}</td>
                                <td title={investment.fund_family}>
                                    {investment.fund_family.length > 20
                                        ? investment.fund_family.substring(
                                              0,
                                              20
                                          ) + "..."
                                        : investment.fund_family}
                                </td>
                                <td>
                                    <div
                                        className="buttons"
                                        style={{
                                            display: "flex",
                                            justifyContent: "flex-end",
                                            gap: "10px",
                                        }}
                                    >
                                        <button
                                            className="button is-info is-light"
                                            onClick={() =>
                                                handleUpdate(
                                                    investment.scheme_code
                                                )
                                            }
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="button is-danger is-light"
                                            onClick={() =>
                                                handleDelete(
                                                    investment.scheme_code
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div
                    className="is-flex is-justify-content-center is-align-items-center"
                    style={{ height: "100vh" }}
                >
                    <span
                        className="loader"
                        style={{
                            width: "80px",
                            height: "80px",
                            borderWidth: "6px",
                        }}
                    ></span>
                </div>
            )}
        </>
    );
};

export default Table;
