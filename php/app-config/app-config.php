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
$jsInc = "$home/../jsinc";            //check this works


//##########################################################
//* nothing needs to be changed below here
require_once  "$appConfig/app-secret.php";

class cAppGlobals {
    static $title = "title not set";
    static $jsExtra = null;
    static $jsThumbNailer = null;
    static $spaceInc = null;
    static $jsAppRest = null;
    static $jsSpaceInc = null;
    static $jsImages = null;
    static $AppJS = null;
    static $AppJSWidgets = null;

    static function init() {
        global $jsInc, $home, $root;
        self::$jsExtra = "$jsInc/extra";
        self::$jsThumbNailer = "$home/php/images/thumbnailer.php";
        self::$spaceInc = "$root/../spaceinc";
        self::$jsAppRest = "$home/php/rest";
        self::$jsSpaceInc = "$jsInc/ck-inc/space";
        self::$jsImages = "$home/images";
        self::$AppJS = "$home/js";
        self::$AppJSWidgets = self::$AppJS . "/widgets";
    }
}
cAppGlobals::init();

//##########################################################
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
        global $home;
        self::$home = $home;
        self::$rest = cAppGlobals::$jsAppRest;
        self::$jsextra = cAppGlobals::$jsExtra;
        self::$thumbnailer = cAppGlobals::$jsThumbNailer;
        self::$images = cAppGlobals::$jsImages;
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
