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

        } catch (Error $e) {

            $this->sendErrorOutput($e);

        }

    }

    public function checkLogin() 
    {
        
        if (isset($_SESSION['user_id'])) {
            return json_encode(array('loggedIn' => true));
        } else {
            return json_encode(array('loggedIn' => false));
        }

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

        } catch (Throwable $e) {
            // Duplicate entry
            // should really do this with mysqli_errno()
            if (str_contains($e->getMessage(), "Duplicate entry")) {
                $this->sendOutput(
                    json_encode(array('result' => 'duplicate email'))
                );

                return;
            }

            $this->sendErrorOutput($e);

        }

    }

    public function getProfileInfo()
    {
        
        $session_id = session_id();
        error_log("session id getting profile: $session_id");

        try {

            $user_model = new UserModel();

            if (isset($_SESSION['user_id'])) {

                // Get user info with logged in user's id
                $response_json = $user_model->getUserFromUserID($_SESSION['user_id']);

                $this->sendOutput($response_json);

            } else {

                throw new Error("User not logged in");

            }

        } catch (Error $e) {

            $this->sendErrorOutput($e);

        }

    }

}