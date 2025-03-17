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
                    // store info in session
                    $_SESSION['user_id'] = $user['user_id'];

                    $this->sendOutput(data: json_encode(value: array('status' => 'ok')),
                        httpHeaders: array('Content-Type: application/json', 'HTTP/1.1 200 OK')
                    );
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

    public function createUser($email, $password, $first_name, $last_name) 
    {

        $error_str = '';

        try {

            $user_model = new UserModel();
            $pw_hash = password_hash($password, PASSWORD_DEFAULT);

            $user_model->addUser($email, $pw_hash, $first_name, $last_name);

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