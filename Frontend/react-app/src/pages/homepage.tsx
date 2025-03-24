import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import "./homepage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <TopBar onLoginClick={() => navigate("/login")} />
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-section-contents">
          <h1 className="hero-title">
            <span className="left">LET 'EM</span>
            <span className="right">COOK</span>
          </h1>
          <p className="hero-subtitle">
            Food. Fast. <span className="not-highlight">NOT</span> fast food
          </p>
          <div className="cta-buttons">
            <button
              className="cta-button meal-plan"
              onClick={() => navigate("/dashboard")}
            >
              Meal Plan
            </button>
            <button
              className="cta-button quick-meal"
              onClick={() => navigate("/recipes")}
            >
              Find a quick meal
            </button>
          </div>
          </div>
          <img className = "main-img" src="theguy.png" alt="a very cool guy" />
        </section>

        <section className="hungry-now">
          <img className = "otherguy-img" src="otherguy.png" alt="a not so cool guy" />
          <div className="hungry-now-content">
          <h2>HUNGRY NOW?</h2>
          <p>
          Search through recipes according to
          the ingredients you have
          </p>
          <button
              className="cta-button quick-meal"
              onClick={() => navigate("/recipes")}
            >
              Find a recipe
            </button>
          </div>
        </section>

        
        <section className="get-organised">
          <div className="get-organised-content">
          <h2>GET ORGANISED</h2>
            <p>Easily organise your weekly culinary 
            experience with us</p>

            <button
              className="cta-button meal-plan"
              onClick={() => navigate("/dashboard")}
            >
              Meal Plan
            </button>
          </div>
          <img className = "calendar-img" src="calendar-img.png" alt="calendar" />
        </section>

    
        <section className="cta-section">
          <div className="cta-section-content">
          <h2>READY TO COOK?</h2>
          <p>Join us and revolutionise your eating habits</p>
          <button onClick={() => navigate("/signup")} className="cta-button">
            Get Started
          </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;
