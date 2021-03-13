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
	require_once("$root/php/common.php");
	
	require_once("$spaceinc/curiosity/instrument.php");
	
	const TIMESLOT=10;
	

	$sSol = $_GET["s"] ;
	
	cDebug::write("getting instruments");
	$oInstruments = cInstrument::getInstrumentList();
	$oData = cCuriosity::getAllSolData($sSol);
	$aImages = $oData->images;
	
	$aData = [ "sol"=>$sSol, "cal"=>[], "instr"=>$oInstruments];

	
	cDebug::write("processing images");
	foreach ($aImages as $oItem){
		$sInstr = $oItem->instrument;
		$sInstrAbbr=cInstrument::getInstrumentAbbr($sInstr);
		$sDateTime = $oItem->utc;

		//ignore thumbnails
		if ($oItem->sampleType === "thumbnail")
			continue;

		//create array of dates, hours and 15 mins
		$aSplit = explode("T", $sDateTime);
		$sDate = $aSplit[0];
		if (! array_key_exists($sDate, $aData["cal"]))
			$aData["cal"][$sDate] = [];
		
		$aSplit= explode(":", $aSplit[1]);
		$min=floor($aSplit[1]/TIMESLOT) * TIMESLOT;
		$sTimeKey = $aSplit[0].":".$min;
		
		if (! array_key_exists($sTimeKey, $aData["cal"][$sDate]))
			$aData["cal"][$sDate][$sTimeKey] = [];
		
		array_push( $aData["cal"][$sDate][$sTimeKey], ["i"=>$sInstrAbbr, "d"=>$sDateTime, "p"=>$oItem->itemName]);
	}
	
	cCommon::write_json($aData);
?>

