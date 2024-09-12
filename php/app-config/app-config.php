<?php
//$home is set by each page abd identifies its relative location in the folder structure
$root = realpath($home);

//the following must reflect where the folders are on disk
$phpInc = "$root/../phpinc";        //have to set phpinc here to pull in header.php

//php locations (these shouldnt need to be changed)
$appPHP = "$root/php";
$appPhpFragments = "$appPHP/fragments";
$appImages = "$home/images/";
$appConfig = "$appPHP/app-config";

// Javascript locations (these are URL locations, not disk locations)
$AppJS = "$home/js";
$AppJSWidgets = "$AppJS/widgets";
$jsInc = "$home/../jsinc";            //check this works
$jsSpaceInc = "$jsInc/ck-inc/space";
$jsAppRest = "$home/php/rest";
$jsImages = "$home/images";

//##########################################################
//* nothing needs to be changed below here
require_once  "$appConfig/app-secret.php";

class cAppGlobals {
    static $title = "title not set";
    static $jsExtra = null;
    static $jsThumbNailer = null;
    static $spaceInc = null;

    static function init() {
        global $jsInc, $home, $root;
        self::$jsExtra = "$jsInc/extra";
        self::$jsThumbNailer = "$home/php/images/thumbnailer.php";
        self::$spaceInc = "$root/../spaceinc";
    }
}
cAppGlobals::init();

class cAppConfig {
    const FB_SCOPE = "public_profile";
    const FB_ELEMENT_ID = "FB_User";
    const FB_VERSION = "v20.0";
}

//##########################################################
class cAppLocations {
    static $home = null;
    static $rest = null;
    static $jsextra = null;
    static $thumbnailer = null;
    static $images = null;

    static function init() {
        global $home, $jsAppRest, $jsExtra, $jsImages;
        self::$home = $home;
        self::$rest = $jsAppRest;
        self::$jsextra = $jsExtra;
        self::$thumbnailer = cAppGlobals::$jsThumbNailer;
        self::$images = $jsImages;
    }
}
cAppLocations::init();

class cAppIDs {
    const STATUS_ID = "status";
}

class cAppUrlParams {
    const OPERATION = "o";
    const REFRESH = "r";
}
