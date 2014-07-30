<?php
	$root=realpath("../..");
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/static.php");
	require_once("$root/php/inc/common.php");
	require_once("$root/php/curiosity/locations.php");
	
	cDebug::check_GET_or_POST();

	$aData = null;
	switch ( $_GET["o"]){
		case "site":
			$sSite = $_GET["site"];
			$aData = cCuriosityLocations::getSite($sSite);
			break;
		case "all":
			$aData = cCuriosityLocations::getSiteIndex();
			break;
	}
	cCommon::write_json($aData);
?>
