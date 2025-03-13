<?php
require __DIR__ . "/inc/bootstrap.php";

session_start();

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

                $recipe_controller = new RecipeController();

                if (isset($request_data["action_type"])) {

                    switch ($request_data["action_type"]) {

                        case "searchrecipes":

                            /*
                            search recipes:
                            get array of ingredient ids
                            then get an array of recipe ids for every recipe that contains each ingredient 
                            return all these arrays in a bigger array 
                            make an associative array of every recipe where the key is the recipe id and the value is the number of ingredients it has
                            for each recipe in the bigger array, decrement the count of the corresponding recipe in the associative array 
                            return the recipes where the value is 0
                            */

                            $return_data_json = $recipe_controller->searchRecipes($request_data["ingredients"]);

                            header('Content-Type: application/json');
                            echo $return_data_json;
                            break;
                    }
                }
                break;

            case "login":

                require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";

                $user_controller = new UserController();

                if (isset($request_data["action_type"])) {

                    switch ($request_data["action_type"]) {

                        case "login":

                            // login user
                            // send request to server with email and password

                            $user_controller->login($request_data["email"], $request_data["password"]);
                            break;
                    }
                }
                break;

            case "signup":

                require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";

                $user_controller = new UserController();

                if (isset($request_data["action_type"])) {

                    switch ($request_data["action_type"]) {

                        case "signup":

                            // create user
                            // send request to server with email, username, and password

                            $user_controller->createUser($request_data["email"], $request_data["username"], $request_data["password"]);
                            break;
                    }
                }
                break;

            case "dashboard":

                require PROJECT_ROOT_PATH . "/Controller/Api/DashboardController.php";

                $dashboard_controller = new DashboardController();

                if (isset($request_data["action_type"])) {

                    switch ($request_data["action_type"]) {

                        case "autocomplete":

                            // autocomplete function for typing in ingredient names
                            // send request to server with typed string and server returns an array of 5 ingredient names that match the typed string

                            $return_data_json = $dashboard_controller->autocomplete($request_data["typed_string"]);
                            echo $return_data_json;
                            break;

                        case "adduseringredient":

                            // add user ingredient
                            // send request to server with ingredient name, quantity, and use by date

                            $dashboard_controller->addIngredient($request_data["ingredient_string"], $request_data["quantity_string"], $request_data["useby_string"]);
                            break;

                        case "getpantry":
                            
                            // get pantry
                            // send request to server and server returns an array of all the ingredients the user has added to their pantry

                            $return_data_json = $dashboard_controller->getPantry();
                            echo $return_data_json;
                            break;
                    }
                }
                break;

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

            case "login":

                


            default:
                // handle homepage
                exit();

        }

    }

}