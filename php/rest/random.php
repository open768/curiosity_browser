<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 -2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
 **************************************************************************/

$home = "../..";
require_once  "$home/php/fragments/app-common.php";


//***************************************************
$sOperation = cHeader::get(cAppUrlParams::OPERATION, true);
$iHowMany = cHeader::get(cAppUrlParams::HOWMANY, true, true);
if ($iHowMany < 1) cDebug::error("how many must be at least 1");

$oOutput = null;
switch ($sOperation) {
    case cAppUrlParams::IMAGE:
        //images
        $aResult = cCuriosityManifestUtils::get_random_images("MAST_%", $iHowMany);
        $oOutput = ["d" => $aResult];
        break;
    default:
        //unknown
        cDebug::error("unknown operation $sOperation");
}

//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
cCommon::write_json($oOutput);
