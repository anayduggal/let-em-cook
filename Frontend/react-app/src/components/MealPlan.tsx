import React, { useState } from "react";
import "../components/MealPlan.css";

interface MealPlanProps {
  style?: React.CSSProperties;
}

const MealPlan: React.FC<MealPlanProps> = ({ style = {} }) => {
  const [breakfast, setBreakfast] = useState(false);
  const [lunch, setLunch] = useState(false);
  const [dinner, setDinner] = useState(false);

  return (
    <div className="mealplan-container" style={style}>
      <div className="mealplan-main">
        <div className="meal-section" onClick={() => setBreakfast(!breakfast)}>
          <div className={`checkbox ${breakfast ? "checked" : ""}`} />
          <span>Breakfast</span>
        </div>

        <div className="divider" />

        <div className="meal-section" onClick={() => setLunch(!lunch)}>
          <div className={`checkbox ${lunch ? "checked" : ""}`} />
          <span>Lunch</span>
        </div>

        <div className="divider" />

        <div className="meal-section" onClick={() => setDinner(!dinner)}>
          <div className={`checkbox ${dinner ? "checked" : ""}`} />
          <span>Dinner</span>
        </div>
      </div>

      <button
        className="plan-button"
        onClick={() => console.log("Plan clicked")}
      >
        PLAN
      </button>
    </div>
  );
};

export default MealPlan;
