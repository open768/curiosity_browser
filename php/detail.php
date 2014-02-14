<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::check_GET_or_POST();

	$sSol = $_GET["s"] ;
	$sInstrument = $_GET["i"];	
	$sProduct = $_GET["p"];
	
	$oInstrumentData = cCuriosity::getProductDetails($sSol, $sInstrument, $sProduct);
	echo json_encode($oInstrumentData );
?>

