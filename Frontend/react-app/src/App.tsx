import HomePage from "./pages/homepage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import LoginSignupForm from "./components/LoginSignupForm/LoginSignupForm";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
};

export default App;
