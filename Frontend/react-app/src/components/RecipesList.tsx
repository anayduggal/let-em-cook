import React, { FormEvent } from "react";
import RecipeCard from "./RecipeCard";
import "./RecipesList.css";
import { getRecipes } from "../api/recipeService";

interface RecipesListProps {
  recipes: { recipe_name: string; servings: number }[],
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_name: string; servings: number }[]>
  >;
  ingredients: string
}


const RecipesList: React.FC<RecipesListProps> = ({ recipes, setRecipes, ingredients }) => {
  const generateRecipes = async () => {

    let recipes = await getRecipes(3, ingredients.split(", "));

    setRecipes([]);  // Reset recipes list

    recipes.forEach((recipe:any, i:number)=>{
      setRecipes((recipes) => [...recipes, recipe])  // Add recipe
    });

    console.log(recipes);
  
  }

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
      <button className="regenerate-btn" onClick={() => generateRecipes()}>Regenerate</button>
    </section>
  );
};

export default RecipesList;
