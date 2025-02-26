import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

const Header = ({ title }) => {

    return (
        <div className="is-flex is-justify-content-center is-align-items-center m-6">
            <div className="is-flex is-align-items-center">
                <h1 className="title mr-4">{title}</h1>
            </div>
        </div>
    );
};

export default Header;
