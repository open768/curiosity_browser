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
require_once  cAppGlobals::$spaceInc . "/misc/pichighlight.php";
require_once  cAppGlobals::$spaceInc . "/misc/indexes.php";
require_once  cAppGlobals::$ckPhpInc . "/common.php";
include cAppGlobals::$appPhpFragments . "/rest_header.php";


$sUser = cAuth::must_get_user();
$sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
$sMission = cHeader::get(cSpaceUrlParams::MISSION, true);
$oResult = cSpaceImageMosaic::get_sol_high_mosaic($sSol);
$sKey = null;
if ($oResult !== null) $sKey = $oResult->key;
cDebug::vardump($oResult);

//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
$aOut = []; {
    $aOut[cSpaceUrlParams::SOL] = $sSol;
    $aOut[cSpaceUrlParams::MISSION] = $sMission;
    $aOut[cAppUrlParams::MOSAIC_PARAM] = $sKey;
}
cCommon::write_json((object)$aOut);
