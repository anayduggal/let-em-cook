export interface IngredientData {
    ingredient_name: string,
    use_by: string,
    quantity: string
};

export interface RecipeData {
    recipe_id: number,
    recipe_name: string,
    source_link: string,
    cook_date: Date
};


export const getRecipes = async (amount: number, ingredients: string[], allergens: string[], dietary_preferences: string[], budget: string):Promise<any> => {

    let recipe_request_data = {
        action_type: "searchrecipesnoaccount",
        ingredients: ingredients,
        allergens: allergens,
        dietary_preferences: dietary_preferences,
        budget: budget
    }

    // Get recipes w/ ingredients
    const recipe_response = await fetch("http://localhost:8000/index.php/recipe", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe_request_data)
    });

    console.log(recipe_response)

    let recipes = recipe_response.json()

    return recipes

}

export const getRecipesAccount = async (amount: number, seenRecipeIds: number[], ingredients: string[], budget: string): Promise<any> => {
    let recipe_request_data = {
        action_type: "searchrecipeswithaccount",
        amount: amount,
        seen_recipe_ids: seenRecipeIds,
        ingredients: ingredients,
        budget: budget
    };

    const recipe_response = await fetch("http://localhost:8000/index.php/recipe", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe_request_data)
    });

    let recipes = recipe_response.json();

    console.log(recipes)

    return recipes;
};


export const getRandomRecipes = async (amount: number):Promise<any> => {

    // Get random recipes
    let recipe_request_data = {
        action_type: "randomrecipes",
        amount: amount
    }
  
    const recipe_response = await fetch("http://localhost:8000/index.php/recipe", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe_request_data)
    });

    let recipes = recipe_response.json()

    return recipes

}

export const getAutocomplete = async (typed: string):Promise<string[]> => {

    let autocomplete_request_data = {
        action_type: "autocomplete",
        typed_string: typed
    }

    const autocomplete_response = await fetch("http://localhost:8000/index.php/dashboard", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(autocomplete_request_data)
    });

    let predictions = autocomplete_response.json()

    return predictions

};

export const getPantry = async ():Promise<IngredientData[]> => {

    const pantry_response = await fetch("http://localhost:8000/index.php/dashboard", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action_type: "getpantry" })
    });

    console.log(pantry_response)

    let pantry = pantry_response.json()

    return pantry

};

export const getShoppingList = async ():Promise<IngredientData[]> => {
    const shopping_response = await fetch("http://localhost:8000/index.php/dashboard", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action_type: "getshoppinglist" })
    });

    let shopping_list = shopping_response.json()

    return shopping_list

}

export const getUserRecipes = async ():Promise<RecipeData[]> => {
    const user_recipes_response = await fetch("http://localhost:8000/index.php/dashboard", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ action_type: "getuserrecipes" })
    });

    let user_recipes = user_recipes_response.json()

    return user_recipes

}

export const addCalendarRecipe = async (recipe_id: number, cook_date: string):Promise<any> => {

    console.log(cook_date)

    const recipe_request_data = {
        action_type: "addrecipe",
        recipe_id: recipe_id,
        cook_date: cook_date
    }

    const recipe_response = await fetch("http://localhost:8000/index.php/dashboard", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(recipe_request_data)
    });

    let response = recipe_response.json()

    return response

}