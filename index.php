<?php
require __DIR__ . "/inc/bootstrap.php";

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', trim($uri, '/'));

$req_method = $_SERVER["REQUEST_METHOD"];

if (strtoupper($req_method) == 'POST') {

    $request_data_json = file_get_contents("php://input");
    $request_data = json_decode($request_data_json, true);

    if (isset($uri[1])) {

        switch ($uri[1]) {

            case "recipe":

                require PROJECT_ROOT_PATH . "/Controller/Api/RecipeController.php";

                $recipeController = new RecipeController();

                if (isset($request_data["action_type"])) {

                    switch ($request_data["action_type"]) {
                        case "searchRecipes":

                            /*
                            search recipes:
                            get array of ingredient ids
                            then get an array of recipe ids for every recipe that contains each ingredient 
                            return all these arrays in a bigger array 
                            make an associative array of every recipe where the key is the recipe id and the value is the number of ingredients it has
                            for each recipe in the bigger array, decrement the count of the corresponding recipe in the associative array 
                            return the recipes where the value is 0
                            */

                            $return_data_json = $recipeController->searchRecipes($request_data["ingredients"]);

                            header('Content-Type: application/json');
                            echo $return_data_json;
                            break;
                    }
                }

            case "login":

                require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";

                $user_controller = new UserController();

                if (isset($request_data["action_type"])) {

                    switch ($request_data["action_type"]) {
                        case "login":
                            $user_controller->login($request_data["email"], $request_data["password"]);
                            break;
                    }
                }


            default:
                //handle homepage posts
                exit();

            

        }

    }

} else if (strtoupper($req_method) == 'GET') {

    if (!isset($uri[1])) {

        // handle error

    } else {

        switch ($uri[1]) {

            case "recipe":

                include __DIR__ . "/Frontend/Pages/index.html";
                break;

            default:
                // handle homepage
                exit();

        }

    }

}