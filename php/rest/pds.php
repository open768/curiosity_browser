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
require_once "$home/php/fragments/app-common.php";

require_once  cAppGlobals::$spaceInc . "/curiosity/curiositypds.php";
require_once  cAppGlobals::$spaceInc . "/pds/pdsreader.php";

$sOperation = cHeader::get(cAppUrlParams::OPERATION);
switch ($sOperation) {
    case "s":
        $sSol = cHeader::get(cSpaceUrlParams::SOL);
        $sInstr = cHeader::get(cSpaceUrlParams::INSTRUMENT);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT);
        if (!$sSol || !$sInstr || !$sProduct) cDebug::error("missing parameters!");


        //-------------------
        try {
            $oData = cCuriosityPDS::search_pds($sSol, $sInstr, $sProduct);
        } catch (Exception $e) {
            cDebug::write("search failed");
            $oData = null;
        }
        break;
    default:
        cDebug::error("unknown operation $sOperation");
}
//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
cCommon::write_json($oData);
