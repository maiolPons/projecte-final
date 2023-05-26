import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditEmote({  }) {
    if(sessionStorage.getItem("username") !== "admin"){
        window.location.href = '/';
    }
    const { emoteId } = useParams();

    const [emote, setEmote] = useState({
        name: "",
        image: null,
    });

    useEffect(() => {
        
        fetchEmote();
    }, [emoteId]); 

    const fetchEmote = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/emotes/getEmoteById/${emoteId}`);
            const { name } = response.data;
            setEmote({ ...emote, name });
        } catch (error) {
            console.error("Failed to fetch emote", error);
        }
    };

    const onInputChange = (e) => {
        if (e.target.name === "image") {
        setEmote({ ...emote, [e.target.name]: e.target.files[0] });
        } else {
        setEmote({ ...emote, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", emote.name);
        formData.append("image", emote.image);

        try {
            await axios.put(`http://localhost:8080/emotes/${emoteId}`, formData, {
                headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        console.log("Emote updated successfully!");
        window.location.href = '/emoteList';
        } catch (error) {
        console.error("An error occurred while updating the emote.", error);
        }
    };

    return (
        <div className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
            <h2 className="text-center m-4">Edit Emote</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                <label htmlFor="name" className="form-label">
                    Name
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={emote.name}
                    onChange={onInputChange}
                />
                </div>
                <div className="mb-3">
                <label htmlFor="image" className="form-label">
                    Image
                </label>
                <input
                    type="file"
                    className="form-control"
                    placeholder="Image"
                    name="image"
                    onChange={onInputChange}
                />
                </div>
                <div className="mb-3">
                </div>
                <button type="submit" className="btn btn-primary">
                Update Emote
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}
