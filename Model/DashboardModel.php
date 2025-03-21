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
        $ingredient_ids = $this->select(
            "SELECT * FROM user_ingredients WHERE user_id = ? AND bought = 1", ["i", $_SESSION['user_id']]
        );

        $pantry = [];

        foreach ($ingredient_ids as $ingredient_id) {
            $ingredient = $this->select(
                "SELECT * FROM ingredients WHERE ingredient_id = ?", ["i", $ingredient_id]
            );

            $pantry[] = $ingredient;
        }

        return $pantry;
    }

    public function getUserShoppingList() 
    
    {
        $ingredient_ids = $this->select(
            "SELECT * FROM user_ingredients WHERE user_id = ? AND bought = 0", ["i", $_SESSION['user_id']]
        );

        $shopping_list = [];

        foreach ($ingredient_ids as $ingredient_id) {
            $ingredient = $this->select(
                "SELECT * FROM ingredients WHERE ingredient_id = ?", ["i", $ingredient_id]
            );

            $shopping_list[] = $ingredient;
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

        $link_rows = $this->select(
            "SELECT recipe_id, cook_date FROM user_recipes WHERE user_id = ?", ["i", $_SESSION['user_id']]
        );

        $return_rows = [];

        foreach ($link_rows as $link_row) {
            $recipe = $this->select(
                "SELECT * FROM recipes WHERE recipe_id = ?", ["i", $link_row['recipe_id']]
            );

            $return_rows[] = [$link_row['cook_date']] . $recipe;
        }

        return $return_rows;

    }

}