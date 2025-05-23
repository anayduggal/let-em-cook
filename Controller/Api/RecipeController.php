<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

class RecipeController extends BaseController

{
    public function searchRecipesNoAccount($ingredient_names, $allergens, $budget, $dietary_preferences)

    {
 
        $error_str = '';
        $recipes = [];

        try {

            $recipeModel = new RecipeModel();

            if (!empty($ingredient_names) && empty(array_intersect($allergens, $ingredient_names))) {

                // takes in an array of ingredient names (str)
                // returns an array of corresponding ingredient ids (int)
                $ingredient_ids = $recipeModel->getIngredientIDs($ingredient_names);

                // takes in an array of ingredient ids 
                // then get an array of recipe ids for every recipe that contains that ingredient 
                // return all these arrays in a bigger array 
                $all_recipe_ids = $recipeModel->parseRecipes($ingredient_ids);

                $recipe_ingredient_counts = $recipeModel->getRecipeIngredientCounts();

                $valid_recipe_ids = [];

                foreach ($all_recipe_ids as $ids) {
                    foreach ($ids as $id) {
                        $recipe_ingredient_counts[$id]--;
                    }
                }

                foreach ($recipe_ingredient_counts as $id => $count) {
                    if ($count === 0) {
                        $valid_recipe_ids[] = $id;
                    }
                }

                $recipes = [];
                
                foreach ($valid_recipe_ids as $id) {

                    $recipe = $recipeModel->getRecipeFromID($id);

                    $recipes[] = $recipe;

                }

                switch ($budget) {
                    case "low":
                        $max_price = 60.00;
                        break;
                    case "medium":
                        $max_price = 150.00;
                        break;
                    case "high":
                        $max_price = 10000.00;
                        break;
                }

                $filtered_recipes = [];
                
                foreach ($recipes as $recipe) {

                    if ($recipe['price_per_serving'] > $max_price) {
                        continue;
                    }
                
                    $ingredients = $recipeModel->getIngredientNamesFromRecipeID($recipe['recipe_id']);
                    $contains_allergen = false;
                    $fits_preference = true;
                
                    foreach ($ingredients as $ingredient) {
                        if (in_array($ingredient, $allergens)) {
                            $contains_allergen = true;
                            break;
                        }
                    }

                    if (!empty($dietary_preferences)) {
                        foreach ($dietary_preferences as $preference) {
                            if (!isset($recipe[$preference]) || $recipe[$preference] == 0) {
                                $fits_preference = false;
                                break;
                            }
                        }
                    }

                    if (!$contains_allergen && $fits_preference) {
                        $filtered_recipes[] = $recipe;
                    }

                }
                
                $recipes = $filtered_recipes;
                
            } else {

                $error_str = 'Empty query';
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';

            }

        } catch (Error $e) {

            $error_str = $e->getMessage().'Something went wrong';
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }


        if (!$error_str) {

            return json_encode($recipes);

        } else {

            $this->sendOutput(json_encode(array('error' => $error_str)), 

                array('Content-Type: application/json', $strErrorHeader)

            );

        }

    }

    public function searchRecipesWithAccount($amount, $seen_recipe_ids, $ingredient_names, $budget)

