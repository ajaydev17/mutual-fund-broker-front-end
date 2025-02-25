import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

import Message from "./Message";
import { UserContext } from "../context/UserContext";

const Table = () => {
    const { token, setToken } = useContext(UserContext);
    const [investments, setInvestments] = useState(null);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loaded, setLoaded] = useState(false);

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

    return (
        <>
            <button className="button is-fullwidth mb-5 is-primary">
                Create An Investment
            </button>
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
                            <tr key={investment.investment_id}>
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
                                    <button className="button mr-2 is-info is-light">
                                        Update
                                    </button>
                                    <button className="button mr-2 is-danger is-light">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Loading</p>
            )}
        </>
    );
};

export default Table;
