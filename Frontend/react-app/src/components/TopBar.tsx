import React from "react";
import "../components/TopBar.css";

interface TopBarProps {
  style?: React.CSSProperties;
}

const TopBar: React.FC<TopBarProps> = ({ style }) => {
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
          <button className="topbar-button">Recipes</button>
          <button className="topbar-button">Dashboard</button>
        </nav>
      </div>
      <div className="topbar-right">
        <button className="topbar-user-button">
          <img
            src="https://dashboard.codeparrot.ai/api/image/Z7cpv_3atcswnoug/profile.png"
            alt="User"
            className="topbar-user-icon"
          />
          User
        </button>
      </div>
    </div>
  );
};

export default TopBar;
