import React, { FormEvent } from "react";
import RecipeCard from "./RecipeCard";
import "./RecipesList.css";
import { getRecipes, getRandomRecipes } from "../api/recipeService";

interface RecipesListProps {
  recipes: { recipe_name: string; servings: number }[],
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_name: string; servings: number }[]>
  >;
  ingredients: string
}


const RecipesList: React.FC<RecipesListProps> = ({ recipes, setRecipes, ingredients }) => {
  const generateRecipes = async (event: FormEvent) => {
    event.preventDefault();

    ingredients = ingredients.trim();

    let unprocessedIngredientList = ingredients.split(",")
    let ingredientList:string[] = []

    unprocessedIngredientList.forEach((ingredient:string, i:number)=>{
      let trimmed = ingredient.trim();

      if (trimmed.length > 0) {
        ingredientList.push(trimmed);
      }
      
    })

    console.log("ingredients: ", ingredientList);

    let recipes:any[] = [];

    if (ingredientList.length == 0) {
      console.log("random");
      recipes = await getRandomRecipes(3);  // Get random recipes
    } else {
      console.log("not");

      try {
        recipes = await getRecipes(3, ingredientList);  // Get recipes with ingredients
      } catch (Error) {
        console.log("Recipe search with ingredients failed, getting random recipes");

        recipes = await getRandomRecipes(3);  // Get random recipes
      }
      
    }

    console.log("recipes: ", recipes);

    setRecipes([]);  // Reset recipes list

    recipes.forEach((recipe:any, i:number)=>{
      setRecipes((recipes) => [...recipes, recipe])  // Add recipe
    });
    
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
      <button className="regenerate-btn" onClick={(e) => generateRecipes(e)}>Regenerate</button>
    </section>
  );
};

export default RecipesList;