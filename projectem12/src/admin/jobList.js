import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function JobList() {
  let navigate = useNavigate();
    if (sessionStorage.getItem("username") !== "admin") {
      
      navigate("/");
      //window.location.href = "/";
    }

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
      fetchJobs();
    }, []);

    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/jobs/getJobs");
        setJobs(response.data);
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      }
    };

    const handleChangeStatus = async (jobId) => {
      try {
        const response = await axios.put(
          `http://localhost:8080/jobs/${jobId}/changeStatus`
        );
        const updatedJob = response.data;
        setJobs((prevJobs) =>
          prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job))
        );
        console.log(`Job status updated: ${updatedJob.id}`);
      } catch (error) {
        console.error("Failed to update job status", error);
      }
    };

    return (
      <div className="container friendship tableStyle">
        <h2>Job List</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>
                  <img style={{ maxHeight: "40px" }} src={job.image} alt="Job" />
                </td>
                <td>{job.name}</td>
                <td>{job.role}</td>
                <td>
                  <button
                    className={`btn ${job.status ? "btn-success" : "btn-danger"}`}
                    onClick={() => handleChangeStatus(job.id)}
                  >
                    {job.status ? "Active" : "Inactive"}
                  </button>
                </td>
                <td>
                  <Link to={`/editJob/${job.id}`} className="btn btn-primary">
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
