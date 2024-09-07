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
require_once  "$spaceInc/misc/tags.php";


//***************************************************
$sOperation = cHeader::get(cAppUrlParams::OPERATION);
$aData = null;

switch ($sOperation) {
    case "set":
        $sUser = cAuth::must_get_user();
        $sSol = cHeader::get(cSpaceUrlParams::SOL);
        $sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT);
        $sTag = cHeader::get("v");
        cSpaceTags::set_product_tag($sSol, $sInstrument, $sProduct, $sTag, $sUser);
    case "get":
        $sSol = cHeader::get(cSpaceUrlParams::SOL);
        $sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT);
        $sProduct = cHeader::get(cSpaceUrlParams::PRODUCT);
        $aTags = cSpaceTags::get_product_tag_names($sSol, $sInstrument, $sProduct);
        cDebug::vardump($aTags);
        $aData = ["p" => $sProduct, "d" => $aTags];
        break;
    case "detail":
        $sTag = cHeader::get("t");
        $aData = cSpaceTagNames::get_tag_name_index($sTag);
        break;
    case "topsolindex":
        $aData = cSpaceTagsIndex::get_top_sol_index();
        break;
    case "sol":
        $sSol = cHeader::get(cSpaceUrlParams::SOL);
        $aData = cSpaceTags::get_sol_tags($sSol);
        break;
    case "solcount":
        $sSol = cHeader::get(cSpaceUrlParams::SOL);
        $aData = cSpaceTags::get_sol_tag_count($sSol);
        break;
    case "all":
        $aData = cSpaceTagNames::get_top_tag_names();
        break;
    case "search":
        $sPartial = cHeader::get("v");
        $aData = cSpaceTagNames::search_tag_names($sPartial);
        break;
}

//***************************************************
//output the data
cCommon::write_json($aData);
