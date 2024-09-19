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

$sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
$sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT);
$iStart = cHeader::get("b");
$iEnd = cHeader::get("e");
if ($sInstrument === "null") $sInstrument = null;


cDebug::write("getting sol $sSol data");
$oInstrumentData = cCuriosity::getSolRawData($sSol, $sInstrument);
$aData = $oInstrumentData->data;
$iCount = count($aData);

cDebug::write("original array has $iCount");
//cDebug::vardump($aData);

//deal with boundary conditions
if ($iStart < 1) $iStart = 1;
if ($iEnd > $iCount) $iEnd = $iCount;
cDebug::write("start=$iStart, end=$iEnd");

//build the array
$aOutput = [];
for ($iIndex = $iStart - 1; $iIndex < $iEnd; $iIndex++) {
    $oItem = $aData[$iIndex];
    cDebug::write("pushing to array");
    array_push($aOutput, $oItem);
}

//output the json
$aData = ["max" => $iCount, "start" => $iStart, "images" => $aOutput];
//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
cCommon::write_json($aData);
