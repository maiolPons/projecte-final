    import axios from "axios";
    import React, { useState } from "react";

    export default function AddEmote() {
      if(sessionStorage.getItem("username") !== "admin"){
        window.location.href = '/';
    }
      const [emote, setEmote] = useState({
        name: "",
        imagePath: null,
      });

      const onInputChange = (e) => {
        if (e.target.name === "imagePath") {
          setEmote({ ...emote, [e.target.name]: e.target.files[0] }); 
        } else {
          setEmote({ ...emote, [e.target.name]: e.target.value });
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", emote.name);
        formData.append("imagePath", emote.imagePath);
        try {
          await axios.post("http://localhost:8080/emotes/createEmote", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Emote created successfully!");
          window.location.href = '/listEmotes';

        } catch (error) {
          console.error("An error occurred while creating the emote.", error);
        }
      };

      return (
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
              <h2 className="text-center m-4">Create Emote</h2>
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
                  <label htmlFor="imagePath" className="form-label">
                    Image
                  </label>
                  <input
                    type="file" 
                    className="form-control"
                    placeholder="Image Path"
                    name="imagePath"
                    onChange={onInputChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Create Emote
                </button>
              </form>
            </div>
          </div>
        </div>
      );
    }
