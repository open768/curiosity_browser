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
	require_once("inc/tags.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$sRealm = $_GET["r"] ;
	$sFolder = $_GET["f"] ;
	
	if ($sOperation === "set"){
		$sTag = $_GET["v"] ;
		$sUser = "anonymous";   //for the moment at least assume an anonymous user
		cTags::set_tag($sRealm, $sFolder, $sTag, $sUser);
	}
	$aData = cTags::get_tag_names($sRealm, $sFolder);
		
	//***************************************************
	//output the tags
	if (cDebug::$DEBUGGING)
		cDebug::vardump($aData);
	else
		echo json_encode($aData );	
?>