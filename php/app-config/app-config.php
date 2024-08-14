<?php
$root = realpath($home);
$phpInc = "$root/../phpinc";        //have to set phpinc here to pull in header.php
$spaceInc = "$root/../spaceinc";
$appPhpFragments = "$root/php/fragments";
$appImages = "$home/images/";
$appConfig = "$root/php/app-config";

// Javascript locations 
$AppJS = "$home/js";
$AppJSWidgets = "$AppJS/widgets";
$jsInc = "$home/../jsinc";            //check this works
$jsExtra = "$jsInc/extra";

require_once  "$appConfig/app-secret.php";

//***************************************************** */
class cAppConfig {
    const FB_SCOPE = "public_profile";
    const FB_ELEMENT_ID = "FB_User";
    const FB_VERSION = "v20.0";
}

class cAppLocations {
    static $home = null;
    static $rest = null;
    static $jsextra = null;
};

cAppLocations::$home = $home;
cAppLocations::$rest = "{$home}/php/rest";
cAppLocations::$jsextra = $jsExtra;

class cAppIDs {
    const STATUS_ID = "status";
}
