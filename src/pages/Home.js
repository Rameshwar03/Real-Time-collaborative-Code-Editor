import React, { useState } from "react";
import "./../App.css";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [userName, setuserName] = useState("");

  const joinRoom = () => {
    if (!id || !userName) {
      toast.error("Room id and username is required");
      return;
    }

    // redirect to new route
    navigate(`/editor/${id}`, {
      state: {
        userName,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") joinRoom();
  };

  const createNewRoom = (e) => {
    e.preventDefault();
    var id = Math.random().toString(16).slice(2) + new Date().getTime();
    setId(id);
    toast.success("Created new room");
  };

  return (
    <div className="homePage">
      {/* form */}
      <div className="form">
        <img src="/main-Logo.png" alt="Logo" className="HomePageLogo" />
        <h4 className="main-label">PASTE INVITATION ROOM ID</h4>

        <div className="inputGroup">
          <input
            type="text"
            className="inputBox"
            placeholder="ROOM ID"
            onChange={(e) => setId(e.target.value)}
            value={id}
            onKeyUp={handleInputEnter}
          />

          <input
            type="text"
            className="inputBox"
            placeholder="User Name"
            onChange={(e) => setuserName(e.target.value)}
            value={userName}
            onKeyUp={handleInputEnter}
          />

          <button className="btn joinBtn" onClick={joinRoom}>
            Join
          </button>

          <span className="createInfo">
            Don't have invite ? &nbsp;
            <a href="/" className="createnewBtn" onClick={createNewRoom}>
              Create room
            </a>
          </span>
        </div>
      </div>

      {/* footer */}
      <footer>
        <h4>Built and run by Code.AI</h4>
      </footer>
    </div>
  );
};

export default Home;
