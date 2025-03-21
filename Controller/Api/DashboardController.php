<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

class DashboardController extends BaseController

{
    public function autocomplete($typed_string)

    {
        $error_str = '';

        try {

            $dashboardModel = new DashboardModel();

            if (!empty($typed_string)) {

                $ingredient_names = $dashboardModel->predictText($typed_string);

                $ingredient_names = array_map(function ($ingredient) {
                    return $ingredient['ingredient_name'];
                }, $ingredient_names);

                return json_encode($ingredient_names);

            } else {

                $error_str = 'Empty query';
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';

            }
        } catch (Exception $e) {

            $error_str = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!empty($error_str)) {
            header($strErrorHeader);
            return $error_str;
        }
    }

    public function addPantryIngredient($ingredient_string, $quantity_string, $useby_string)

    {
        $error_str = '';

        try {

            $dashboardModel = new DashboardModel();

            if (!empty($ingredient_string) && !empty($quantity_string) && !empty($useby_string)) {

                $dashboardModel->addUserIngredientPantry($ingredient_string, $quantity_string, $useby_string);

            } else {

                $error_str = 'Empty query';
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';

            }
        } catch (Exception $e) {

            $error_str = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!empty($error_str)) {
            header($strErrorHeader);
            return $error_str;
        }
    }

    public function addShoppingListIngredient($ingredient_string)

    {
        $error_str = '';

        try {

            $dashboardModel = new DashboardModel();

            if (!empty($ingredient_string)) {

                $dashboardModel->addUserIngredientShoppingList($ingredient_string);

            } else {

                $error_str = 'Empty query';
                $strErrorHeader = 'HTTP/1.1 400 Bad Request';

            }
        } catch (Exception $e) {

            $error_str = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!empty($error_str)) {
            header($strErrorHeader);
            return $error_str;
        }
    }

    public function moveIngredientShoppingListPantry($ingredient_string, $quantity_string, $useby_string)
    
    {
        $error_str = '';

        try {

            $dashboardModel = new DashboardModel();

            $dashboardModel->boughtIngredient($ingredient_string, $quantity_string, $useby_string);

        } catch (Exception $e) {

            $error_str = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!empty($error_str)) {
            header($strErrorHeader);
            return $error_str;
        }
    }

    public function getPantry()  

    {
        $error_str = '';

        try {

            $dashboardModel = new DashboardModel();

            $pantry = $dashboardModel->getUserPantry();

            return json_encode($pantry);

        } catch (Exception $e) {

            $error_str = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!empty($error_str)) {
            header($strErrorHeader);
            return $error_str;
        }
    }

    public function getShoppingList()
    
    {
        $error_str = '';

        try {

            $dashboardModel = new DashboardModel();

            $shopping_list = $dashboardModel->getUserShoppingList();

            return json_encode($shopping_list);

        } catch (Exception $e) {

            $error_str = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!empty($error_str)) {
            header($strErrorHeader);
            return $error_str;
        }
    }

    public function getCalendarRecipes() 
    
    {
        $error_str = '';

        try {

            $dashboardModel = new DashboardModel();

            $user_recipes = $dashboardModel->getUserRecipes();

            return json_encode($user_recipes);

        } catch (Exception $e) {

            $error_str = $e->getMessage();
            $strErrorHeader = 'HTTP/1.1 500 Internal Server Error';

        }

        if (!empty($error_str)) {
            header($strErrorHeader);
            return $error_str;
        }

    }

}