<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
 **************************************************************************/
//$home is set by each page to identify its relative location in the folder structure
class AppConfigException extends Exception {
}
if (! isset($home))
    #raise an exception     
    throw new AppConfigException("$home not set");


class cAppGlobals {
    static $root;
    static $appPHP, $appImages, $appConfig, $appPhpFragments;
    static $jsHome, $jsWidgets, $jsAppRest, $jsExtra, $jsImages, $jsInc, $jsSpaceInc;
    static $jsThumbNailer, $jsCropper, $jsMosaicer;
    static $composerAutoload;

    static $spaceInc = null;
    static $phpInc = null;
    static $ckPhpInc = null;
    static $title = "title not set";
    static $dbRoot = null;

    static function init($psHome) {
        self::$root = realpath($psHome);

        //configurable things 
        self::$phpInc = self::$root . "/../phpinc";                //disk location of where phpinc can be found by PHP
        self::$spaceInc = self::$root . "/../spaceinc";            //disk location of where spaceinc can be found by PHP
        self::$ckPhpInc = self::$phpInc . "/ckinc";                //dont modify this line

        require_once self::$ckPhpInc . "/debug.php";               //dont modify this line its needed for the next line
        if (cCommonEnvironment::is_localhost())
            self::$jsInc = "$psHome/../jsinc";                     //DEV url where jsinc can be found on your webserver 
        else
            self::$jsInc = "https://www.mars-browser.co.uk/jsinc"; //PRODUCTION


        //========================================================================================================
        //                   dont modify below this line
        //========================================================================================================
        //app  stuff 
        self::$dbRoot = self::$root . "/[db]";
        self::$appPHP = self::$root . "/php";
        self::$appImages = "$psHome/images/";
        self::$appConfig =  self::$appPHP . "/app-config";
        self::$appPhpFragments = self::$appPHP . "/fragments";
        self::$composerAutoload = self::$appPHP . "/vendor/autoload.php";

        //JS stuff 
        self::$jsHome = "$psHome/js";
        self::$jsExtra = self::$jsInc . "/extra";
        self::$jsAppRest = "$psHome/php/rest";
        self::$jsSpaceInc = self::$jsInc . "/ck-inc/space";
        self::$jsImages = "$psHome/images";
        self::$jsWidgets = self::$jsHome . "/widgets";

        //image functio locations for javascript
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
//* load composer
require cAppGlobals::$composerAutoload;         //TODO: autoload is deprecated

class cAppConfig {
    const MISSION_ID = cSpaceMissions::CURIOSITY;
    const APP_NAME = "Curiosity Browser";
    const DATABASE_DOWN = false;
    const USE_FACEBOOK = true;              //change this to turn off facebook features
    const USE_GOOGLE_ANALYTICS = true;      //change this to turn off Google analytics features
    const USE_APPD = true;
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
    static $mosaicer = null;

    static function init() {
        global $home;
        self::$home = $home;
        self::$rest = cAppGlobals::$jsAppRest;
        self::$jsextra = cAppGlobals::$jsExtra;
        self::$thumbnailer = cAppGlobals::$jsThumbNailer;
        self::$images = cAppGlobals::$jsImages;
        self::$cropper = cAppGlobals::$jsCropper;
        self::$mosaicer = cAppGlobals::$jsMosaicer;
        self::$appconfig = "$home/php/app-config/app-config.php";
    }
}
cAppLocations::init();

//##########################################################
class cFBConfig {
    const SCOPE = "public_profile";
    const ELEMENT_ID = "FB_User";
    const VERSION = "v20.0";
    static $SERVER_SIDE = null;

    static function init(): void {
        self::$SERVER_SIDE = cAppLocations::$rest . "/facebook.php";
    }
}

// initialize runtime values
cFBConfig::init();

//##########################################################
require_once  cAppGlobals::$appConfig . "/app-consts.php";
