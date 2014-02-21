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

	$sDirection = $_GET["d"] ;
	$sSol = $_GET["s"] ;
	$sInstrument = $_GET["i"];	
	$sProduct = $_GET["p"];
	$iFound = -1;
	
	$oInstrumentData = cCuriosity::getSolData($sSol, $sInstrument);
	$aImages=$oInstrumentData->data;
	$iCount = count($aImages);
	//cDebug::vardump($aImages);
	
	//LOOK FOR THE PRODUCT
	for ($i = 0 ; $i<$iCount; $i++){
		$oItem = $aImages[$i];
		if ($oItem["p"] == $sProduct){
			$iFound =  $i;
			cDebug::write("found it - $i");
			break;
		}
	}
	
	//FIGURE OUT THE NEXT/PREVIOUS PRODUCT
	if ($iFound == -1)
		echo json_encode(null);
	else{
		if ($sDirection === "p"){
			$iFound--;
			if ($iFound <0) $iFound = $iCount-1;
		}else{
			$iFound++;
			if ($iFound >= $iCount) $iFound = 0;
		}
		echo json_encode($aImages[$iFound]);
	}
?>