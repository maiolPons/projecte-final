import React, { useState } from "react";
import axios from "axios";

export default function AddRaid() {
        if(sessionStorage.getItem("username") !== "admin"){
            window.location.href = '/';
        }
        const [raid, setRaid] = useState({
            name: "",
            image: null, 
            lvl: 0,
        });

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
            await axios.post("http://localhost:8080/raids/createRaid", formData, {
                headers: {
                "Content-Type": "multipart/form-data",
                },
            });
            
            console.log("Raid created successfully!");
            window.location.href = '/raidList';
            } catch (error) {
            console.error("An error occurred while creating the raid.", error);
            }
        };

        return (
            <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                <h2 className="text-center m-4">Create Raid</h2>
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
                    Create Raid
                    </button>
                </form>
                </div>
            </div>
            </div>
        );
    }
