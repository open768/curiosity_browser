<?php
	$root=realpath("../..");
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/static.php");
	require_once("$root/php/inc/common.php");
	require_once("$root/php/curiosity/locations.php");
	
	cDebug::check_GET_or_POST();

	$aData = null;
	switch ( $_GET["o"]){
		case "sol":
			$sSol = $_GET["sol"];
			$aData = cCuriosityLocations::getSol($sSol);
			break;
		case "solBounds":
			$sSol = $_GET["sol"];
			$aData = cCuriosityLocations::getSolBounds($sSol);
			break;
		case "site":
			$sSite = $_GET["site"];
			$aData = cCuriosityLocations::getSite($sSite);
			break;
		case "siteBounds":
			$sSite = $_GET["site"];
			$aData = cCuriosityLocations::getSiteBounds($sSite);
			break;
		case "drive":
			$sDrive = $_GET["drive"];
			$aData = cCuriosityLocations::getDrive($sDrive);
			break;
		case "driveBounds":
			$sDrive = $_GET["drive"];
			$aData = cCuriosityLocations::getDriveBounds($sDrive);
			break;
		case "all":
			$aData = cCuriosityLocations::getSiteIndex();
			break;
	}
	cCommon::write_json($aData);
?>
