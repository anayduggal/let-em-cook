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

    public function getUserFromEmail($email) 
    
    {

        return $this->select(
            "SELECT * FROM users WHERE email = ?", ["s", $email]
        );

    }

    public function addUser($email, $pw_hash, $first_name, $last_name) 
    
    {

        $this->insertInto(
            "INSERT INTO users (email, password_hash, first_name, last_name) VALUES (?, ?, ?, ?)", ["ssss", $email, $pw_hash, $first_name, $last_name]
        );

    }

}
