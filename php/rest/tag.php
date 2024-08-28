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
$sOperation = $_GET["o"];
$aData = null;

switch ($sOperation) {
    case "set":
        $sUser = cAuth::must_get_user();
        $sSol = $_GET["s"];
        $sInstrument = $_GET["i"];
        $sProduct = $_GET["p"];
        $sTag = $_GET["v"];
        cSpaceTags::set_tag($sSol, $sInstrument, $sProduct, $sTag, $sUser);
    case "get":
        $sSol = $_GET["s"];
        $sInstrument = $_GET["i"];
        $sProduct = $_GET["p"];
        $aTags = cSpaceTags::get_product_tags($sSol, $sInstrument, $sProduct);
        cDebug::vardump($aTags);
        $aData = ["p" => $sProduct, "d" => $aTags];
        break;
    case "detail":
        $sTag = $_GET["t"];
        $aData = cSpaceTagNames::get_tag_name_index($sTag);
        break;
    case "topsolindex":
        $aData = cSpaceTagsIndex::get_top_sol_index();
        break;
    case "sol":
        $sSol = $_GET["s"];
        $aData = cSpaceTags::get_sol_tags($sSol);
        break;
    case "solcount":
        $sSol = $_GET["s"];
        $aData = cSpaceTags::get_sol_tag_count($sSol);
        break;
    case "all":
        $aData = cSpaceTagNames::get_top_tag_names();
        break;
}

//***************************************************
//output the data
cCommon::write_json($aData);
