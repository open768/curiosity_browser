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
	require_once("$root/php/inc/tags.php");
	require_once("$root/php/inc/auth.php");
	require_once("$root/php/inc/static.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$aData = null;
	
	switch($sOperation){
		case "set":
			$sUser = cAuth::must_get_user(); 
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$sTag = $_GET["v"] ;
			cTags::set_tag(OBJDATA_REALM, $sSol, $sInstrument, $sProduct, $sTag, $sUser);
		case "get":
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$aData = cTags::get_tag_names(OBJDATA_REALM, $sSol, $sInstrument, $sProduct);
			break;
		case "detail":
			$sTag = $_GET["t"] ;
			$aData = cTags::get_tag_index(OBJDATA_REALM, $sTag);
			break;
		case "topsolindex":
			$aData = cTags::get_top_sol_index(OBJDATA_REALM);
			break;
		case "sol":
			$sSol = $_GET["s"];
			$aData = cTags::get_sol_tags(OBJDATA_REALM, $sSol);
			break;
		case "solcount":
			$sSol = $_GET["s"];
			$aData = cTags::get_sol_tag_count(OBJDATA_REALM, $sSol);
			break;
		case "all":
			$aData = cTags::get_top_tags(OBJDATA_REALM);
			break;
	}
	
	//***************************************************
	//output the tags
	if (cDebug::$DEBUGGING)
		cDebug::vardump($aData);
	else
		echo json_encode($aData );	
?>