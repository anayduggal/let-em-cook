<?php
class UserController extends BaseController

{

    public function login($username, $password) 

    {

        $error_str = '';

        try {

            $userModel = new UserModel();
            $user = $userModel->getUserFromUsername($username);

            if ($user) {
                if (password_verify($password, $user['password'])) {
                    // store info in session
                    $_SESSION['user_id'] = $user['id'];
                    $_SESSION['username'] = $user['username'];

                    // go to dashboard
                    header("Location: index.php/dashboard");
                    exit();
                } else {
                    $error_str = 'Invalid Password';
                }
            } else {
                $error_str = 'User DNE';
            }

        } catch (Error $e) {

            $error_str = $e->getMessage().'Something went wrong';
            $error_header = 'HTTP/1.1 500 Internal Server Error';

        }

        if ($error_str) {
            $this->sendOutput(json_encode(array('error' => $error_str)), 
                array('Content-Type: application/json', $error_header)
            );
        }

    }

    public function createUser($username, $password) 
    {

        $error_str = '';

        try {

            $userModel = new UserModel();
            $pw_hash = password_hash($password, PASSWORD_DEFAULT);

            $userModel->addUser($username, $pw_hash);


        } catch (Error $e) {

            $error_str = $e->getMessage().'Something went wrong';
            $error_header = 'HTTP/1.1 500 Internal Server Error';

        }

        if ($error_str) {
            $this->sendOutput(json_encode(array('error' => $error_str)), 
                array('Content-Type: application/json', $error_header)
            );
        }

    }



}