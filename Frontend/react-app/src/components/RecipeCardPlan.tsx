import React, { useState } from "react";
import "./RecipeCard.css";
import RecipePlanPopup from "./RecipePlanPopup"; // Assuming this component exists

interface RecipeCardPlanProps {
  recipe: { recipe_id: number, recipe_name: string; servings: number, source_link: string, price_per_serving: number };
}

const RecipeCardPlan: React.FC<RecipeCardPlanProps> = ({ recipe }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleCardClick = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <>
      <div className="recipe" onClick={handleCardClick}>
        <h3>{recipe.recipe_name}</h3>
        <p>Servings: {recipe.servings}</p>
        <a href={recipe.source_link} target="_blank" onClick={(e) => e.stopPropagation()}>
          View Recipe
        </a>
      </div>
      <RecipePlanPopup recipe={recipe} show={isPopupOpen} onClose={closePopup} />
    </>
  );
};

export default RecipeCardPlan;
