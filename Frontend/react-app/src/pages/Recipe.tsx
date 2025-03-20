import React, { useState, useEffect } from "react";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import RecipesList from "../components/RecipesList";
import "./Recipe.css";

const RecipeSearch: React.FC = () => {
  const [recipes, setRecipes] = useState<
    { recipe_name: string; servings: number }[]
  >([]);

  // Fetch recipes on initial render or when the ingredients change
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("http://localhost:8000/index.php/recipe");
        const data = await response.json();
        setRecipes(data); // Set recipes fetched from the server
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []); // You can pass ingredients as a dependency if you want to refetch when ingredients change

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
