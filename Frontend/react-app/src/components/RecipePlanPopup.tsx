import React, { useState } from "react";
import "./RecipePlanPopup.css";
import { addCalendarRecipe } from "../api/recipeService";

interface RecipePlanPopupProps {
  recipe: { recipe_id: number; recipe_name: string; servings: number; source_link: string };
  show: boolean;
  onClose: () => void;
}

const RecipePlanPopup: React.FC<RecipePlanPopupProps> = ({ recipe, show, onClose }) => {
  const [selectedDate, setSelectedDate] = useState("");

  if (!show) return null;

  const handleAddRecipe = async () => {
    try {

      if (!selectedDate) {
        console.error("No date selected.");
        return;
      }

      await addCalendarRecipe(recipe.recipe_id, selectedDate);
      onClose();
    } catch (error) {
      console.error("Failed to add recipe to calendar:", error);
    }
  };

  return (
    <div className="recipe-popup-dimmer" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <h1 className="popup-title">ADD RECIPE TO CALENDAR</h1>
        <h2>{recipe.recipe_name}</h2>
        <p>Servings: {recipe.servings}</p>
        <label htmlFor="date-input" className="date-label">Select Date:</label>
        <input
          type="date"
          id="date-input"
          className="date-input"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <button className="add-recipe-button" onClick={handleAddRecipe}>Add Recipe</button>
      </div>
    </div>
  );
};

export default RecipePlanPopup;
