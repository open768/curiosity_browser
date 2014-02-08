<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::$DEBUGGING=false;

	$aList = cCuriosity::getInstrumentList();
	echo json_encode($aList);	
?>
