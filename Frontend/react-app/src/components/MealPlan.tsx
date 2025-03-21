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
        <div className={`checkbox ${breakfast ? "checked" : ""}`} onClick={() => setBreakfast(!breakfast)}>
        BREAKFAST
        </div>
        <div className="divider" />
        <div className={`checkbox ${lunch ? "checked" : ""}`} onClick={() => setLunch(!lunch)}>
        LUNCH
        </div>
        <div className="divider" />
        <div className={`checkbox ${dinner ? "checked" : ""}`} onClick={() => setDinner(!dinner)}>
        DINNER
        </div>
        <button
        className="plan-button"
        onClick={() => console.log("Plan clicked")}
      >
        PLAN
      </button>
      </div>

      
    </div>
  );
};

export default MealPlan;
