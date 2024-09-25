<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$phpInc . "/ckinc/image.php";

$sUrl = cHeader::get("u", true);
$iTop = cHeader::get("t", true, true);
$iLeft = cHeader::get("l", true, true);
$iWidth = cHeader::get("w", true, true);
$iHeight = cHeader::get("h", true, true);

try {
    $aData = cCuriosityImages::getThumbBlobData($sSol, $sInstr, $sProduct);
    cDebug::vardump($aData);
    $sMime = $aData->m;
    $sBlob = $aData->b;
    header("Content-Type: $sMime");
    echo $sBlob;
} catch (Exception $e) {
    cHeader::redirect(cAppLocations::$images . "/browser/nothumb.png");
}
