import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function EmoteList() {
    let navigate = useNavigate();
    if (sessionStorage.getItem("username") !== "admin") {
        navigate("/");
        //window.location.href = "/";
    }

    const [emotes, setEmotes] = useState([]);

    useEffect(() => {
        fetchEmotes();
    }, []);

    const fetchEmotes = async () => {
        try {
        const response = await axios.get("http://localhost:8080/emotes/getEmotes");
        setEmotes(response.data);
        } catch (error) {
        console.error("Failed to fetch emotes", error);
        }
    };

    const handleChangeStatus = async (emoteId) => {
        try {
        const response = await axios.put(
            `http://localhost:8080/emotes/${emoteId}/changeStatus`
        );
        const updatedEmote = response.data;
        setEmotes((prevEmotes) =>
            prevEmotes.map((emote) => (emote.id === updatedEmote.id ? updatedEmote : emote))
        );
        console.log(`Emote status updated: ${updatedEmote.id}`);
        } catch (error) {
        console.error("Failed to update emote status", error);
        }
    };

    return (
        <div className="container friendship tableStyle">
        <h2>Emote List</h2>
        <table className="table">
            <thead>
            <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {emotes.map((emote) => (
                <tr key={emote.id}>
                <td>
                    <img style={{ maxHeight: "40px" }} src={emote.imagePath} alt="Emote" />
                </td>
                <td>{emote.name}</td>
                <td>
                    <button
                    className={`btn ${emote.status ? "btn-success" : "btn-danger"}`}
                    onClick={() => handleChangeStatus(emote.id)}
                    >
                    {emote.status ? "Active" : "Inactive"}
                    </button>
                </td>
                <td>
                    <Link to={`/editEmote/${emote.id}`} className="btn btn-primary">
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
