<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  "$phpInc/ckinc/blobber.php";
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

$sURL = $home;
