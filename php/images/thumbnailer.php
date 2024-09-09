<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  "$phpInc/ckinc/image.php";

$sMission = cHeader::get(cSpaceUrlParams::MISSION);
$sSol = cHeader::get(cSpaceUrlParams::SOL);
$sInstr = cHeader::get(cSpaceUrlParams::INSTRUMENT);
$sProduct = cHeader::get(cSpaceUrlParams::PRODUCT);

if ($sMission == null || $sSol == null || $sInstr == null || $sProduct == null) {
    $sErr = "not enough params, needs:<br>" .
        cSpaceUrlParams::MISSION . " - mission,<br>" .
        cSpaceUrlParams::SOL . " - sol,<br>" .
        cSpaceUrlParams::INSTRUMENT . " - instrument,<br>" .
        cSpaceUrlParams::PRODUCT . " - product\n\n";
    cDebug::error($sErr);
}

try {
    $aData = cCuriosityImages::getThumbBlobData($sSol, $sInstr, $sProduct);
    $sMime = $aData["m"];
    $sBlob = $aData["b"];
    header("Content-Type: $sMime");
    echo $sBlob;
} catch (Exception $e) {
    cHeader::redirect(cAppLocations::$images . "/browser/nothumb.png");
}
