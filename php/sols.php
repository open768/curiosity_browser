<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::$DEBUGGING=false;


	$oManifest = cCuriosity::getManifest();
	$aSols = $oManifest->sols;
	$aData = [];
	
	
	foreach ($aSols as $oSol){
		$iSol = $oSol->sol;
		$sDate = $oSol->last_updated;
		array_push( $aData, ["sol"=>$iSol, "date"=>$sDate]);
	}
	
	echo json_encode($aData);
?>