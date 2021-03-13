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
	require_once "$root/php/common.php";
	
	require_once("$spaceinc/curiosity/curiositypds.php");
	require_once("$spaceinc/pds/pdsreader.php");
	

	switch($_GET["a"]){
	case "s":
		$sSol = $_GET["s"];
		$sInstr = $_GET["i"];
		$sProduct = $_GET["p"];
		if (!$sSol || !$sInstr || !$sProduct) cDebug::error("missing parameters!");
	
	
		//-------------------
		try{
			$oData = cCuriosityPDS::search_pds($sSol, $sInstr, $sProduct);
		}catch (Exception $e){
			cDebug::write("search failed");
			$oData = null;
		}
		break;
	
	case "p":
		$sPDSUrl =  $_GET["u"];
		cDebug::write($sPDSUrl);
		try{
			$oData = cCuriosityPDS::get_pds_product($sPDSUrl);
		}catch (Exception $e){
			cDebug::write("error :".e );
			$oData = null;
		}
		break;
	}
	
	cCommon::write_json($oData);
?>