import React, { useEffect, useState } from "react";

const InvestmentModal = ({
    active,
    handleModal,
    token,
    scheme_code,
    setMessage,
    setMessageType,
}) => {
    const [schemeCode, setSchemeCode] = useState("");
    const [units, setUnits] = useState("");
    const [fundFamily, setFundFamily] = useState("");
    const [schemeName, setSchemeName] = useState("");
    const [nav, setNav] = useState("");
    const [dateValue, setDateValue] = useState("");
    const [currentValue, setCurrentValue] = useState("");
    const [schemeOptions, setSchemeOptions] = useState([]);
    const [allschemeOptionsValue, setAllschemeOptionsValue] = useState({});

    useEffect(() => {
        const fetchSchemeOptions = async () => {
            try {
                const response = await fetch(
                    "/api/v1/investment/get-json-data-RapidAPI",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) throw new Error("Failed to fetch schemes");

                const data = await response.json();
                setSchemeOptions(Object.keys(data.fund_details)); // Scheme codes
                setAllschemeOptionsValue(data.fund_details);
            } catch (error) {
                setMessage(error.message);
                setMessageType("error");
            }
        };

        fetchSchemeOptions();
    }, [token]);

    useEffect(() => {
        const getInvestment = async () => {
            if (!scheme_code) return;

            try {
                const response = await fetch(
                    "/api/v1/investment/get-an-investment",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            scheme_code: parseInt(scheme_code, 10),
                        }),
                    }
                );

                if (!response.ok)
                    throw new Error("Could not get the investment");

                const data = await response.json();
                setSchemeCode(data.scheme_code);
                setSchemeName(data.scheme_name);
                setUnits(data.units);
                setNav(data.nav);
                setCurrentValue((data.units * data.nav).toFixed(4));
                setDateValue(data.date);
                setFundFamily(data.fund_family);
            } catch (error) {
                setMessage(error.message);
                setMessageType("error");
            }
        };

        getInvestment();
    }, [scheme_code, token]);

    const handleSchemeChange = (e) => {
        const selectedCode = e.target.value;
        setSchemeCode(selectedCode);

        const selectedScheme = allschemeOptionsValue[selectedCode];
        if (selectedScheme) {
            setSchemeName(selectedScheme.Scheme_Name);
            setFundFamily(selectedScheme.Mutual_Fund_Family);
            setNav(selectedScheme.Net_Asset_Value);
            setDateValue(selectedScheme.Date);
            setUnits(""); // Reset units
            setCurrentValue(""); // Reset current value
        }
    };

    const handleUnitsChange = (e) => {
        const newUnits = e.target.value;
        setUnits(newUnits);

        // Update current value based on new units and nav
        if (!isNaN(newUnits) && !isNaN(nav)) {
            setCurrentValue(
                (parseFloat(newUnits) * parseFloat(nav)).toFixed(4)
            );
        } else {
            setCurrentValue("");
        }
    };

    const cleanFormData = () => {
        setSchemeCode("");
        setUnits("");
        setFundFamily("");
        setSchemeName("");
        setNav("");
        setDateValue("");
        setCurrentValue("");
    };

    const handleCreateInvestment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/v1/investment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    scheme_code: parseInt(schemeCode, 10),
                    units: parseFloat(units),
                    fund_family: fundFamily,
                    scheme_name: schemeName,
                    nav: nav,
                    date: dateValue,
                    current_value: parseFloat((units * nav).toFixed(4)),
                }),
            });

            if (!response.ok) throw new Error("Failed to create investment");

            cleanFormData();
            handleModal();
        } catch (error) {
            setMessage(error.message);
            setMessageType("error");
        }
    };

    const handleUpdateInvestment = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/v1/investment", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    scheme_code: parseInt(scheme_code, 10),
                    units: parseFloat(units),
                    current_value: parseFloat((units * nav).toFixed(4)),
                }),
            });

            if (!response.ok) throw new Error("Failed to update investment");

            cleanFormData();
            handleModal();
        } catch (error) {
            setMessage(error.message);
            setMessageType("error");
        }
    };

    return (
        <div className={`modal ${active && "is-active"}`}>
            <div className="modal-background" onClick={handleModal}></div>
            <div className="modal-card">
                <header className="modal-card-head has-background-primary-light">
                    <h1 className="modal-card-title">
                        {scheme_code
                            ? "Update Investment"
                            : "Create Investment"}
                    </h1>
                </header>
                <section className="modal-card-body">
                    <form>
                        <div className="field">
                            <label className="label">Scheme Code</label>
                            <div className="control">
                                <div className="select">
                                    <select
                                        value={schemeCode}
                                        onChange={handleSchemeChange}
                                        required
                                    >
                                        <option value="">
                                            Select Scheme Code
                                        </option>
                                        {schemeOptions.map((code) => (
                                            <option key={code} value={code}>
                                                {code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Scheme Name</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter Scheme Name"
                                    value={schemeName}
                                    onChange={(e) =>
                                        setSchemeName(e.target.value)
                                    }
                                    className="input"
                                    required
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Units</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter Units"
                                    value={units}
                                    onChange={handleUnitsChange}
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">NAV</label>
                            <div className="control">
                                <input
                                    type="email"
                                    placeholder="Enter NAV"
                                    value={nav}
                                    onChange={(e) => setNav(e.target.value)}
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Cuurent Value</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter Current Value"
                                    value={currentValue}
                                    onChange={(e) =>
                                        setCurrentValue(e.target.value)
                                    }
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Date</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter Date"
                                    value={dateValue}
                                    onChange={(e) =>
                                        setDateValue(e.target.value)
                                    }
                                    className="input"
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Fund Family</label>
                            <div className="control">
                                <input
                                    type="text"
                                    placeholder="Enter Fund Family"
                                    value={fundFamily}
                                    onChange={(e) =>
                                        setFundFamily(e.target.value)
                                    }
                                    className="input"
                                />
                            </div>
                        </div>
                    </form>
                </section>
                <footer
                    className="modal-card-foot has-background-primary-light"
                    style={{
                        display: "flex",
                        gap: "15px",
                        justifyContent: "flex-end",
                    }}
                >
                    {scheme_code ? (
                        <button
                            className="button is-info"
                            onClick={handleUpdateInvestment}
                        >
                            Update
                        </button>
                    ) : (
                        <button
                            className="button is-primary"
                            onClick={handleCreateInvestment}
                        >
                            Create
                        </button>
                    )}
                    <button className="button" onClick={handleModal}>
                        Cancel
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default InvestmentModal;
