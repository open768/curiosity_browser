<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	require_once("inc/debug.php");
	require_once("inc/pichighlight.php");
	require_once("inc/curiosity/static.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$oResult = null;
	
	switch($sOperation){
		case "add":
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$top= $_GET["t"];
			$left= $_GET["l"];
			$sUser = "anonymous";   //for the moment at least assume an anonymous user
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
			$oResult = cIndexes::get_solcount(OBJDATA_REALM, $sSol, cImageHighlight::SOL_HIGH_FILE);
			break;
		case "topsolindex":
			$oResult = cIndexes::get_top_sol_data(OBJDATA_REALM, cImageHighlight::TOP_SOL_HIGH_FILE);
			break;
		case "soldata":
			$sSol = $_GET["s"];
			$oResult = cIndexes::get_sol_data(OBJDATA_REALM, $sSol, cImageHighlight::SOL_HIGH_FILE);
			break;
		default:
			cDebug::error("unsupported operation");
			break;
	}
	
	//***************************************************
	//output the tags
	if (cDebug::$DEBUGGING)
		cDebug::vardump($oResult);
	else
		echo json_encode($oResult );	
?>