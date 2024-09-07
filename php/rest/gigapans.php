<?php
$home = "../..";
require_once  "$home/php/fragments/app-common.php";
require_once  "$spaceInc/misc/pencilnev.php";

$aData = null;
$sOption = cHeader::get(cAppUrlParams::OPERATION);
switch ($sOption) {
    case "sol":
        $aData = cPencilNev::get_sol_gigas(cHeader::get(cSpaceUrlParams::SOL));
        break;
    case "topsolindex":
        $aData = cPencilNev::get_top_gigas();
        break;
    default:
        cDebug::error("unrecognised option $sOption");
}
//############################### response ####################
include "$appPhpFragments/rest_header.php";
cCommon::write_json($aData);
