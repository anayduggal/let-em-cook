<?php

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

class UserController extends BaseController

{

    public function login($email, $password) 

    {

        $error_str = '';
        $error_header = '';

        try {

            $user_model = new UserModel();
            $user = $user_model->getUserFromEmail($email)[0];

            if ($user) {
                if (password_verify($password, $user['password_hash'])) {
                    // clear existing session if there is one
                    session_unset();

                    // store info in session
                    $_SESSION['user_id'] = $user['user_id'];
                    $_SESSION['userfname'] = $user['first_name'];
                    $_SESSION['userlname'] = $user['last_name'];
                    $_SESSION['useremail'] = $user['email'];

                    echo "login success\n";
                    exit();
                } else {
                    $error_str = 'Incorrect Password';
                    $error_header = 'HTTP/1.1 500 Internal Server Error';
                }
            } else {
                $error_str = 'User DNE';
                $error_header = 'HTTP/1.1 500 Internal Server Error';
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

    public function checkLogin() 
    {
        
        if (isset($_SESSION['user_id'])) {
            return json_encode(array('loggedIn' => true));
        } else {
            return json_encode(array('loggedIn' => false));
        }
    }

    public function createUser($email, $userfname, $userlname, $password) 
    {

        $error_str = '';

        try {

            $user_model = new UserModel();
            $pw_hash = password_hash($password, PASSWORD_DEFAULT);

            $user_model->addUser($email, $userfname, $userlname, $pw_hash);

        } catch (Error $e) {

            $error_str = $e->getMessage().' Something went wrong';
            $error_header = 'HTTP/1.1 500 Internal Server Error';

        }

        if ($error_str) {
            $this->sendOutput(json_encode(array('error' => $error_str)), 
                array('Content-Type: application/json', $error_header)
            );

            error_log("Error when creating user: ".$error_str);
        }

    }

}