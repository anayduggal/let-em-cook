import React, { useState } from "react";
import "./SideBar.css";

interface SidebarProps {
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_name: string; servings: number }[]>
  >;
}

const SideBar: React.FC<SidebarProps> = ({ setRecipes }) => {
  const [ingredients, setIngredients] = useState<string>("");

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      action_type: "searchRecipes",
      ingredients: ingredients.split(","),
    };

    try {
      const response = await fetch("http://localhost:8000/index.php/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  return (
    <aside className="sidebar">
      <form onSubmit={submitForm}>
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
          required
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
