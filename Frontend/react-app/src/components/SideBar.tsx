import React, { FormEvent, useState } from "react";
import "./SideBar.css";
import { getRecipes, getRandomRecipes } from "../api/recipeService";

interface SidebarProps {
  recipes: { recipe_name: string; servings: number }[],
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_name: string; servings: number }[]>
  >;
  ingredients: string,
  setIngredients: React.Dispatch<
    React.SetStateAction<string>
  >;
}

const SideBar: React.FC<SidebarProps> = ({ setRecipes, ingredients, setIngredients }) => {
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

    try {
      const response = await fetch("http://localhost:8000/index.php/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

    if (ingredientList.length == 0) {
      recipes = await getRandomRecipes(3);  // Get random recipes
    } else {
      recipes = await getRecipes(3, ingredientList);  // Get recipes with ingredients
    }
    
    setRecipes([]);  // Reset recipes list

    recipes.forEach((recipe:any, i:number)=>{
      setRecipes((recipes) => [...recipes, recipe])  // Add recipe
    });

    console.log(recipes);
  
  }

  return (
    <aside className="sidebar">
      <form onSubmit={generateRecipes}>
        <h3>Dietary Requirements</h3>
        <button type="button" className="expand-btn">
          +
        </button>

        <h3>Allergens</h3>
        <button type="button" className="expand-btn">
          +
        </button>

        <label htmlFor="ingredients">Ingredients</label>
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />

        <label htmlFor="cuisine">Filter by Cuisine</label>
        <input type="text" id="cuisine" name="cuisine" />

        <label htmlFor="budget">Budget (£)</label>
        <input type="text" id="budget" name="budget" />

        <button type="submit" className="generate-btn">
          Generate
        </button>
      </form>
    </aside>
  );
};

export default SideBar;
