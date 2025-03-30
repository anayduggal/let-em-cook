import React from "react";
import "./RecipeCard.css";

interface RecipeCardProps {
  recipe: { recipe_name: string; servings: number, source_link: string};
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe">
      <h3>{recipe.recipe_name}</h3>
      <p>Servings: {recipe.servings}</p>
      <a href={recipe.source_link} target="_blank">View Recipe</a>
    </div>
  );
};
  
export default RecipeCard;
