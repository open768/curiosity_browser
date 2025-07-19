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
require_once  cAppGlobals::$spaceInc . "/misc/comments.php";
include cAppGlobals::$appPhpFragments . "/rest_header.php";

//***************************************************
$sOperation = cHeader::get(cAppUrlParams::OPERATION);
$oResult = null;

switch ($sOperation) {
    case "get":
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT, true);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT, true);

        $aResult = cSpaceComments::get($sSol, $sInstrument, $sProduct);

        break;
    case "set":
        $sUser = cAuth::must_get_user();
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT, true);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT, true);
        $sText = cHeader::get('v');

        $aResult = cSpaceComments::set($sSol, $sInstrument, $sProduct, $sText, $sUser);
        break;
    case "topsolindex":
        $aResult = cSpaceComments::get_top_index();
        break;

    case "sol":
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $aResult = cSpaceComments::get_all_sol_data($sSol);
        break;

    default:
        cDebug::error("unsupported operation");
        break;
}

//############################### response ####################
cCommon::write_json($aResult);
