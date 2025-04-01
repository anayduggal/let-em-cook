import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import SideBarPlan from "../components/SideBarPlan";
import RecipesListPlan from "../components/RecipesListPlan";
import "./Recipe.css";

const RecipePlan: React.FC = () => {
  const [recipes, setRecipes] = useState<
    { recipe_name: string; servings: number }[]
  >([]);
  
  const [ingredients, setIngredients] = useState<string>("");
  const [budget, setBudget] = useState<string>("");

  return (
    <div className="recipe-dashboard">
      <TopBar />
      <main>
        <SideBarPlan recipes={recipes} setRecipes={setRecipes} ingredients={ingredients} setIngredients={setIngredients} budget={budget} setBudget={setBudget} />
        <RecipesListPlan recipes={recipes} setRecipes={setRecipes} ingredients={ingredients} />
      </main>
    </div>
  );
};

export default RecipePlan;
