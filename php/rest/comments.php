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
	require_once("$root/php/inc/comments.php");
	require_once("$root/php/inc/static.php");
	require_once("$root/php/inc/common.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$oResult = null;
	
	switch($sOperation){
		case "get":
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];

			$aResult= cComments::get(OBJDATA_REALM, $sSol, $sInstrument, $sProduct);
			
			break;
		case "set":
			$sUser = cAuth::must_get_user(); 
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$sComment= utf8_encode($_GET["v"]);
			$aResult = cComments::set(OBJDATA_REALM,$sSol, $sInstrument, $sProduct, $sComment, $sUser);
			break;
		default:
			cDebug::error("unsupported operation");
			break;
	}
	
	//***************************************************
	//output the data
	cCommon::write_json($aResult);
?>