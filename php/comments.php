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
	require_once("inc/comments.php");
	require_once("inc/curiosity/static.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$oResult = null;
	$sFolder = $_GET["f"] ;
	
	switch($sOperation){
		case "get":
			$aResult= cComments::get(OBJDATA_REALM, $sFolder);
			break;
		case "set":
			$sComment= $_GET["v"];
			$sUser = "anonymous";   //for the moment at least assume an anonymous user
			$aResult = cComments::set(OBJDATA_REALM,$sFolder, $sComment, $sUser);
			break;
		default:
			cDebug::error("unsupported operation");
			break;
	}
	
	//***************************************************
	//output the tags
	if (cDebug::$DEBUGGING)
		cDebug::vardump($aResult);
	else
		echo json_encode($aResult );	
?>