<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::check_GET_or_POST();

	$sSol = $_GET["s"] ;
	$sInstrument = $_GET["i"];
	$iStart = $_GET["b"];
	$iEnd = $_GET["e"];
	
	
	$oInstrumentData = cCuriosity::getSolData($sSol, $sInstrument);
	$aImages=$oInstrumentData->data;
	$iCount = count($aImages);
	cDebug::write("original array has $iCount");
	
	//deal with boundary conditions
	if ($iStart < 0 ) $iStart = 0;
	if ($iEnd >= $iCount - 1) $iEnd = $iCount;
		
	cDebug::write("start=$iStart, end=$iEnd");

	//build the array
	$aOutput = [];
	if ($iStart < $iCount) 
		for ($iIndex = $iStart-1; $iIndex < $iEnd ; $iIndex++){
			$oItem = $aImages[$iIndex];
			cDebug::write("pushing to array");
			array_push($aOutput, $oItem);
		}
	
	cDebug::vardump($aOutput);
	echo json_encode(["max"=>$iCount, "start"=>$iStart, "images"=>$aOutput]);
?>