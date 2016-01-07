<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 -2015

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	$root=realpath("../..");
	$phpinc=realpath("../../../phpinc");
	require_once("$phpinc/ckinc/session.php");
	cSession::set_folder();
	session_start();
	
	require_once("$phpinc/ckinc/debug.php");
	require_once("$phpinc/ckinc/auth.php");
	require_once("$phpinc/ckinc/comments.php");
	require_once("$phpinc/curiosity/static.php");
	require_once("$phpinc/ckinc/common.php");
	require_once("$phpinc/sbbcode/SBBCodeParser.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$oResult = null;
	
	switch($sOperation){
		case "get":
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];

			$aResult= cComments::get( $sSol, $sInstrument, $sProduct);
			
			break;
		case "set":
			$sUser = cAuth::must_get_user(); 
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$sBBcode = $_GET['v'];

			cDebug::write("input was $sBBcode");
			$parser = new  SBBCodeParser\Node_Container_Document();
			$parser->parse($sBBcode);
			$sHTML = $parser->get_html();
			$sComment= utf8_encode($sHTML);
			
			$aResult = cComments::set($sSol, $sInstrument, $sProduct, $sComment, $sUser);
			break;
		default:
			cDebug::error("unsupported operation");
			break;
	}
	
	//***************************************************
	//output the data
	cCommon::write_json($aResult);
?>