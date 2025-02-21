<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
//
 **************************************************************************/
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once cAppGlobals::$spaceInc . "/db/mission-manifest.php";
require_once cAppGlobals::$spaceInc . "/curiosity/orm_manifest.php";
require_once  cAppGlobals::$ckPhpInc . "/common.php";
include cAppGlobals::$appPhpFragments . "/rest_header.php";

cDebug::on();
prevent_buffering();

if (cCommonHeader::is_set("delete"))
    cCuriosityORMManifest::deleteEntireIndex();
else
    cPageOutput::messagebox("use delete param to delete index!");

$iMSLID = tblMissions::get_id(null, cCuriosityConstants::MISSION_ID);
cDebug::write("curiosity mission DB id $iMSLID");
$iInstrumentID = tblInstruments::get_id($iMSLID, "MAHLI");
cDebug::write("curiosity instrumentID is $iMSLID");

//update the index
try {
    cCuriosityORMManifestIndexer::updateIndex();
} catch (Exception $e) {
    cDebug::write("ignoring error");
}
cDebug::write("updated index 😁");

//tests
$iSol = "422";
$bIndex  = cCuriosityORMManifest::is_sol_in_index($iSol);
cDebug::write("sol $iSol in index: $bIndex");

$bIndex  = cCuriosityORMManifestIndexer::is_reindex_needed($iSol);
if ($bIndex)
    cDebug::write("sol $iSol reindex needed: $bIndex");
else
    cDebug::write("no sol $iSol reindex needed");

cDebug::write("Done 👌");
