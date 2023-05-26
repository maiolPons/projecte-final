import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditRaid({  }) {
    if(sessionStorage.getItem("username") !== "admin"){
        window.location.href = '/';
    }
    const { raidId } = useParams();

    const [raid, setRaid] = useState({
        name: "",
        image: null,
        lvl: 0,
    });

    useEffect(() => {
        
        fetchRaid();
    }, [raidId]); 

    const fetchRaid = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/raids/getRaidById/${raidId}`);
            const { name, lvl } = response.data;
            setRaid({ ...raid, name, lvl });
        } catch (error) {
            console.error("Failed to fetch raid", error);
        }
    };

    const onInputChange = (e) => {
        if (e.target.name === "image") {
        setRaid({ ...raid, [e.target.name]: e.target.files[0] });
        } else {
        setRaid({ ...raid, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", raid.name);
        formData.append("image", raid.image);
        formData.append("lvl", raid.lvl);

        try {
            await axios.put(`http://localhost:8080/raids/${raidId}`, formData, {
                headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        console.log("Raid updated successfully!");
        window.location.href = '/raidList';
        } catch (error) {
        console.error("An error occurred while updating the raid.", error);
        }
    };

    return (
        <div className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
            <h2 className="text-center m-4">Edit Raid</h2>
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
                    value={raid.name}
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
                <label htmlFor="lvl" className="form-label">
                    Level
                </label>
                <input
                    type="number"
                    className="form-control"
                    placeholder="Level"
                    name="lvl"
                    value={raid.lvl}
                    onChange={onInputChange}
                />
                </div>
                <button type="submit" className="btn btn-primary">
                Update Raid
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}
