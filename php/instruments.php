<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::check_GET_or_POST();

	if (isset( $_GET["s"]))
		$aList = cCuriosity::getSolInstrumentList($_GET["s"]);
	else
		$aList = cCuriosity::getInstrumentList();
	echo json_encode($aList);	
?>
