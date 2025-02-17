import React from "react";
import LoginForm from "../components/LoginForm";

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <LoginForm type="login" />
    </div>
  );
};

export default Login;
