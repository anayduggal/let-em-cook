import React, { FormEvent, useState, useEffect } from "react";
import "./SideBarPlan.css";
import { getRecipesAccount, getAutocomplete } from "../api/recipeService";

interface SideBarPlanProps {
  recipes: { recipe_id: number; recipe_name: string; servings: number; source_link: string }[],
  setRecipes: React.Dispatch<
    React.SetStateAction<{ recipe_id: number; recipe_name: string; servings: number; source_link: string }[]>
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

const SideBarPlan: React.FC<SideBarPlanProps> = ({ setRecipes, ingredients, setIngredients, budget, setBudget }) => {
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [seenRecipeIDs, setSeenRecipeIDs] = useState<number[]>([]);

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

    // Map slider value to budget string
    const budgetValue =
      budget === "low" ? "low" : budget === "medium" ? "medium" : "high"; // Ensure correct mapping

    console.log("budget: ", budgetValue);
  
    let recipes: any[] = [];

    console.log(seenRecipeIDs, ingredientList, budgetValue);
  
    if (ingredientList.length === 0) {
      console.log("random");
      recipes = await getRecipesAccount(4, seenRecipeIDs, ingredientList, budgetValue); // Get random recipes
    } else {
      console.log("not random");
  
      try {
        // Pass the correct data to getRecipesAccount
        recipes = await getRecipesAccount(4, seenRecipeIDs, ingredientList, budgetValue);
      } catch (Error) {
        console.log("Recipe search with ingredients failed, getting random recipes");
        recipes = await getRecipesAccount(4, seenRecipeIDs, [], budgetValue); // Get random recipes
      }
    }
  
    console.log("recipes: ", recipes);
  
    setRecipes([]); // Reset recipes list
  
    recipes.forEach((recipe: any) => {
      setRecipes((recipes) => [...recipes, recipe]); // Add recipe
    });

    // add new recipe ids to seenrecipeids
    const newSeenRecipeIDs = recipes.map((recipe: any) => recipe.recipe_id);
    setSeenRecipeIDs((prevSeenRecipeIDs) => [
      ...prevSeenRecipeIDs,
      ...newSeenRecipeIDs,
    ]);

  };

  return (
    <aside className="sidebar-plan">
      <h2 className="sidebar-title">RECIPE PLAN</h2>
      <form onSubmit={generateRecipes}>
        <label htmlFor="ingredients">Ingredients (leave empty for random recipes)</label>
        <input
          type="text"
          id="ingredients"
          name="ingredients"
          value={ingredients}
          onChange={(e) => handleIngredientsChange(e.target.value)}
          autoComplete="off"
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
          value={budget === "low" ? 1 : budget === "medium" ? 2 : 3} // Ensure slider reflects correct budget
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

        <button type="submit" className="generate-btn">
          Generate
        </button>

        <br/>

        <details>
          <summary>Disclaimer</summary>
          <p>
            We cannot 100% guarantee that the recipes will be free of the selected allergies, please check the ingredients before cooking
          </p>
        </details>
      </form>
    </aside>
  );
};

export default SideBarPlan;