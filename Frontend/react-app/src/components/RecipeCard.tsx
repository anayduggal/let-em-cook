import React from "react";
import "./RecipeCard.css";

interface RecipeCardProps {
  recipe: { recipe_name: string; servings: number };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe">
      <h3>{recipe.recipe_name}</h3>
      <p>Servings: {recipe.servings}</p>
      <a href="#">View Recipe</a>
    </div>
  );
};

export default RecipeCard;
