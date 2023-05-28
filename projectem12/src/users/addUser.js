import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function AddUser(){
  if(sessionStorage.getItem("username") == "admin"){
    window.location.href = '/admin';
  }
  else if(sessionStorage.getItem("username")){
    window.location.href = '/';
  }
  

    useNavigate();
    const [avatar, setAvatar] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };
      
    const [user, setUser] = useState({
        nickname: '',
        email: '',
        username: '',
        password: '',
        role: 'standar'
      });
    
      const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('user', JSON.stringify(user));
        formData.append('avatar', avatar);
        try {
          await axios.post('http://localhost:8080/users/addUser', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            withCredentials: true
          });
          setSuccessMessage('User added successfully!');
          sessionStorage.setItem('role', 'standar');
          sessionStorage.setItem('username', user.username);
          window.location.href = '/logenHome';
        } catch (error) {
          console.log(error);
          setErrorMessage('The username or Email is already in use.');
        }
        
      };
      
      
    
      return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 friendship rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Register User</h2>
                    <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="nickname" className="form-label">Nickname</label>
                        <input type="text" className="form-control" placeholder="Nickname" name="nickname" value={user.nickname} onChange={onInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" placeholder="Email" name="email" value={user.email} onChange={onInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">Username</label>
                        <input type="text" className="form-control" placeholder="Username" name="username" value={user.username} onChange={onInputChange} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" placeholder="Password" name="password" value={user.password} onChange={onInputChange} />
                    </div>
                    <div className="mb-3">
                    <div>
                        <label htmlFor="avatar">Avatar:</label>
                        <input type="file" id="avatar" className="form-control" name="avatar" accept="image/*" onChange={handleAvatarChange} />
                    </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    </form>
                    {errorMessage && <div className="error">{errorMessage}</div>}

                    {successMessage && (
                        <div className="alert alert-success" role="alert">
                            {successMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
      );
}