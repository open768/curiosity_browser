<?php
$home = "../..";
require_once  "$home/php/fragments/app-common.php";
require_once  "$spaceInc/misc/pencilnev.php";

$aData = null;
switch ($_GET["o"]) {
    case "sol":
        $aData = cPencilNev::get_sol_gigas($_GET["s"]);
        break;
    case "all":
        $aData = cPencilNev::get_top_gigas();
        break;
}
//############################### response ####################
include "$appPhpFragments/rest_header.php";
cCommon::write_json($aData);
