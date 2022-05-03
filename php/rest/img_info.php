<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 -2015

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	$home = "../..";
	require_once("$home/php/common.php");
	require_once("$spaceinc/misc/pichighlight.php");
	require_once("$spaceinc/misc/tags.php");
	

	
	$iTagCount = 0;
	$iHighCount = 0;
	
	//***************************************************
	$sSol = $_GET["s"];
	$sInstrument= $_GET["i"];
	$sProduct= $_GET["p"];
	
	$aTagData = cTags::get_tag_names( $sSol, $sInstrument, $sProduct);
	if ($aTagData) $iTagCount=count($aTagData);
	
	$aImgData = cImageHighlight::get( $sSol, $sInstrument, $sProduct);
	if ($aImgData["d"]) $iHighCount=count($aImgData["d"]);
	
	$oResult = ["p"=>$sProduct, "t"=>$iTagCount, "h"=>$iHighCount];
	
	
	//***************************************************
	//output the tags
	cCommon::write_json($oResult);
?>