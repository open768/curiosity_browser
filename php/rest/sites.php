<?php
	$root=realpath("../..");
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/static/static.php");
	require_once("$root/php/inc/common.php");
	require_once("$root/php/curiosity/locations.php");
	
	cDebug::check_GET_or_POST();

	$aData = null;
	$sOper = $_GET["o"];
	$sVal = null;
	$sDataType = null;
	
	switch ( $sOper){
		case "sol":
			$sDataType = "sol";
			$sVal = $_GET[$sDataType];
			$aData = cCuriosityLocations::getSol($sVal);
			break;
		case "solBounds":
			$sDataType = "sol";
			$sVal = $_GET[$sDataType];
			$aData = cCuriosityLocations::getSolBounds($sVal);
			break;
		case "site":
			$sDataType = "site";
			$sVal = $_GET[$sDataType];
			$aData = cCuriosityLocations::getSite($sVal);
			break;
		case "siteBounds":
			$sDataType = "site";
			$sVal = $_GET[$sDataType];
			$aData = cCuriosityLocations::getSiteBounds($sVal);
			break;
		case "drive":
			$sDataType = "drive";
			$sVal = $_GET[$sDataType];
			$aData = cCuriosityLocations::getDrive($sVal);
			break;
		case "driveBounds":
			$sDataType = "drive";
			$sVal = $_GET[$sDataType];
			$aData = cCuriosityLocations::getDriveBounds($sVal);
			break;
		case "allSitesIndex":
			$aData = cCuriosityLocations::getSiteIndex();
			break;
		case "allSitesBounds":
			$aData = cCuriosityLocations::getAllSiteBounds();
			break;
	}
	cCommon::write_json(["o"=>$sDataType, "v"=>$sVal, "d"=>$aData]);
?>