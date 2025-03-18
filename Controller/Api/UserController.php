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

            // store info in session
            $_SESSION['user_id'] = $user['user_id'];
            $_SESSION['userfname'] = $user['first_name'];
            $_SESSION['userlname'] = $user['last_name'];
            $_SESSION['useremail'] = $user['email'];

            $this->sendOutput(
                json_encode(array('result' => 'success'))
            );

        } catch (Error $e) {

            $error_str = $e->getMessage().' Something went wrong';

            $this->sendOutput(
                json_encode(array('error' => $error_str)), 
                array('Content-Type: application/json', 'HTTP/1.1 500 Internal Server Error')
            );

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

            $error_str = $e->getMessage().' Something went wrong';

            $this->sendOutput(json_encode(
                array('error' => $error_str)), 
                array('Content-Type: application/json', 'HTTP/1.1 500 Internal Server Error')
            );

        }

    }

}