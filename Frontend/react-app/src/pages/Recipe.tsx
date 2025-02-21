import React, { useState } from "react";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import RecipesList from "../components/RecipesList";
import "./Recipe.css";

const RecipeSearch: React.FC = () => {
  const [recipes, setRecipes] = useState<
    { recipe_name: string; servings: number }[]
  >([]);

  return (
    <div className="recipe-dashboard">
      <main>
        <TopBar className="top-bar" />
        <SideBar setRecipes={setRecipes} />
        <RecipesList recipes={recipes} />
      </main>
    </div>
  );
};

export default RecipeSearch;
