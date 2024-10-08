<?php
//$home is set by each page to identify its relative location in the folder structure

class cAppGlobals {
    static $root;
    static $appPHP, $appImages, $appConfig, $appPhpFragments;
    static $jsHome, $jsWidgets, $jsAppRest, $jsExtra, $jsImages, $jsInc, $jsSpaceInc;
    static $jsThumbNailer, $jsCropper, $jsMosaicer;

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
        self::$jsAppRest = "$psHome/php/rest";
        self::$jsSpaceInc = self::$jsInc . "/ck-inc/space";
        self::$jsImages = "$psHome/images";
        self::$jsWidgets = self::$jsHome . "/widgets";

        //image functions
        self::$jsThumbNailer = "$psHome/php/images/thumbnailer.php"; //this will likely move out of the browser app into its own app
        self::$jsCropper = "$psHome/php/images/cropper.php"; //this will likely move out of the app (as above)
        self::$jsMosaicer = "$psHome/php/images/mosaicer.php"; //this will likely move out of the app (as above)
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
    const MISSION_ID = cSpaceMissions::CURIOSITY;
    const APP_NAME = "Curiosity Browser";
    const DATABASE_DOWN = false;
}

//##########################################################
class cAppLocations {
    static $home = null;
    static $rest = null;
    static $jsextra = null;
    static $thumbnailer = null;
    static $cropper = null;
    static $images = null;
    static $appconfig = null;

    static function init() {
        global $home;
        self::$home = $home;
        self::$rest = cAppGlobals::$jsAppRest;
        self::$jsextra = cAppGlobals::$jsExtra;
        self::$thumbnailer = cAppGlobals::$jsThumbNailer;
        self::$images = cAppGlobals::$jsImages;
        self::$cropper = cAppGlobals::$jsCropper;
        self::$appconfig = "$home/php/app-config/app-config.php";
    }
}
cAppLocations::init();

require_once  cAppGlobals::$appConfig . "/app-consts.php";
