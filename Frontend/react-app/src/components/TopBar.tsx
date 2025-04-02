import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/TopBar.css";
import { sendCheckLoginRequest } from "../api/userService";

interface TopBarProps {
  style?: React.CSSProperties;
}

const TopBar: React.FC<TopBarProps> = ({ style }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean);

  useEffect(() => {
    const checkLoginStatus = async () => {
      console.log("checkLoginStatus called"); // Log when the function is called
      try {
        const loggedIn = await sendCheckLoginRequest();
        console.log("sendCheckLoginRequest result:", loggedIn); // Log the result
        setIsAuthenticated(loggedIn);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="topbar-container" style={style}>
      <div className="topbar-left">
        <div className="topbar-logo">
          <Link to="/">
            <img
              src="public/logo.png"
              alt="Logo"
            />
          </Link>
        </div>
        <nav className="topbar-nav">
          <Link to="/recipes" className="topbar-button">
            RECIPES
          </Link>
          <Link to="/dashboard" className="topbar-button">
            DASHBOARD
          </Link>
        </nav>
      </div>
      <div className="topbar-right">
        {isAuthenticated ? (
          <button
            className="topbar-user-button"
            onClick={() => navigate("/profile")}
          >
            <img
              src="https://dashboard.codeparrot.ai/api/image/Z7cpv_3atcswnoug/profile.png"
              alt="User"
              className="topbar-user-icon"
            />
            USER
          </button>
        ) : (
          <button className="login-button" onClick={() => navigate("/login")}>
            LOGIN
          </button>
        )}
      </div>
    </div>
  );
};

export default TopBar;
