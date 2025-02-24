import HomePage from "./pages/homepage";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import Pantry from "./components/Pantry";
import RecipePage from "./pages/Recipe";
import Profile from "./pages/Profile";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipes" element={<RecipePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pantry" element={<Pantry />} />
      </Routes>
    </Router>
  );
};

export default App;
