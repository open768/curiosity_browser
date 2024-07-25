<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2013 -2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	$home = "../..";
	require_once("$home/php/fragments/app-common.php");
	require_once("$spaceInc/curiosity/instrument.php");
	
	cDebug::check_GET_or_POST();

	if (isset( $_GET["s"])){
		if ($_GET["r"]==="true") cCuriosity::clearSolDataCache($_GET["s"]);
		$aList = cCuriosity::getSolInstrumentList($_GET["s"]);
	}else
		$aList = cInstrument::getInstrumentList();
		
	cCommon::write_json($aList);
?>
