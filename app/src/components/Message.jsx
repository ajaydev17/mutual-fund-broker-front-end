import React from "react";

const Message = ({ message, type }) => {
    if (!message) return null; // Don't render if message is empty

    const messageClass =
        type === "success" ? "has-text-weight-bold has-text-success" : "has-text-weight-bold has-text-danger";

    return <p className={messageClass}>{message}</p>;
};

export default Message;

