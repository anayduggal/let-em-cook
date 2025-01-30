<?php

require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class RecipeModel extends Database

{

    public function getRecipes($limit)

    {

        return $this->select(
            "SELECT * FROM recipes ORDER BY recipe_id ASC LIMIT ?", ["i", $limit]
        );

    }

    public function getRecipeFromID($recipe_id)

    {

        return $this->select(
            "SELECT * FROM recipes WHERE recipe_id = ?", ["i", $recipe_id]
        );

    }

    public function getRecipeIngredientCounts()

    {
        $result = $this->select(
            "SELECT recipe_id, COUNT(ingredient_id) AS ingredient_count 
             FROM recipe_ingredients 
             GROUP BY recipe_id"
        );
    
        // Convert to associative array with recipe_id as keys
        $recipe_ingredient_counts = [];
        foreach ($result as $row) {
            $recipeIngredientCounts[$row['recipe_id']] = $row['ingredient_count'];
        }
    
        return $recipeIngredientCounts;
    }

    public function getIngredientIDs($ingredient_names)

    // takes in an array of ingredient names (str)
    // returns an array of corresponding ingredient ids (int)

    {

        $out = array();

        foreach ($ingredient_names as $i) {

            $id = $this->select(
                "SELECT ingredient_id FROM ingredients WHERE ingredient_name = ?", ["s", $i]
            );

            if (count($id)) {
                array_push($out, $id[0]['ingredient_id']);
            }

        }

        return $out;

    }

    public function parseRecipes($ingredient_ids)

    // takes in an array of ingredient ids 
    // then get an array of recipe ids for every recipe that contains that ingredient 
    // return all these arrays in a bigger array 

    {

        $out = array();

        foreach ($ingredient_ids as $i) {

            $recipes = $this->select(
                "SELECT recipe_id FROM recipe_ingredients WHERE ingredient_id = ?", ["i", $i]
            );

            if (count($recipes)) {
                $out[] = array_column($recipes, 'recipe_id');
            } else {
                $out[] = [];
            }
        }

        return $out;

    }

}
