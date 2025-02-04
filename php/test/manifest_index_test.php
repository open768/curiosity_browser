<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";

$sSol = cHeader::get(cSpaceUrlParams::SOL, true, true);

cDebug::write("want sol $sSol");

$oSol = cCuriosityManifest::getSolEntry($sSol);
if ($oSol == null)  cDebug::error("couldnt find it 😭 - sol: $sSol");

cDebug::vardump($oSol);
$sLastUpdated = $oSol->last_updated;
$sSol = $oSol->sol;

cCuriosityManifestIndex::index_sol($sSol, $sLastUpdated, true);
