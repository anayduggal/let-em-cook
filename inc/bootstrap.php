<?php

define("PROJECT_ROOT_PATH", __DIR__ . "/../");

// include main configuration file

require_once PROJECT_ROOT_PATH . "/inc/config.php";

// include the base controller file

require_once PROJECT_ROOT_PATH . "/Controller/Api/BaseController.php";

// include the use model files

require_once PROJECT_ROOT_PATH . "/Model/Database.php";
require_once PROJECT_ROOT_PATH . "/Model/RecipeModel.php";
require_once PROJECT_ROOT_PATH . "/Model/UserModel.php";
require_once PROJECT_ROOT_PATH . "/Model/DashboardModel.php";