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

	$sDirection = $_GET["d"] ;
	$sSol = $_GET["s"] ;
	$sProduct = $_GET["p"];
	$iFound = -1;
	$oData = null;
	cDebug::write("looking for $sProduct in sol $sSol");

	// find the product in the sol
	$aImages = cCuriosity::getNoThumbnails($sSol);
	for ($i=0; $i< count($aImages); $i++){
		$oItem = $aImages[$i];
		if ($oItem->itemName === $sProduct){
			cDebug::write("found it");
			$iFound = $i;
			break;
		}
	}	

	//and then the next or previous
	if ($iFound >=0){
		switch ($sDirection){
			case "p":
				$iFound --;
				if ($iFound < 0){
					$sSol = $sSol-1;
					$aImages = cCuriosity::getNoThumbnails($sSol);
					$iFound = count($aImages) -1;
				}
				break;
				
			case "n":
				$iFound ++;
				if ($iFound >= count( $aImages )){
					$sSol = $sSol+1;
					$aImages = cCuriosity::getNoThumbnails($sSol);
					$iFound = 0;
				}
				break;
		}
		$oData = ["s"=> $sSol, "d"=>$aImages[$iFound]];
	}

	//***************************************************
	//output the tags
	cCommon::write_json($oData);
?>
