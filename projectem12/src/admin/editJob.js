import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function EditJob({  }) {
    if(sessionStorage.getItem("username") !== "admin"){
        window.location.href = '/';
    }
    const { jobId } = useParams();

    const [job, setJob] = useState({
        name: "",
        image: null,
        role: "",
    });

    useEffect(() => {
        fetchJob();
    }, [jobId]); 

    const fetchJob = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/jobs/getJobById/${jobId}`);
            const { name, role } = response.data;
            setJob({ ...job, name, role });
        } catch (error) {
            console.error("Failed to fetch job", error);
        }
    };

    const onInputChange = (e) => {
        if (e.target.name === "image") {
        setJob({ ...job, [e.target.name]: e.target.files[0] });
        } else {
        setJob({ ...job, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", job.name);
        formData.append("image", job.image);
        formData.append("role", job.role);

        try {
            await axios.put(`http://localhost:8080/jobs/${jobId}`, formData, {
                headers: {
            "Content-Type": "multipart/form-data",
            },
        });
        console.log("Job updated successfully!");
        window.location.href = '/jobList';

        } catch (error) {
        console.error("An error occurred while updating the job.", error);
        }
    };

    return (
        <div className="container">
        <div className="row">
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
            <h2 className="text-center m-4">Edit Job</h2>
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
                    value={job.name}
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
                <label htmlFor="role" className="form-label">
                    Role
                </label>
                <select
                    className="form-select"
                    name="role"
                    value={job.role}
                    onChange={onInputChange}
                >
                    <option value="">Select Role</option>
                    <option value="DPS">DPS</option>
                    <option value="TANK">Tank</option>
                    <option value="HEALER">Healer</option>
                </select>
                </div>
                <button type="submit" className="btn btn-primary">
                Update Job
                </button>
            </form>
            </div>
        </div>
        </div>
    );
}
