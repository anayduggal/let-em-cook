import React from "react";
import { useNavigate } from "react-router-dom";
import "./homepage.css";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <main className="main-content">
        {/* Hero Section */}
        <section className="hero-section">
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
        </section>

        {/* Who We Are Section */}
        <section className="who-we-are">
          <h2>Who We Are</h2>
          <p>
            We’re all about making your meal prep fun and easy! Join us on this
            culinary adventure to create delicious, healthy meals. Let’s cook up
            some magic together!
          </p>
        </section>

        {/* Features Section */}
        <section className="features">
          <h2>Our Features</h2>
          <div className="feature-item">
            <h3>Healthy Meals</h3>
            <p>Fuel your body with delicious, wholesome meals.</p>
          </div>
          <div className="feature-item">
            <h3>Quick & Easy</h3>
            <p>Meals that are fast and fun to make!</p>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="cta-section">
          <h2>Ready to Cook?</h2>
          <button onClick={() => navigate("/recipes")} className="cta-button">
            Get Started
          </button>
        </section>
      </main>
    </div>
  );
};

export default HomePage;