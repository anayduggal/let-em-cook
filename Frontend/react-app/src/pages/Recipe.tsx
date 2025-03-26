import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import RecipesList from "../components/RecipesList";
import "./Recipe.css";

const RecipeSearch: React.FC = () => {
  const [recipes, setRecipes] = useState<
    { recipe_name: string; servings: number }[]
  >([]);
  
  const [ingredients, setIngredients] = useState<string>("");
  const [budget, setBudget] = useState<string>("");

  return (
    <div className="recipe-dashboard">
      <TopBar />
      <main>
        <SideBar recipes={recipes} setRecipes={setRecipes} ingredients={ingredients} setIngredients={setIngredients} budget={budget} setBudget={setBudget} />
        <RecipesList recipes={recipes} setRecipes={setRecipes} ingredients={ingredients} />
      </main>
    </div>
  );
};

export default RecipeSearch;
