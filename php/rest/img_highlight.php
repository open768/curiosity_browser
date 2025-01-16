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


//***************************************************
$sOperation = cHeader::get(cAppUrlParams::OPERATION);
$oResult = null;

switch ($sOperation) {
    case "add":
        $sUser = cAuth::must_get_user();
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT, true);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT, true);
        $top = cHeader::get(cAppUrlParams::HIGHLIGHT_TOP, true);
        $left = cHeader::get(cAppUrlParams::HIGHLIGHT_LEFT, true);
        $oResult = cSpaceImageHighlight::set($sSol, $sInstrument, $sProduct, $top, $left, $sUser);
        break;

    case "get":
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT, true);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT, true);
        $oResult = cSpaceImageHighlight::get($sSol, $sInstrument, $sProduct, false);
        $oResult = $oResult->get_abbreviated_data();
        break;

    case "getcropdata":
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT, true);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT, true);
        $oResult = cSpaceImageHighlight::get($sSol, $sInstrument, $sProduct, true);
        $oResult = $oResult->get_abbreviated_data();
        break;

    case "solcount":
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true);
        $oResult = cSpaceIndex::get_solcount($sSol, cSpaceIndex::HILITE_SUFFIX);
        break;

    case "topsolindex":

        //unfortunately cant display count of highlights as i've hard coded 1 as the index value, 
        //regardless of how many highlights --OOPS - needs a change to the underlying lack of data model.
        //update when going to sql lite
        $oResult = cSpaceImageHighlight::get_top_index();
        break;

    case "soldata":
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $oResult = cSpaceImageHighlight::get_sol_highlighted_products($sSol);
        break;

    default:
        cDebug::error("unsupported operation '$sOperation'");
        break;
}

//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
cCommon::write_json($oResult);
