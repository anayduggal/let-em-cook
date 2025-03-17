import React from "react";
import RecipeCard from "./RecipeCard";
import "./RecipesList.css";

interface RecipesListProps {
  recipes: { recipe_name: string; servings: number }[];
}

const RecipesList: React.FC<RecipesListProps> = ({ recipes }) => {
  return (
    <section className="recipes-section">
      <h1>RECIPES</h1>
      <div className="recipes-container">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <RecipeCard key={index} recipe={recipe} />
          ))
        ) : (
          <p>No recipes found. Try searching for ingredients.</p>
        )}
      </div>
      <button className="regenerate-btn">Regenerate</button>
    </section>
  );
};

export default RecipesList;
