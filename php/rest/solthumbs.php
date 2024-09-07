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

$sSol = cHeader::get(cSpaceUrlParams::SOL);
$sInstr = cHeader::get(cSpaceUrlParams::INSTRUMENT);

if (!$sSol || !$sInstr) cDebug::error("wrong parameters");

cDebug::write("getting sol $sSol thumbnails data");
$aData = cCuriosity::getThumbnails($sSol, $sInstr);

cCommon::write_json($aData);
