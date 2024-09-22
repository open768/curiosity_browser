<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$phpInc . "/ckinc/image.php";

$sMission = cHeader::get(cSpaceUrlParams::MISSION, true);
$sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
$sInstr = cHeader::get(cSpaceUrlParams::INSTRUMENT, true);
$sProduct = cHeader::get(cSpaceUrlParams::PRODUCT, true);

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
