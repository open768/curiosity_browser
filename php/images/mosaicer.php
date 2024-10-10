<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$ckPhpInc . "/image.php";

$sKey = cHeader::get(cAppUrlParams::MOSAIC_PARAM, true);
try {
    $oBlob = cMosaicer::get($sKey);
    $sMime = $oBlob->mime_type;

    header("Content-Type: $sMime");
    echo $oBlob->blob;
} catch (Exception $e) {
    cHeader::redirect(cAppLocations::$images . "/browser/nothumb.png");
}
