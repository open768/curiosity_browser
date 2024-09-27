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
require_once  cAppGlobals::$spaceInc . "/misc/tags.php";



$iTagCount = 0;
$iHighCount = 0;

//***************************************************
$sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
$sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT, true);
$sProduct = cHeader::get(cSpaceUrlParams::PRODUCT, true);

$aTagData = cSpaceTags::get_product_tags($sSol, $sInstrument, $sProduct);
if ($aTagData) $iTagCount = count($aTagData);

$aImgData = cSpaceImageHighlight::get($sSol, $sInstrument, $sProduct,false);
if ($aImgData["d"]) $iHighCount = count($aImgData["d"]);

$oResult = ["p" => $sProduct, "t" => $iTagCount, "h" => $iHighCount];


//***************************************************
//output the tags
//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
cCommon::write_json($oResult);
