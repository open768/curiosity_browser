<?php
$home = "../..";
require_once  "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$spaceInc . "/misc/pencilnev.php";

$aData = null;
$sOption = cHeader::get(cAppUrlParams::OPERATION);
switch ($sOption) {
    case "sol":
        $sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
        $aData = cPencilNev::get_sol_gigas($sSol);
        break;
    case "topsolindex":
        $aData = cPencilNev::get_top_gigas();
        break;
    default:
        cDebug::error("unrecognised option $sOption");
}
//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
cCommon::write_json($aData);
