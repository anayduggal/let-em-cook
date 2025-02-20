import React from "react";
import "./HomePage.css";
import { useNavigate, Link } from "react-router-dom";

interface HomePageProps {
  onMealPlanClick?: () => void;
  onQuickMealClick?: () => void;
  onLoginClick?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({
  onMealPlanClick = () => {},
  onQuickMealClick = () => {},
  onLoginClick = () => {},
}) => {
  const navigate = useNavigate();

  // Add route navigation inside the button click handlers
  const handleMealPlanClick = () => {
    onMealPlanClick();
    navigate("/dashboard"); // Navigate to meal plan route
  };

  const handleQuickMealClick = () => {
    onQuickMealClick();
    navigate("/recipes"); // Navigate to quick meal route
  };

  const handleLoginClick = () => {
    onLoginClick();
    navigate("/login"); // Navigate to login route
  };

  return (
    <div className="homepage">
      <nav className="navbar">
        <div className="nav-left">
          <div className="logo-container">
            <img
              src="https://dashboard.codeparrot.ai/api/image/Z6sqofrycnbNR_pY/heading.png"
              alt="Logo"
              className="logo"
            />
          </div>
          <div className="nav-links">
            <a href="#recipes">Recipes</a>
            <Link to="/dashboard">Dashboard</Link>
          </div>
        </div>
        <button className="login-button" onClick={handleLoginClick}>
          Login / Sign up
        </button>
      </nav>

      <main className="main-content">
        <div className="hero-section">
          <h1 className="hero-title">LET 'EM COOK</h1>
          <p className="hero-subtitle">
            Food. Fast. <span className="highlight">NOT</span> fast food
          </p>
          <div className="cta-buttons">
            <button
              className="cta-button meal-plan"
              onClick={handleMealPlanClick}
            >
              Meal Plan
            </button>
            <button
              className="cta-button quick-meal"
              onClick={onQuickMealClick}
            >
              Find a quick meal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
