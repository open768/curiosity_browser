<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	$root=realpath("../..");
	$phpinc=realpath("../../../phpinc");
	
	require_once("$root/php/curiosity/curiosity.php");
	require_once("$phpinc/ckinc/debug.php");
	require_once("$phpinc/ckinc/common.php");
	
	cDebug::check_GET_or_POST();

	$sSol = $_GET["s"] ;
	$sInstrument = $_GET["i"];	
	$sProduct = $_GET["p"];
	
	cDebug::write("getting product details for $sSol, $sInstrument, $sProduct");
	$oData = cCuriosity::getLocalThumbnail($sSol, $sInstrument, $sProduct);
	
	cCommon::write_json($oData);
?>
