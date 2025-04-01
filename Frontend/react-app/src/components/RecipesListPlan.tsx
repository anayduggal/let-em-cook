import React, { FormEvent } from "react";
import RecipeCardPlan from "./RecipeCardPlan";
import "./RecipesList.css";
import { getRecipes, getRandomRecipes } from "../api/recipeService";

interface RecipesListPlanProps {
  recipes: { recipe_name: string; servings: number; source_link:string}[],
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_name: string; servings: number }[]>
  >;
  ingredients: string
}


const RecipesList: React.FC<RecipesListPlanProps> = ({ recipes }) => {
  return (
    <section className="recipes-section">
      <h1>RECIPES</h1>
      <div className="recipes-container">
        {recipes.length > 0 ? (
          recipes.map((recipe, index) => (
            <RecipeCardPlan key={index} recipe={recipe} />
          ))
        ) : (
          <p>No recipes found. Try searching for ingredients.</p>
        )}
      </div>
    </section>
  );
};

export default RecipesList;