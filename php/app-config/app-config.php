<?php
//$home is set by each page abd identifies its relative location in the folder structure
$root = realpath($home);


class cAppGlobals {
    static $appPHP, $appImages, $appConfig, $appPhpFragments;
    static $jsHome, $jsWidgets, $jsAppRest, $jsExtra, $jsImages, $jsInc, $jsSpaceInc, $jsThumbNailer;

    static $spaceInc = null;
    static $phpInc = null;
    static $title = "title not set";

    static function init() {
        global $home, $root;

        self::$phpInc = "$root/../phpinc";        //configure this

        $appPHP = "$root/php";
        self::$appImages = "$home/images/";
        self::$appConfig =  "$appPHP/app-config";
        self::$appPhpFragments = "$appPHP/fragments";

        //space stuff stuff 
        self::$spaceInc = "$root/../spaceinc";      //configure this

        //JS stuff 
        self::$jsInc = "$home/../jsinc";            //configure this
        self::$jsHome = "$home/js";
        self::$jsExtra = self::$jsInc . "/extra";
        self::$jsThumbNailer = "$home/php/images/thumbnailer.php"; //this will likely move out of the app
        self::$jsAppRest = "$home/php/rest";
        self::$jsSpaceInc = self::$jsInc . "/ck-inc/space";
        self::$jsImages = "$home/images";
        self::$jsWidgets = self::$jsHome . "/widgets";
    }
}
cAppGlobals::init();

//##########################################################
//* nothing needs to be changed below here
require_once  cAppGlobals::$appConfig . "/app-secret.php";

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
