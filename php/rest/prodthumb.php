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
$sInstrument = cHeader::get(cSpaceUrlParams::INSTRUMENT);
$sProduct = cHeader::get(cSpaceUrlParams::PRODUCT);

cDebug::write("getting product details for $sSol, $sInstrument, $sProduct");
$oData = cCuriosityImages::getLocalThumbnail($sSol, $sInstrument, $sProduct);

cCommon::write_json($oData);