<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::check_GET_or_POST();

	$sSol = $_GET["s"] ;
	$sInstrument = $_GET["i"];
	$iStart = $_GET["b"];
	$iEnd = $_GET["e"];
	
	
	$oInstrumentData = cCuriosity::getSolData($sSol, $sInstrument);
	$aData = $oInstrumentData->data;
	$iCount = count($aData);
	cDebug::write("original array has $iCount");
	
	//deal with boundary conditions
	if ($iStart < 0 ) $iStart = 0;
	if ($iEnd >= $iCount - 1) $iEnd = $iCount;
		
	cDebug::write("start=$iStart, end=$iEnd");

	//build the array
	$aOutput = [];
	if ($iStart < $iCount) 
		for ($iIndex = $iStart-1; $iIndex < $iEnd ; $iIndex++){
			$oItem = $aData[$iIndex];
			cDebug::write("pushing to array");
			array_push($aOutput, $oItem);
		}
	
	cDebug::vardump($aOutput);
	echo json_encode(["max"=>$iCount, "start"=>$iStart, "images"=>$aOutput]);
?>