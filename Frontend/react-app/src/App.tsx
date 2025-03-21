import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/homepage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import Pantry from "./components/Pantry";
import RecipeSearch from "./pages/Recipe";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/index.php/checklogin", {
      credentials: "include", // Ensures cookies/session are included
    })
      .then((res) => res.json())
      .then((data) => setIsLoggedIn(data.loggedIn))
      .catch((err) => {
        console.error("Error checking login status:", err);
        setIsLoggedIn(false);
      });
  }, []);

  if (isLoggedIn === null) {
    return <p>Loading...</p>; // Prevents rendering before status is known
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={isLoggedIn ? <HomePage /> : <Login />} />
        <Route path="/recipes" element={<RecipeSearch />} /> \\
        <Route
          path="/signup"
          element={isLoggedIn ? <HomePage /> : <Signup />}
        />
        <Route element={<ProtectedRoute isLoggedIn={isLoggedIn} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pantry" element={<Pantry />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
