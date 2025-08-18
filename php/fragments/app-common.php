<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
//
 **************************************************************************/
class AppCommonException extends Exception {
}

//****checks************************************************************************
if (!isset($home))
    throw new AppCommonException("cant find home: $home");
if (!is_dir($home))
    throw new AppCommonException("home directory doesnt exist: $home");

//**********************************************************************************
$sConfigFile = "$home/php/app-config/app-config.php";
if (!file_exists($sConfigFile))
    throw new AppCommonException("cant find app-config file: $sConfigFile");

include $sConfigFile;    //config for the application - sets up cAppglobals

//**********************************************************************************
require_once cAppGlobals::$ckPhpInc . "/header.php";    //this starts the session
require_once cAppGlobals::$ckPhpInc . "/debug.php";

//**********************************************************************************
//check for extensions
if (!extension_loaded("curl"))
    cDebug::error("curl extension is not loaded - check " . php_ini_loaded_file());
if (!extension_loaded("sqlite3"))
    cDebug::error("sqlite3 extension is not loaded - check " . php_ini_loaded_file());


//requests without https get redirected
if (!cCommonEnvironment::is_cli())
    if ($_SERVER["REQUEST_SCHEME"] !== "https") {
        cDebug::extra_debug("request scheme is not https");
        $https_port = "";
        if (cCommonEnvironment::is_localhost()) $https_port = ":8443";

        $newURL = "https://" . $_SERVER["SERVER_NAME"] . $https_port . $_SERVER["REQUEST_URI"];
        cHeader::redirect($newURL);
        exit();
    } else {
        cDebug::extra_debug("request scheme is https");
    }

//includes
require_once cAppGlobals::$ckPhpInc . "/common.php";
require_once cAppGlobals::$ckPhpInc . "/auth.php";
require_once cAppGlobals::$spaceInc . "/misc/constants.php";
require_once cAppGlobals::$spaceInc . "/curiosity/curiosity.php";
require_once cAppGlobals::$spaceInc . "/curiosity/static.php";
//require_once cAppGlobals::$ckPhpInc . "/autoinstrument.php";
require_once cAppGlobals::$spaceInc . "/curiosity/manifest/orm.php";
require_once cAppGlobals::$spaceInc . "/curiosity/manifest/ormutils.php";

// testing autoinstrumentation
//cClassInstrumenter::instrument_classes();

cDebug::extra_debug("finished app-common.php");
