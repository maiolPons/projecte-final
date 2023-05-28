import axios from "axios";
import React, { useState } from "react";

export default function AddJob() {
    if(sessionStorage.getItem("username") !== "admin"){
        window.location.href = '/';
    }
  const [job, setJob] = useState({
    name: "",
    image: null, 
    role: "",
  });

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
      await axios.post("http://localhost:8080/jobs/createJob", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Job created successfully!");
      window.location.href = '/jobList';
    } catch (error) {
      console.error("An error occurred while creating the job.", error);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Create Job</h2>
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
                <option value="TANK">TANK</option>
                <option value="HEALER">HEALER</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              Create Job
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
