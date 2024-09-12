<?php
//**********************************************************************************
include "../app-config/app-config.php";    //config for the application


//**********************************************************************************
require_once cAppGlobals::$phpInc . "/ckinc/header.php";    //this starts the session
require_once cAppGlobals::$phpInc . "/ckinc/debug.php";

//**********************************************************************************
//check for extensions
if (!extension_loaded("curl"))
    cDebug::error("curl extension is not loaded - check " . php_ini_loaded_file());
if (!extension_loaded("sqlite3"))
    cDebug::error("sqlite3 extension is not loaded - check " . php_ini_loaded_file());

//check if debugging is needed
cDebug::check_GET_or_POST();

//requests without https get redirected
if (!cDebug::is_cli())
    if ($_SERVER["REQUEST_SCHEME"] !== "https") {
        cDebug::extra_debug("request scheme is not https");
        $https_port = "";
        if (cDebug::is_localhost()) $https_port = ":8443";

        $newURL = "https://" . $_SERVER["SERVER_NAME"] . $https_port . $_SERVER["REQUEST_URI"];
        cHeader::redirect($newURL);
        exit();
    } else {
        cDebug::extra_debug("request scheme is https");
    }

//includes
require_once cAppGlobals::$phpInc . "/ckinc/common.php";
require_once cAppGlobals::$phpInc . "/ckinc/auth.php";
require_once cAppGlobals::$spaceInc . "/misc/constants.php";
require_once cAppGlobals::$spaceInc . "/curiosity/curiosity.php";
require_once cAppGlobals::$spaceInc . "/curiosity/static.php";

cDebug::extra_debug("finished app-common.php");
