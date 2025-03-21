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
            RECIPES
          </Link>
          <Link to="/dashboard" className="topbar-button">
            DASHBOARD
          </Link>
        </nav>
      </div>
      <div className="topbar-right">
        <button className="login-button" onClick={() => navigate("/login")}>
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default TopBar;
