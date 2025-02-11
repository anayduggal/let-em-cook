<?php

require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class UserModel extends Database

{

    public function getUserFromUserID($user_id) 
    
    {

        return $this->select(
            "SELECT * FROM users WHERE user_id = ?", ["i", $user_id]
        );

    }

    public function getUserFromUsername($username) 
    
    {

        return $this->select(
            "SELECT * FROM users WHERE username = ?", ["i", $username]
        );

    }

    public function addUser($username, $pw_hash) 
    
    {

        $this->insertInto(
            "INSERT INTO users (username, password_hash) VALUES(?, ?)", [$username, $pw_hash]
        );

    }

}
