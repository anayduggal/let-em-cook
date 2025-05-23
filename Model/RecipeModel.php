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

    public function getRandomRecipes($limit)

    {

        return $this->select(
            "SELECT * FROM recipes ORDER BY RAND() LIMIT ?", ["i", $limit]
        );

    }

    public function getRecipeFromID($recipe_id)

    {

        $recipes = $this->select(
            "SELECT * FROM recipes WHERE recipe_id = ?", ["i", $recipe_id]
        );

        if (empty($recipes)) {

            throw new Exception("Recipe ID does not exist: ".$recipe_id);

        }

        return $recipes[0];

    }

    public function getIngredientNamesFromRecipeID($recipe_id)
    {

        // takes in recipe id
        // returns an array of ingredient names for that recipe

        $result = $this->select(
            "SELECT i.ingredient_name 
            FROM recipe_ingredients ri
            JOIN ingredients i ON ri.ingredient_id = i.ingredient_id
            WHERE ri.recipe_id = ?", 
            ["i", $recipe_id]
        );

        $ingredients = [];
        foreach ($result as $row) {
            $ingredients[] = $row['ingredient_name'];
        }

        return $ingredients;
    }

    public function getRecipeIngredientCounts()

    {
        $result = $this->select(
            "SELECT recipe_id, COUNT(ingredient_id) AS ingredient_count 
             FROM recipe_ingredients 
             GROUP BY recipe_id"
        );
    
        // Convert to associative array with recipe_id as keys
        $recipeIngredientCounts = [];
        foreach ($result as $row) {
            $recipeIngredientCounts[$row['recipe_id']] = $row['ingredient_count'];
        }
    
        return $recipeIngredientCounts;
    }

    public function getRecipesWithIngredients($ingredient_names) 
    {
        $ingredient_ids = $this->getIngredientIDs($ingredient_names);
    
        if (empty($ingredient_ids)) {
            return [];
        }
    
        $placeholders = implode(',', array_fill(0, count($ingredient_ids), '?'));
        $types = str_repeat('i', count($ingredient_ids));
        $params = array_merge([$types], $ingredient_ids);
    
        $query = "
            SELECT DISTINCT recipe_id
            FROM recipe_ingredients
            WHERE ingredient_id IN ($placeholders)
        ";
    
        $recipes = $this->select($query, $params);
    
        return array_column($recipes, 'recipe_id');
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
