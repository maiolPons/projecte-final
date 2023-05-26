import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginUser(){
    if(sessionStorage.getItem("username") == "admin"){
        window.location.href = '/admin';
      }
      else if(sessionStorage.getItem("username")){
        window.location.href = '/';
      }
    let navigate = useNavigate();

    const [user, setUser] = useState({
        username: "",
        password: ""
    })

   

    const{username, password} = user

    const onInputChange=(e)=>{
        setUser({...user, [e.target.name]:e.target.value})

    }

    const onSubmit =async(e)=>{
        e.preventDefault();
        const result = await axios.post("http://localhost:8080/users/login", user);
        if (result.data.split("/")[0] === "error") {
        document.getElementById("error").innerHTML = "Error with login";
        } else {
        sessionStorage.setItem("role", result.data.split("/")[0]);
        sessionStorage.setItem("username", result.data.split("/")[1]);
        try {
            const response = await axios.post(
                `http://localhost:8080/parties/partiesForMember/${result.data.split("/")[1]}`
              );
                const data = response.data[0].id;
                console.log(data)
                sessionStorage.setItem("party", data);
        } catch (error) {
            console.error("Error retrieving parties:", error);
        }

            window.location.href = '/';
        }
    }
    return <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 friendship rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Login</h2>
                    <form onSubmit={(e)=>onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">username</label>
                            <input type={"text"} className="form-control" placeholder="username" name="username" value={username} onChange={(e)=>onInputChange(e)}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type={"password"} className="form-control" placeholder="Password" name="password" value={password} onChange={(e)=>onInputChange(e)}/>
                        </div>
                        <button type="submit" className="btn btn-outline-primary">Submit</button>
                        <div id="error" className="mb-3">
                        </div>
                    </form>
                </div>
            </div>
        </div>
}