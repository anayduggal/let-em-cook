<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

class RecipeController extends BaseController

{
    public function searchRecipes($ingredient_names)

    {
 
        $error_str = '';

        try {

            $recipeModel = new RecipeModel();

            if (!empty($ingredient_names)) {

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
    public function searchRecipesWithoutAccount($allergens, $budget)
    {
        $error_str = '';
        try {
            $recipeModel = new RecipeModel();
            $recipes = $recipeModel->getRecipesByAllergensAndBudget($allergens, $budget);
        } catch (Error $e) {
            $error_str = $e->getMessage() . ' Something went wrong';
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

    public function searchRecipesWithAccount($userId, $budget, $allergens, $ingredients)
    {
        $error_str = '';
        try {
            $recipeModel = new RecipeModel();
            
            // Fetch previously suggested recipes to avoid repetition
            $seenRecipeIds = $recipeModel->getUserSeenRecipes($userId);
            
            // Fetch new recipes based on criteria
            $recipes = $recipeModel->getNewRecipesByCriteria($budget, $allergens, $ingredients, $seenRecipeIds);
            
            // Select up to 4 recipes
            $recipes = array_slice($recipes, 0, 4);
            
            // Update user's seen recipes
            $recipeModel->updateUserSeenRecipes($userId, array_column($recipes, 'recipe_id'));
        } catch (Error $e) {
            $error_str = $e->getMessage() . ' Something went wrong';
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

}
