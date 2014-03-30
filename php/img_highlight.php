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
			$folder= $_GET["f"];
			$top= $_GET["t"];
			$left= $_GET["l"];
			$oResult = cImageHighlight::set(OBJDATA_REALM, $folder, $top, $left);
			break;
		case "get":
			$folder= $_GET["f"];
			$oResult = cImageHighlight::get(OBJDATA_REALM,$folder);
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