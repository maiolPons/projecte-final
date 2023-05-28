import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";


export default function EditUser() {
  let navigate = useNavigate();

  if (sessionStorage.getItem("username") === "admin") {
    navigate("/admin");
  } else if (!sessionStorage.getItem("username")) {
    navigate("/");
  }

  const { userId } = useParams();
  const [currentUser, setCurrentUser] = useState(sessionStorage.getItem("username"));

  const [user, setUser] = useState({
    nickname: "",
    email: "",
    username: "",
    password: "",
    avatar: null,
  });

  useEffect(() => {
    // Fetch the user details when the component mounts
    fetchUser();
  }, [userId]); // Include userId as a dependency

  const fetchUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/users/getUserByUsername?username=" + currentUser
      );
      const { id, nickname, email, username, password } = response.data;
      setUser({ ...user, id, nickname, email, username, password });
    } catch (error) {
      console.error("Failed to fetch user", error);
    }
  };
  
  

  const onInputChange = (e) => {
    if (e.target.name === "avatar") {
      setUser({ ...user, [e.target.name]: e.target.files[0] });
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nickname", user.nickname);
    formData.append("email", user.email);
    formData.append("username", user.username);

    if (user.password !== "") {
        formData.append("password", user.password);
    }

    formData.append("avatar", user.avatar);

    try {
        await axios.put(`http://localhost:8080/users/editUser/${user.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        alert("Profile Changes saved");
    } catch (error) {
        console.error("An error occurred while updating the user.", error);
        alert("Error editing profile");
    }
};


  return (
    <div className="container">
      <div className="row">
        <div className="friendship col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Edit User</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nickname" className="form-label">
                Nickname
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Nickname"
                name="nickname"
                value={user.nickname}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                name="username"
                value={user.username}
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                name="password"
                onChange={onInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="avatar" className="form-label">
                Avatar
              </label>
              <input
                type="file"
                className="form-control"
                name="avatar"
                onChange={onInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update User
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
