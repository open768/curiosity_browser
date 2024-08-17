<?php
//$home is set by each page abd identifies its relative location in the folder structure
$root = realpath($home);

//the following must reflect where the folders are on disk
$phpInc = "$root/../phpinc";        //have to set phpinc here to pull in header.php
$spaceInc = "$root/../spaceinc";

//php locations (these shouldnt need to be changed)
$appPhpFragments = "$root/php/fragments";
$appImages = "$home/images/";
$appConfig = "$root/php/app-config";

// Javascript locations (these are URL locations, not disk locations)
$AppJS = "$home/js";
$AppJSWidgets = "$AppJS/widgets";
$jsInc = "$home/../jsinc";            //check this works
$jsExtra = "$jsInc/extra";
$AppRest = "$home/php/rest";

//*****************************************************
//* nothing needs to be changed below here
require_once  "$appConfig/app-secret.php";

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
cAppLocations::$rest = $AppRest;
cAppLocations::$jsextra = $jsExtra;

class cAppIDs {
    const STATUS_ID = "status";
}
