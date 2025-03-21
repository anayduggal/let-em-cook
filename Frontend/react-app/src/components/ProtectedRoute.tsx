import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import "./Popup.css";

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // Convert to boolean
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowPopup(true);
    }
  }, [isAuthenticated]); // Show popup only when not authenticated

  const handleRedirect = () => {
    navigate("/login");
  };
  const handleCancel = () => {
    navigate("/");
  };

  if (isAuthenticated) {
    return <Outlet />; // If logged in, show the protected content
  }

  return (
    <>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2>🔒 Access Restricted</h2>
            <p>You need to log in to access this page.</p>
            <div className="popup-buttons">
              <button className="login-btn" onClick={handleRedirect}>
                Go to Login
              </button>
              <button className="close-btn" onClick={handleCancel}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
