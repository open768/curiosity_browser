<?php
//$home is set by each page to identify its relative location in the folder structure

class cAppGlobals {
    static $root;
    static $appPHP, $appImages, $appConfig, $appPhpFragments;
    static $jsHome, $jsWidgets, $jsAppRest, $jsExtra, $jsImages, $jsInc, $jsSpaceInc, $jsThumbNailer;

    static $spaceInc = null;
    static $phpInc = null;
    static $title = "title not set";

    static function init($psHome) {
        self::$root = realpath($psHome);

        //configurable things 
        self::$phpInc = self::$root . "/../phpinc";
        self::$spaceInc = self::$root . "/../spaceinc";
        self::$jsInc = "$psHome/../jsinc";

        //app  stuff 
        $appPHP = self::$root . "/php";
        self::$appImages = "$psHome/images/";
        self::$appConfig =  "$appPHP/app-config";
        self::$appPhpFragments = "$appPHP/fragments";

        //JS stuff 
        self::$jsHome = "$psHome/js";
        self::$jsExtra = self::$jsInc . "/extra";
        self::$jsThumbNailer = "$psHome/php/images/thumbnailer.php"; //this will likely move out of the app
        self::$jsAppRest = "$psHome/php/rest";
        self::$jsSpaceInc = self::$jsInc . "/ck-inc/space";
        self::$jsImages = "$psHome/images";
        self::$jsWidgets = self::$jsHome . "/widgets";
    }
}
cAppGlobals::init($home);

//##########################################################
//* nothing needs to be changed below here
require_once  cAppGlobals::$appConfig . "/app-secret.php";

//##########################################################
class cAppConfig {
    const FB_SCOPE = "public_profile";
    const FB_ELEMENT_ID = "FB_User";
    const FB_VERSION = "v20.0";
    const MISSION_ID = "MSL";
    const APP_NAME = "Curiosity Browser";
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

require_once  cAppGlobals::$appConfig . "/app-consts.php";
