<?php
header("Access-Control-Allow-Origin: http://localhost:5173");  // Change to frontend URL
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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

                            $return_data_json = $user_controller->login($request_data["email"], $request_data["password"]);
                            echo $return_data_json;

                            break;

                        case "checklogin":

                            // check if user is logged ini
                            // send request to server and server returns true if user is logged in, false otherwise

                            $return_data_json = $user_controller->checkLogin();
                            echo $return_data_json;
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

                            // Create new user

                            $user_controller->createUser(
                                $request_data["email"],
                                $request_data["first_name"],
                                $request_data["last_name"],
                                $request_data["password"]
                            );

                            break;
                    }
                }
                break;
            
            case "profile":

                // Check if user is logged in
                
                if (!isset($_SESSION['user_id'])) {
                    header('Content-Type: application/json');
                    echo json_encode(array('error' => 'User not logged in'));
                    exit();
                }

                require PROJECT_ROOT_PATH . "/Controller/Api/UserController.php";

                $user_controller = new UserController();

                if (isset($request_data["action_type"])) {

                    switch ($request_data["action_type"]) {

                        case "getprofileinfo":

                            // Gets all the information associated with the currently logged in user

                            $user_controller->getProfileInfo();
                            break;
                        
                        case "addpreferences":

                            // Adds a list of dietary preferences to the logged in user's account
                            
                            $user_controller->addDietaryPreferences($request_data["preferences"]);
                            break;

                        case "deletepreferences":

                            // Deletes a list of dietary preferences to the logged in user's account

                            $user_controller->deleteDietaryPreferences($request_data["preferences"]);
                            break;
                        
                        case "addallergens":

                            // TODO: Adds a list of allergens to the logged in user's account

                            $user_controller->addAllergens($request_data["allergens"]);
                            break;
                        
                        case "deleteallergens":

                            // TODO: Deletes a list of allergens from the logged in user's account

                            $user_controller->deleteAllergens($request_data["allergens"]);
                            break;

                    };

                };
                break;

            case "dashboard":

                // Check if user is logged in
                
                if (!isset($_SESSION['user_id'])) {
                    header('Content-Type: application/json');
                    echo json_encode(array('error' => 'User not logged in'));
                    exit();
                }

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

                        case "addpantryingredient":
                            
                            // add to pantry
                            // send request to server with ingredient name, quantity, and use by date

                            $dashboard_controller->addPantryIngredient(
                                $request_data["ingredient_string"],
                                $request_data["quantity_string"],
                                $request_data["useby_string"]
                            );
                            break;

                        case "addshoppinglistingredient":
                            
                            // add to shopping list
                            // send request to server with ingredient name

                            $dashboard_controller->addShoppingListIngredient($request_data["ingredient_string"]);
                            break;

                        case "moveingredienttopantry":

                            // move to pantry
                            // send request to server with ingredient name, quantity, and use by date

                            $dashboard_controller->moveIngredientShoppingListPantry(
                                $request_data["ingredient_string"],
                                $request_data["quantity_string"],
                                $request_data["useby_string"]
                            );
                            break;

                        case "getpantry":
                            
                            // get pantry
                            // send request to server and server returns an array of all the ingredients the user has added to their pantry

                            $return_data_json = $dashboard_controller->getPantry();
                            echo $return_data_json;
                            break;

                        case "getshoppinglist":
                            
                            // get shopping list
                            // send request to server and server returns an array of all the ingredients the user has added to their shopping list

                            $return_data_json = $dashboard_controller->getShoppingList();
                            echo $return_data_json;
                            break;

                        case "getcalendarinfo":
                            
                            // get calendar info
                            // send request to server and server returns an array of all the recipes the user has added to their calendar
                            // array contains cook_date

                            $return_data_json = $dashboard_controller->getCalendarRecipes();
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