<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

class RecipeController extends BaseController

{
    public function searchRecipesNoAccount($ingredient_names, $allergens, $budget, $dietary_preferences)

    {
 
        $error_str = '';

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
                    $recipes[] = $recipe[0];

                }

                switch ($budget) {
                    case "low":
                        $max_price = 100.00;
                        break;
                    case "medium":
                        $max_price = 300.00;
                        break;
                    case "high":
                        $max_price = 1000.00;
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

    public function searchRecipesWithAccount($seen_recipe_ids, $ingredient_names, $budget)

    {
    
        $error_str = '';

        try {

            $recipeModel = new RecipeModel();
            $userModel = new UserModel();

            if (!empty($ingredient_names)) {

                $user_id = $_SESSION['user_id'];

                $allergens = $userModel->getAllergensFromUserID($user_id);
                $dietary_preferences = $userModel->getPreferencesFromUserID($user_id);

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
                    $recipes[] = $recipe[0];

                }

                switch ($budget) {
                    case "low":
                        $max_price = 100.00;
                        break;
                    case "medium":
                        $max_price = 300.00;
                        break;
                    case "high":
                        $max_price = 1000.00;
                        break;
                }

                $filtered_recipes = [];
                
                foreach ($recipes as $recipe) {

                    if (count($filtered_recipes) >= 4) {
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

                    if ($fits_preference && !$contains_allergen) {
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
