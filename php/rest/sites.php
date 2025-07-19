<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$spaceInc . "/curiosity/locations.php";
include cAppGlobals::$appPhpFragments . "/rest_header.php";


$aData = null;
$sOper = cHeader::get(cAppUrlParams::OPERATION);
$sVal = null;
$sDataType = null;

switch ($sOper) {
    case "sol":
        $sDataType = "sol";
        $sVal = cHeader::get($sDataType);
        $aData = cCuriosityLocations::getSol($sVal);
        break;
    case "solBounds":
        $sDataType = "sol";
        $sVal = cHeader::get($sDataType);
        $aData = cCuriosityLocations::getSolBounds($sVal);
        break;
    case "site":
        $sDataType = "site";
        $sVal = cHeader::get($sDataType);
        $aData = cCuriosityLocations::getSite($sVal);
        break;
    case "siteBounds":
        $sDataType = "site";
        $sVal = cHeader::get($sDataType);
        $aData = cCuriosityLocations::getSiteBounds($sVal);
        break;
    case "drive":
        $sDataType = "drive";
        $sVal = cHeader::get($sDataType);
        $aData = cCuriosityLocations::getDrive($sVal);
        break;
    case "driveBounds":
        $sDataType = "drive";
        $sVal = cHeader::get($sDataType);
        $aData = cCuriosityLocations::getDriveBounds($sVal);
        break;
    case "allSitesIndex":
        $aData = cCuriosityLocations::getSiteIndex();
        break;
    case "allSitesBounds":
        $aData = cCuriosityLocations::getAllSiteBounds();
        break;
}
cCommon::write_json(["o" => $sDataType, "v" => $sVal, "d" => $aData]);
