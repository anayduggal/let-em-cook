<?php

require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class DashboardModel extends Database

{

    public function addUserIngredient($ingredient_string, $quantity_string, $useby_string) 
    
    {
        $ingredient_id = $this->select(
            "SELECT ingredient_id FROM ingredients WHERE ingredient_name = ?", ["i", $ingredient_string]
        );

        $this->insertInto(
            "INSERT INTO user_ingredients (user_id, ingredient_id, use_by, quantity) VALUES (?, ?, STR_TO_DATE(?, '%d-%m-%Y'))", ["iii", $_SESSION['user_id'], $ingredient_id, $useby_string, $quantity_string]
        );

    }

    public function predictText($typed_string) 
    
    {
        return $this->select(
            "SELECT ingredient_name FROM ingredients WHERE ingredient_name LIKE ? LIMIT 5", ["s", $typed_string . '%']
        );
    }

}