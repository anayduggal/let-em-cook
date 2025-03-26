import React, { FormEvent, useState, useEffect } from "react";
import "./SideBar.css";
import { getRecipes, getRandomRecipes, getAutocomplete } from "../api/recipeService";

interface SidebarProps {
  recipes: { recipe_name: string; servings: number }[],
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_name: string; servings: number }[]>
  >;
  ingredients: string,
  setIngredients: React.Dispatch<
    React.SetStateAction<string>
  >;
  budget: string,
  setBudget: React.Dispatch<
    React.SetStateAction<string>
  >;
}

const SideBar: React.FC<SidebarProps> = ({ setRecipes, ingredients, setIngredients, budget, setBudget }) => {
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

  const dietaryOptions = ["gluten_free", "dairy_free", "vegan", "vegetarian"];
  const allergenOptions = [
    "peanuts", "tree nuts", "milk", "eggs", "fish", "shellfish", 
    "wheat", "soy", "sesame", "mustard", "celery", "sulphites"
  ];

  const handleDietaryChange = (option: string) => {
    setDietaryPreferences((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleAllergenChange = (option: string) => {
    setAllergens((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleBudgetChange = (value: string) => {
    setBudget(value);
  };

  const handleIngredientsChange = async (value: string) => {
    setIngredients(value);

    // find the last typed ingredient
    const lastIngredient = value.split(",").pop()?.trim() || "";

    // if something typed, add autocomplete options
    if (lastIngredient.length > 0) {
      try {
        const predictions = await getAutocomplete(lastIngredient);
        setAutocompleteOptions(predictions);
      } catch (error) {
        console.error("Error fetching autocomplete options:", error);
        setAutocompleteOptions([]);
      }
    } else {
      setAutocompleteOptions([]);
    }
  };

  const handleAutocompleteSelect = (option: string) => {
    // appends autocompleted ingredient to the ingredients list
    const lastCommaIndex = ingredients.lastIndexOf(",");
    const updatedIngredients =
      lastCommaIndex === -1
        ? `${option}, `
        : ingredients.slice(0, lastCommaIndex + 1) + ` ${option}, `;
    setIngredients(updatedIngredients.trim());
    setAutocompleteOptions([]);
  };

  const generateRecipes = async (event: FormEvent) => {

    console.log("generateRecipes function called");

    event.preventDefault();
  
    ingredients = ingredients.trim();
  
    let unprocessedIngredientList = ingredients.split(",");
    let ingredientList: string[] = [];
  
    unprocessedIngredientList.forEach((ingredient: string) => {
      let trimmed = ingredient.trim();
      if (trimmed.length > 0) {
        ingredientList.push(trimmed);
      }
    });
  
    console.log("ingredients: ", ingredientList);
    console.log("dietaryPreferences: ", dietaryPreferences);
    console.log("allergens: ", allergens);

    // Map slider value to budget string
    const budgetValue =
      budget === "1" ? "low" : budget === "2" ? "medium" : "high";

    console.log("budget: ", budgetValue);
  
    let recipes: any[] = [];
  
    if (ingredientList.length === 0) {
      console.log("random");
      recipes = await getRandomRecipes(4); // Get random recipes
    } else {
      console.log("not");
  
      try {
        // Pass the correct data to getRecipes
        recipes = await getRecipes(4, ingredientList, allergens, dietaryPreferences, budgetValue);
      } catch (Error) {
        console.log("Recipe search with ingredients failed, getting random recipes");
  
        recipes = await getRandomRecipes(3); // Get random recipes
      }
    }
  
    console.log("recipes: ", recipes);
  
    setRecipes([]); // Reset recipes list
  
    recipes.forEach((recipe: any) => {
      setRecipes((recipes) => [...recipes, recipe]); // Add recipe
    });
  };

  return (
    <aside className="sidebar">
      <form onSubmit={generateRecipes}>
        <label htmlFor="ingredients">Ingredients (leave empty for random recipes)</label>
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          value={ingredients}
          onChange={(e) => handleIngredientsChange(e.target.value)}
        />
        {autocompleteOptions.length > 0 && (
          <ul className="autocomplete-dropdown">
            {autocompleteOptions.map((option, index) => (
              <li key={index} onClick={() => handleAutocompleteSelect(option)}>
                {option}
              </li>
            ))}
          </ul>
        )}

        <label htmlFor="budget">Budget</label>
        <input
          type="range"
          id="budget"
          name="budget"
          min="1"
          max="3"
          step="1"
          value={budget === "low" ? 1 : budget === "medium" ? 2 : 3}
          onChange={(e) =>
            handleBudgetChange(
              e.target.value === "1"
                ? "low"
                : e.target.value === "2"
                ? "medium"
                : "high"
            )
          }
        />
        <div className="budget-labels">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>

        <h3>Allergens</h3>
        {allergenOptions.map((option) => (
          <div key={option}>
            <label>
              <input
                type="checkbox"
                value={option}
                checked={allergens.includes(option)}
                onChange={() => handleAllergenChange(option)}
              />
              {option}
            </label>
          </div>
        ))}

        <h3>Dietary Requirements</h3>
        {dietaryOptions.map((option) => (
          <div key={option}>
            <label>
              <input
                type="checkbox"
                value={option}
                checked={dietaryPreferences.includes(option)}
                onChange={() => handleDietaryChange(option)}
              />
              {option}
            </label>
          </div>
        ))}

        <button type="submit" className="generate-btn">
          Generate
        </button>
      </form>
    </aside>
  );
};

export default SideBar;