<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

class UserController extends BaseController

{

    public function login($email, $password) 
    {

        try {

            // Query database
            $user_model = new UserModel();
            $user_list = $user_model->getUserFromEmail($email);

            // Check if user does not exist
            if (count($user_list) == 0) {
                $this->sendOutput(
                    json_encode(array('result' => 'user does not exist'))
                );

                return;
            };

            // Check if there are multiple users
            if (count($user_list) > 1) {
                // Return error
                $this->sendOutput(
                    json_encode(array('error' => 'Multiple users with the same email')), 
                    array('Content-Type: application/json', 'HTTP/1.1 500 Internal Server Error')
                );

                return;
            };

            $user = $user_list[0];

            // Check if password is incorrect
            if (!password_verify($password, $user['password_hash'])) {
                $this->sendOutput(
                    json_encode(array('result' => 'password incorrect'))
                );

                return;
            }

            // clear existing session if there is one
            session_unset();

            $session_id = session_id();
            error_log("session id after login: $session_id");

            // store info in session
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['userfname'] = $user['first_name'];
            $_SESSION['userlname'] = $user['last_name'];
            $_SESSION['useremail'] = $user['email'];

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };

    }

    public function checkLogin() 
    {
        
        if (isset($_SESSION['user_id'])) {
            return json_encode(array('loggedIn' => true));
        } else {
            return json_encode(array('loggedIn' => false));
        };

    }

    public function logOut()
    {

        try {

            // clear existing session if there is one
            session_unset();

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };

    }

    public function createUser($email, $first_name, $last_name, $password) 
    {

        try {

            $user_model = new UserModel();
            $pw_hash = password_hash($password, PASSWORD_DEFAULT);

            $user_model->addUser($email, $pw_hash, $first_name, $last_name);

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {
            // Duplicate entry
            // should really do this with mysqli_errno()
            if (str_contains($e->getMessage(), "Duplicate entry")) {
                $this->sendOutput(
                    json_encode(array('result' => 'duplicate email'))
                );

                return;
            }

            $this->sendErrorOutput($e);

        };

    }

    #region Profile

    public function changeUserPassword($old_password, $new_password)
    {
        
        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            }

            $user_model = new UserModel();

            // Get user info with logged in users id
            $user = $user_model->getUserFromUserID($_SESSION['user_id']);

            // Check if old password is correct
            if (!password_verify($old_password, $user['password_hash'])) {
                $this->sendOutput(
                    json_encode(array('result' => 'old password incorrect'))
                );

                return;
            }

            $pw_hash = password_hash($new_password, PASSWORD_DEFAULT);

            // Update password
            $user_model->changePassword($_SESSION['user_id'], $pw_hash);

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };
    }

    public function getProfileInfo()
    {

        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            }

            $user_model = new UserModel();

            // Get user info with logged in user's id
            $response = $user_model->getUserFromUserID($_SESSION['user_id']);

            // Get user dietary preferences
            $dietary_preferences = $user_model->getPreferencesFromUserID($_SESSION['user_id']);
            $response["preferences"] = $dietary_preferences;

            // Get user allergens
            $allergens = $user_model->getAllergensFromUserID($_SESSION['user_id']);
            $response["allergens"] = $allergens;

            $this->sendOutput(json_encode($response));

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };

    }

    #endregion

    #region Dietary Preferences

    public function setDietaryPreferences($preferences) {

        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            };

            $user_model = new UserModel();

            $user_model->clearPreferences($_SESSION['user_id']);
            $this->addDietaryPreferences($preferences);

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };
        
    }

    public function addDietaryPreferences($preferences) {

        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            };

            $user_model = new UserModel();

            foreach ($preferences as $preference_name) {

                $preference_id = $user_model->getPreferenceIDFromName($preference_name);

                error_log($preference_name);

                // Add preference to link table
                $user_model->addPreference($_SESSION['user_id'], $preference_id);

            };

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };

    }

    public function deleteDietaryPreferences($preferences) {

        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            }

            $user_model = new UserModel();

            foreach ($preferences as $preference_name) {

                $preference_id = $user_model->getPreferenceIDFromName($preference_name);

                // Remove preference to link table
                $user_model->deletePreference($_SESSION['user_id'], $preference_id);

            };

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };

    }

    #endregion

    #region Allergens

    public function setAllergens($allergens) {

        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            };

            $user_model = new UserModel();

            $user_model->clearAllergens($_SESSION['user_id']);
            $this->addAllergens($allergens);

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };
        
    }

    public function addAllergens($allergens) {

        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            };

            $user_model = new UserModel();

            foreach ($allergens as $allergen_name) {

                $allergen_id = $user_model->getAllergenIDFromName($allergen_name);

                // Add preference to link table
                $user_model->addAllergen($_SESSION['user_id'], $allergen_id);

            };

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };

    }

    public function deleteAllergens($allergens) {

        try {

            if (!isset($_SESSION['user_id'])) {

                throw new Exception("User not logged in");
            
            }

            $user_model = new UserModel();

            foreach ($allergens as $allergen_name) {

                $allergen_id = $user_model->getAllergenIDFromName($allergen_name);

                // Remove preference to link table
                $user_model->deleteAllergen($_SESSION['user_id'], $allergen_id);

            };

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Exception $e) {

            $this->sendErrorOutput($e);

        };

    }

    #endregion

}