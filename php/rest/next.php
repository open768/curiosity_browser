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
	
	require_once("$root/php/curiosity/curiosity.php");
	require_once("$phpinc/ckinc/debug.php");
	require_once("$phpinc/ckinc/common.php");
	
	cDebug::check_GET_or_POST();

	$sDirection = $_GET["d"] ;
	$sSol = $_GET["s"] ;
	$sInstrument = $_GET["i"];	
	$sProduct = $_GET["p"];
	$iFound = -1;
	
	//get the data for sol and instrument to find the index of the product
	$oInstrumentData = cCuriosity::getSolData($sSol, $sInstrument);
	$aImages=$oInstrumentData->data;
	$iCount = count($aImages);
	
	//LOOK FOR THE PRODUCT
	for ($i = 0 ; $i<$iCount; $i++){
		$oItem = $aImages[$i];
		if ($oItem["p"] == $sProduct){
			$iFound =  $i;
			cDebug::write("found it - $i");
			break;
		}
	}
	
	if ($iFound == -1){
		cDebug::error("product not found - incorrect parameters given");
		return;
	}

	// go backwards or forwards in instrument list depending on parameters to script
	$bOverflow = false;
	$iIncrement = 1;
	if ($sDirection === "p") $iIncrement = -1;
	$iFound += $iIncrement;
		
	//have we gone past the beginning or end? look in neighbouring sols
	if (($iFound <0) || ($iFound >= $iCount)){
		cDebug::write("rolled off the beginning of the sol");
		while (($sSol >0) || ($sSol < $iCount)){
			$sSol = cCuriosity::nextSol($sSol, $iIncrement);
			if ($sSol == null){
				cDebug::error("no more sols - sorry");
				return;
			}
					
			$oInstrumentData = cCuriosity::getSolData($sSol, $sInstrument);
			$aImages=$oInstrumentData->data;
			$iCountNew = count($aImages);
			if ($iCountNew >0){
				$iFound = 0;
				if ($iIncrement == -1) $iFound = $iCountNew-1;
				break;
			}
		}
	}

	cCommon::write_json(["s"=>$sSol, "d"=>$aImages[$iFound]]);
?>