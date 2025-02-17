<?php

require_once PROJECT_ROOT_PATH . "/Model/UserModel.php";
class UserController extends BaseController

{

    public function login($email, $password) 

    {

        $error_str = '';
        $error_header = '';

        try {

            $userModel = new UserModel();
            $user = $userModel->getUserFromEmail($email)[0];
            
            error_log(print_r($user), true);

            if ($user) {
                if (password_verify($password, $user['password_hash'])) {
                    // store info in session
                    $_SESSION['user_id'] = $user['user_id'];
                    $_SESSION['username'] = $user['username'];

                    // go to dashboard
                    header("Location: index.php/dashboard");
                    exit();
                } else {
                    $error_str = 'Incorrect Password';
                }
            } else {
                $error_str = 'User DNE';
            }

        } catch (Error $e) {

            $error_str = $e->getMessage().' Something went wrong';
            $error_header = 'HTTP/1.1 500 Internal Server Error';

        }

        if ($error_str) {
            $this->sendOutput(json_encode(array('error' => $error_str)), 
                array('Content-Type: application/json', $error_header)
            );
        }

    }

    public function createUser($email, $username, $password) 
    {

        $error_str = '';

        try {

            $userModel = new UserModel();
            $pw_hash = password_hash($password, PASSWORD_DEFAULT);

            $userModel->addUser($email, $username, $pw_hash);


        } catch (Error $e) {

            $error_str = $e->getMessage().' Something went wrong';
            $error_header = 'HTTP/1.1 500 Internal Server Error';

        }

        if ($error_str) {
            $this->sendOutput(json_encode(array('error' => $error_str)), 
                array('Content-Type: application/json', $error_header)
            );
        }

    }



}