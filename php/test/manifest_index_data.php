<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";

cDebug::on(true);
$sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);
$sDeleteIt = cHeader::get("del", true);

cDebug::write("want sol $sSol");
$oData = cCuriosityManifestIndex::get_sol_data($sSol);
if ($oData !== null) {

    $iCount = count($oData->data);
    cDebug::write("$iCount rows in the database");

    if ($sDeleteIt === "Y") {
        cDebug::write("deleting $sSol");
        cCuriosityManifestIndex::delete_sol_index($sSol);

        $oData = cCuriosityManifestIndex::get_sol_data($sSol);
        if ($oData == null) cDebug::error("sol data didnt reindex as expected");



        $iCount = count($oData->data);
        cDebug::write("$iCount rows in the database");
    } else {
        cDebug::write("not deleting product");
    }
} else
    cDebug::error("sol $sSol is not in the index");
