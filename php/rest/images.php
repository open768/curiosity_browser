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
	$phpinc=realpath("../../../phpinc");
	require_once("$phpinc/ckinc/session.php");
	cSession::set_folder();
	session_start();
	
	require_once("$root/php/curiosity/curiosity.php");
	require_once("$phpinc/ckinc/debug.php");
	require_once("$phpinc/ckinc/common.php");
	
	cDebug::check_GET_or_POST();

	$sSol = $_GET["s"] ;
	$sInstrument = $_GET["i"];
	$iStart = $_GET["b"];
	$iEnd = $_GET["e"];
	
	
	cDebug::write("getting sol $sSol data");
	$oInstrumentData = cCuriosity::getSolData($sSol, $sInstrument);
	$aData = $oInstrumentData->data;
	$iCount = count($aData);
	
	cDebug::write("original array has $iCount");
	//cDebug::vardump($aData);
	
	//deal with boundary conditions
	if ($iStart < 1 ) $iStart = 1;
	if ($iEnd > $iCount) $iEnd = $iCount;
	cDebug::write("start=$iStart, end=$iEnd");

	//build the array
	$aOutput = [];
	for ($iIndex = $iStart-1; $iIndex < $iEnd ; $iIndex++){
		$oItem = $aData[$iIndex];
		cDebug::write("pushing to array");
		array_push($aOutput, $oItem);
	}
	
	//output the json
	$aData = ["max"=>$iCount, "start"=>$iStart, "images"=>$aOutput];
	cCommon::write_json($aData);
?>