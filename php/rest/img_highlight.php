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
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/auth.php");
	require_once("$root/php/inc/pichighlight.php");
	require_once("$root/php/inc/static.php");
	require_once("$root/php/inc/indexes.php");
	require_once("$root/php/inc/common.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$oResult = null;
	
	switch($sOperation){
		case "add":
			$sUser = cAuth::must_get_user();
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$top= $_GET["t"];
			$left= $_GET["l"];
			$oResult = cImageHighlight::set(OBJDATA_REALM, $sSol, $sInstrument, $sProduct, $top, $left, $sUser);
			break;
		case "get":
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$oResult = cImageHighlight::get(OBJDATA_REALM, $sSol, $sInstrument, $sProduct);
			break;
		case "solcount":
			$sSol = $_GET["s"];
			$oResult = cIndexes::get_solcount(OBJDATA_REALM, $sSol, cImageHighlight::INDEX_SUFFIX);
			break;
		case "topsolindex":
			$oResult = cIndexes::get_top_sol_data(OBJDATA_REALM, cImageHighlight::INDEX_SUFFIX);
			break;
		case "soldata":
			$sSol = $_GET["s"];
			$oResult = cIndexes::get_sol_data(OBJDATA_REALM, $sSol, cImageHighlight::INDEX_SUFFIX);
			break;
		default:
			cDebug::error("unsupported operation");
			break;
	}
	
	//***************************************************
	//output the tags
	cCommon::write_json($oResult);
?>