    {
    
        $error_str = '';
        $recipes = [];

        try {

            $recipeModel = new RecipeModel();
            $userModel = new UserModel();

            if ($budget) {

                $user_id = $_SESSION['user_id'];

                $allergens = $userModel->getAllergensFromUserID($user_id);
                $dietary_preferences = $userModel->getPreferencesFromUserID($user_id);

                // error_log("allergens " . json_encode($allergens) . "\n\n");
                // error_log("dietary_preferences " . json_encode($dietary_preferences) . "\n\n");

                if (empty($ingredient_names)) {
                    $valid_recipe_ids = array_column($recipeModel->getRandomRecipes(100), 'recipe_id');
                } else {
                    $valid_recipe_ids = $recipeModel->getRecipesWithIngredients($ingredient_names);
                }

                shuffle($valid_recipe_ids);

                // error_log("valid_recipe_ids " . json_encode($valid_recipe_ids) . "\n\n");
                
                foreach ($valid_recipe_ids as $id) {

                    $recipe = $recipeModel->getRecipeFromID($id);
                    $recipes[] = $recipe;

                }

                error_log("budget" . json_encode($budget) . "\n\n");

                switch ($budget) {
                    case "low":
                        $max_price = 60.00;
                        break;
                    case "medium":
                        $max_price = 150.00;
                        break;
                    case "high":
                        $max_price = 10000.00;
                        break;
                }

                $filtered_recipes = [];
                
                foreach ($recipes as $recipe) {

                    // error_log("recipe_id: " . json_encode($recipe["recipe_id"]));
                    // error_log("price: " . json_encode($recipe["price_per_serving"]));

                    if (count($filtered_recipes) >= $amount) {
                        break;
                    }

                    if (in_array($recipe['recipe_id'], $seen_recipe_ids)) {
                        continue;
                    }

                    if ($recipe['price_per_serving'] > $max_price) {
                        continue;
                    }
                
                    $ingredients = $recipeModel->getIngredientNamesFromRecipeID($recipe['recipe_id']);
                    $fits_preference = true;
                    $contains_allergen = false;
                
                    if (!empty($allergens)) {
                        foreach ($ingredients as $ingredient) {
                            if (in_array($ingredient, $allergens)) {
                                // error_log("allergen spotted: " . json_encode($ingredient));
                                $contains_allergen = true;
                                break;
                            }
                        }
                    }

                    if (!empty($dietary_preferences)) {
                        foreach ($dietary_preferences as $preference) {
                            if (isset($recipe[$preference]) && $recipe[$preference] == 0) {
                                // error_log("recipe fits " . json_encode($preference) . ": " . json_encode($recipe[$preference]));
                                // error_log("not fit preference: " . json_encode($recipe["recipe_name"]));
                                $fits_preference = false;
                                break;
                            }
                        }
                    }

                    if ($fits_preference && !$contains_allergen) {
                        $filtered_recipes[] = $recipe;
                    }

                }
                
                $recipes = $filtered_recipes;

                $recipe_names = [];
                foreach ($recipes as $recipe) {
                    $recipe_names[] = $recipe['recipe_name'];
                }

                // error_log("recipes " . json_encode($recipe_names) . "\n\n");
                
            } else {

                $error_str = 'Empty query';
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';

            }

        } catch (Error $e) {

            $error_str = $e->getMessage().'Something went wrong';
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!$error_str) {

            return json_encode($recipes);

        } else {

            $this->sendOutput(json_encode(array('error' => $error_str)), 

                array('Content-Type: application/json', $strErrorHeader)

            );

        }

    }


    public function listAction()

    {

        $error_str = '';

        $requestMethod = $_SERVER["REQUEST_METHOD"];

        $arrQueryStringParams = $this->getQueryStringParams();

        if (strtoupper($requestMethod) == 'GET') {

            try {

                $recipeModel = new RecipeModel();

                $intLimit = 10;

                if (isset($arrQueryStringParams['limit']) && $arrQueryStringParams['limit']) {

                    $intLimit = $arrQueryStringParams['limit'];

                }

                $arrRecipes = $recipeModel->getRecipes($intLimit);

                $responseData = json_encode($arrRecipes);

            } catch (Error $e) {

                $error_str = $e->getMessage().'Something went wrong';

                $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

            }

        } else {

            $error_str = 'Method not supported';

            $strErrorHeader = 'HTTP/1.1 422 Unprocessable Entity';

        }

        // send output

        if (!$error_str) {

            $this->sendOutput(

                $responseData,

                array('Content-Type: application/json', 'HTTP/1.1 200 OK')

            );

        } else {

            $this->sendOutput(json_encode(array('error' => $error_str)), 

                array('Content-Type: application/json', $strErrorHeader)

            );

        }

    }

    public function randomRecipes($amount)

    {

        try {

            $recipeModel = new RecipeModel();

            $recipes = $recipeModel->getRandomRecipes($amount);

            $this->sendOutput(
                json_encode($recipes)
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        }

    }

}
