import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import RecipesList from "../components/RecipesList";
import "./Recipe.css";

const RecipeSearch: React.FC = () => {
  const [recipes, setRecipes] = useState<
    { recipe_name: string; servings: number }[]
  >([]);

  // Hardcoded test data
  useEffect(() => {
    setRecipes([
      { recipe_name: "Chicken Curry", servings: 4 },
      { recipe_name: "Pasta Carbonara", servings: 2 },
      { recipe_name: "Mango Sticky Rice", servings: 3 },
    ]);
  }, []);

  return (
    <div className="recipe-dashboard">
      <TopBar />
      <main>
        <SideBar setRecipes={setRecipes} />
        <RecipesList recipes={recipes} />
      </main>
    </div>
  );
};

export default RecipeSearch;
