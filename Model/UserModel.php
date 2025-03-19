<?php

require_once PROJECT_ROOT_PATH . "/Model/Database.php";

class UserModel extends Database

{

    public function getUserFromUserID($user_id) 
    
    {

        try {

            $users = $this->select(
                "SELECT * FROM users WHERE user_id = ?", ["i", $user_id]
            );

            return $users[0];

        } catch (Throwable $e) {

            throw new Error("User does not exist");

        }

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

    public function getPreferenceIDFromName($preference_name) {

        try {

            $preference_ids = $this->select(
                "SELECT * FROM preferences WHERE preference_name = ?", ["s", $preference_name]
            );

            return $preference_ids[0]["preference_id"];

        } catch (Throwable $e) {

            throw new Error("Preference does not exist");

        }

    }

    public function addPreference($user_id, $preference_id) {

        try {

            $this->insertInto(
                "INSERT INTO user_preferences (user_id, preference_id) VALUES (?, ?)", ["ss", $user_id, $preference_id]
            );

        } catch (Exception $e) {

            // Duplicate entry
            // should really do this with mysqli_errno()
            if (str_contains($e->getMessage(), "Duplicate entry")) {
                // We ignore duplicate entries, since the preference is already in the db

                return;
            }

            throw new Exception($e);

        }

    }

    public function deletePreference($user_id, $preference_id) {

        $this->deleteFrom(
            "DELETE FROM user_preferences WHERE user_id = ? AND preference_id = ?", ["ss", $user_id, $preference_id]
        );

    }

}
