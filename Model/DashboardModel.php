<?php

require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class DashboardModel extends Database

{

    public function addUserIngredientPantry($ingredient_string, $quantity_string, $useby_string) 
    
    {
        $ingredient_id = $this->select(
            "SELECT ingredient_id FROM ingredients WHERE ingredient_name = ?", ["i", $ingredient_string]
        );

        $this->insertInto(
            "INSERT INTO user_ingredients (user_id, ingredient_id, use_by, quantity, bought) VALUES (?, ?, STR_TO_DATE(?, '%d-%m-%Y'), ?, 1)", ["iii", $_SESSION['user_id'], $ingredient_id, $useby_string, $quantity_string]
        );

    }

    public function addUserIngredientShoppingList($ingredient_string)

    {
        $ingredient_id = $this->select(
            "SELECT ingredient_id FROM ingredients WHERE ingredient_name = ?", ["i", $ingredient_string]
        );

        $this->insertInto(
            "INSERT INTO user_ingredients (user_id, ingredient_id, use_by, quantity, bought) VALUES (?, ?, NULL, NULL, 0)", ["ii", $_SESSION['user_id'], $ingredient_id]
        );
    }

    public function boughtIngredient($ingredient_string, $quantity_string, $useby_string)

    {
        $ingredient_id = $this->select(
            "SELECT ingredient_id FROM ingredients WHERE ingredient_name = ?", ["i", $ingredient_string]
        );

        $this->update(
            "UPDATE user_ingredients SET bought = 1, quantity = ?, use_by = STR_TO_DATE(?, '%d-%m-%Y') WHERE user_id = ? AND ingredient_id = ?", ["ssis", $quantity_string, $useby_string, $_SESSION['user_id'], $ingredient_id]
        );
    }

    public function getUserPantry() 
    
    {
        $ingredient_rows = $this->select(
            "SELECT ingredient_id, use_by, quantity FROM user_ingredients WHERE user_id = ? AND bought = 1", ["i", $_SESSION['user_id']]
        );

        $pantry = [];

        foreach ($ingredient_rows as $row) {
            $ingredient = $this->select(
                "SELECT ingredient_name FROM ingredients WHERE ingredient_id = ?", ["i", $row['ingredient_id']]
            )[0];

            $ingredient['use_by'] = $row['use_by'];
            $ingredient['quantity'] = $row['quantity'];

            $pantry[] = $ingredient;
        }

        return $pantry;
    }

    public function getUserShoppingList() 
    
    {
        $recipe_ids = $this->select(
            "SELECT recipe_id FROM user_recipes WHERE user_id = ?", ["i", $_SESSION['user_id']]
        );

        $shopping_list = [];

        // loop through each recipe_id and get the ingredients
        foreach ($recipe_ids as $recipe) {
            $ingredients = $this->select(
                "SELECT ri.ingredient_id, ri.quantity, ri.unit, i.ingredient_name 
                 FROM recipe_ingredients ri 
                 JOIN ingredients i ON ri.ingredient_id = i.ingredient_id 
                 WHERE ri.recipe_id = ?", ["i", $recipe['recipe_id']]
            );

            // loop through each ingredient and add it to the shopping list
            foreach ($ingredients as $ingredient) {
                $shopping_list[] = [
                    'ingredient_name' => $ingredient['ingredient_name'],
                    'quantity' => $ingredient['quantity'] . " " . $ingredient['unit']
                ];
            }
        }

        return $shopping_list;
    }

    public function predictText($typed_string) 
    
    {
        return $this->select(
            "SELECT ingredient_name FROM ingredients WHERE ingredient_name LIKE ? LIMIT 5", ["s", $typed_string . '%']
        );
    }

    public function getUserRecipes() 
    {
        // get array of recipe_ids and cook_dates for the user
        $recipe_rows = $this->select(
            "SELECT recipe_id, cook_date FROM user_recipes WHERE user_id = ?", ["i", $_SESSION['user_id']]
        );

        $recipes = [];

        // get all recipes with those ids and include cook_date
        foreach ($recipe_rows as $row) {
            $recipe = $this->select(
                "SELECT recipe_name, source_link FROM recipes WHERE recipe_id = ?", ["i", $row['recipe_id']]
            );
            $recipes[] = [
                'recipe_id' => $row['recipe_id'],
                'recipe_name' => $recipe[0]['recipe_name'],
                'source_link' => $recipe[0]['source_link'],
                'cook_date' => $row['cook_date']
            ];
        }

        return $recipes;
    }

    public function addUserRecipe($recipe_id, $cook_date) 
    
    {
        // check if the recipe already exists in the user_recipes table at the same date
        $existing_recipe = $this->select(
            "SELECT * FROM user_recipes WHERE user_id = ? AND recipe_id = ? AND cook_date = ?", 
            ["iis", $_SESSION['user_id'], $recipe_id, $cook_date]
        );
        if (count($existing_recipe) > 0) {
            throw new Exception("Recipe already exists for this date");
        }

        // insert the recipe into the user_recipes table
        $this->insertInto(
            "INSERT INTO user_recipes (user_id, recipe_id, cook_date) VALUES (?, ?, ?)", 
            ["iis", $_SESSION['user_id'], $recipe_id, $cook_date]
        );

    }

}