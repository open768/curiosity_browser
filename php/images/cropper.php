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
    $aData = cCropper::get_crop_blob_data($sUrl, $iLeft, $iTop, $iWidth, $iHeight);
    $sMime = $aData->m;
    $sBlob = $aData->b;
    header("Content-Type: $sMime");
    echo $sBlob;
} catch (Exception $e) {
    cHeader::redirect(cAppLocations::$images . "/browser/nothumb.png");
}
