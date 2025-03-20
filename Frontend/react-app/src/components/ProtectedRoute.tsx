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
  }, [isAuthenticated]); // Run only when auth state changes

  const handleRedirect = () => {
    setShowPopup(false);
    navigate("/login");
  };

  if (isAuthenticated) {
    return <Outlet />; // If logged in, show the protected page
  }

  return (
    <>
      {showPopup && (
        <div className="popup">
          <p>You need to log in first.</p>
          <button onClick={handleRedirect}>Go to Login</button>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
