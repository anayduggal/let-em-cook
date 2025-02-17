import React from "react";
import LoginForm from "../components/LoginForm"; // Adjust the path if needed

const Signup: React.FC = () => {
  return (
    <div className="signup-page">
      <LoginForm type="signup" />
    </div>
  );
};

export default Signup;
