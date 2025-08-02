<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$ckPhpInc . "/image.php";
include cAppGlobals::$appPhpFragments . "/rest_header.php";

$sUrl = cHeader::get(cAppUrlParams::URL, true);
$iTop = cHeader::get(cAppUrlParams::HIGHLIGHT_TOP, true, true);
$iLeft = cHeader::get(cAppUrlParams::HIGHLIGHT_LEFT, true, true);
$iWidth = cHeader::get(cAppUrlParams::HIGHLIGHT_WIDTH, true, true);
$iHeight = cHeader::get(cAppUrlParams::HIGHLIGHT_HEIGHT, true, true);

$iTop = floor(floatval($iTop));
$iLeft = floor(floatval($iLeft));

try {
    $oCropData = cCropper::get_crop_blob_data($sUrl, $iLeft, $iTop, $iWidth, $iHeight);
    $sMime = $oCropData->blob->mime_type;
    $sBlob = $oCropData->blob->blob;
    header("Content-Type: $sMime");
    echo $sBlob;
} catch (Exception $e) {
    cHeader::redirect(cAppLocations::$images . "/browser/nothumb.png");
}
