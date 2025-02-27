import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/TopBar.css";

interface TopBarProps {
  style?: React.CSSProperties;
}

const TopBar: React.FC<TopBarProps> = ({ style }) => {
  const navigate = useNavigate();

  return (
    <div className="topbar-container" style={style}>
      <div className="topbar-left">
        <div className="topbar-logo">
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z7cpv_3atcswnoug/heading.png"
            alt="Logo"
          />
        </div>
        <nav className="topbar-nav">
          <Link to="/recipes" className="topbar-button">
            Recipes
          </Link>
          <Link to="/dashboard" className="topbar-button">
            Dashboard
          </Link>
        </nav>
      </div>
      <div className="topbar-right">
        <button
          className="topbar-user-button"
          onClick={() => navigate("/profile")}
        >
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z7cpv_3atcswnoug/profile.png"
            alt="User"
            className="topbar-user-icon"
          />
          User
        </button>
        <button className="login-button" onClick={() => navigate("/login")}>
          Login / Signup
        </button>
      </div>
    </div>
  );
};

export default TopBar;
