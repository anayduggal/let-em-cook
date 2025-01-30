async function submitForm() {

    const ingredients_input = document.getElementById("ingredients").value;

    const request_data = {
        action_type: "searchRecipes",
        ingredients: ingredients_input.split(",")
    };
    
    await fetch("http://localhost:8000/index.php/recipe", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request_data)
    })
    .then((response) => response.json()) 
    .then((data) => {

        const recipesContainer = document.getElementById('recipes-container');
        recipesContainer.innerHTML = '';

        data.forEach((recipe) => {
            
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');
            
            const recipeTitle = document.createElement('h3');
            recipeTitle.textContent = recipe.recipe_name;
            recipeDiv.appendChild(recipeTitle);
    
            const recipeServings = document.createElement('p');
            recipeServings.textContent = `Servings: ${recipe.servings}`;
            recipeDiv.appendChild(recipeServings);
            
            const viewDetailsLink = document.createElement('a');
            viewDetailsLink.href = `#`;
            viewDetailsLink.textContent = "View Recipe";
            recipeDiv.appendChild(viewDetailsLink);
    
            recipesContainer.appendChild(recipeDiv);
        });
    })

    // using xml
    /*
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(xhr.response);
        }
    };

    xhr.open("POST", "/recipe", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(request_data);
    */
    
};