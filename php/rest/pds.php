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
	require_once("$root/php/curiosity/pds.php");
	require_once("$root/php/pds/pdsreader.php");
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/common.php");
	
	cDebug::check_GET_or_POST();

	switch($_GET["a"]){
	case "s":
		$sSol = $_GET["s"];
		$sInstr = $_GET["i"];
		$sProduct = $_GET["p"];
		$sUTC = $_GET["t"];
		if (!$sSol || !$sInstr || !$sProduct) cDebug::error("missing parameters!");
	
	
		//-------------------
		$oData = cCuriosityPDS::search_pds($sSol, $sInstr, $sProduct);
		break;
	
	case "p":
		$sPDSUrl =  $_GET["u"];
		cDebug::write($sPDSUrl);
		$oData = cCuriosityPDS::get_pds_product($sPDSUrl);
		break;
	}
	
	cCommon::write_json($oData);
?>