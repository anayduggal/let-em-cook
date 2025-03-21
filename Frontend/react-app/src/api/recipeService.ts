export const getRecipes = async (amount: number, ingredients: string[]):Promise<any> => {

    // Get profile info
    // const profile_response = await fetch("http://localhost:8000/index.php/profile", {
    //     method: "POST",
    //     credentials: "include",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({ action_type: "getprofileinfo" })
    // });


    let recipe_request_data = {
        action_type: "randomrecipes",
        ingredients: ingredients
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