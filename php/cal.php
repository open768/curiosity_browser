<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::check_GET_or_POST();

	$sSol = $_GET["s"] ;
	
	$oData = cCuriosity::getAllSolData($sSol);
	$aImages = $oData->images;
	
	$aData = [];
	
	foreach ($aImages as $oItem){
		$sInstr = $oItem->instrument;
		$sDateTime = $oItem->utc;

		array_push($aData, ["i"=>$sInstr, "u"=>$sDateTime]);
		//TBD create array of dates, hours and 15 mins
	}
	
	echo json_encode($aData );
?>

