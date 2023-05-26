import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function RaidList() {
    let navigate = useNavigate();
    if (sessionStorage.getItem("username") !== "admin") {
        navigate("/");
        //window.location.href = "/";
    }

    const [raids, setRaids] = useState([]);

    useEffect(() => {
        fetchRaids();
    }, []);

    const fetchRaids = async () => {
        try {
        const response = await axios.get("http://localhost:8080/raids/getRaids");
        setRaids(response.data);
        } catch (error) {
        console.error("Failed to fetch raids", error);
        }
    };

    const handleChangeStatus = async (raidId) => {
        try {
        const response = await axios.put(
            `http://localhost:8080/raids/${raidId}/changeStatus`
        );
        const updatedRaid = response.data;
        setRaids((prevRaids) =>
            prevRaids.map((raid) => (raid.id === updatedRaid.id ? updatedRaid : raid))
        );
        console.log(`Raid status updated: ${updatedRaid.id}`);
        } catch (error) {
        console.error("Failed to update raid status", error);
        }
    };

    return (
        <div className="container friendship tableStyle">
        <h2>Raid List</h2>
        <table className="table">
            <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Level</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {raids.map((raid) => (
                <tr key={raid.id}>
                <td>
                    <img style={{ maxHeight: "40px" }} src={raid.image} alt="Raid" />
                </td>
                <td>{raid.name}</td>
                <td>{raid.lvl}</td>
                <td>
                    <button
                    className={`btn ${raid.status ? "btn-success" : "btn-danger"}`}
                    onClick={() => handleChangeStatus(raid.id)}
                    >
                    {raid.status ? "Active" : "Inactive"}
                    </button>
                </td>
                <td>
                    <Link to={`/editRaid/${raid.id}`} className="btn btn-primary">
                    Edit
                    </Link>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
    }
