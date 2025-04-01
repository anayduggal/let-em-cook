import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/MealPlan.css";

interface MealPlanProps {
  style?: React.CSSProperties;
}

const MealPlan: React.FC<MealPlanProps> = ({ style = {} }) => {
  const navigate = useNavigate();

  return (
    <div className="mealplan-container" style={style}>
      <div className="mealplan-main">
        <button
          className="plan-button"
          onClick={() => navigate("/recipeplan")}
        >
          PLAN
        </button>
      </div>
    </div>
  );
};

export default MealPlan;
