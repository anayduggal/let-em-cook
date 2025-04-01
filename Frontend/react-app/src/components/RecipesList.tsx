import React, { FormEvent } from "react";
import RecipeCard from "./RecipeCard";
import "./RecipesList.css";
import { getRecipes, getRandomRecipes } from "../api/recipeService";

interface RecipesListProps {
  recipes: { recipe_id: number, recipe_name: string; servings: number; source_link: string, price_per_serving: number}[],
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_name: string; servings: number }[]>
  >;
  ingredients: string
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
    </section>
  );
};

export default RecipesList;