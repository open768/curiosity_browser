<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	require_once("inc/curiosity/json.php");
	require_once("inc/curiosity/pds.php");
	require_once("inc/curiosity/lbl.php");
	require_once("inc/debug.php");
	
	cDebug::check_GET_or_POST();

	$sProduct = $_GET["p"];
	
	$sPDSProduct = cCuriosityPDS::convert_Msl_product($sProduct);
	
	if (cDebug::$DEBUGGING)
		cDebug::vardump($sPDSProduct);
	else
		echo json_encode($sPDSProduct );
?>