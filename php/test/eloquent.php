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


//cCuriosityORMManifest::empty_ORM_tables();
$iMSLID = tblMissions::get_id(null, cCuriosity::MISSION_ID);
cDebug::write("curiosity mission DB id $iMSLID");
$iInstrumentID = tblInstruments::get_id($iMSLID, "MAHLI");
cDebug::write("curiosity instrumentID is $iMSLID");

cCuriosityORMManifest::updateIndex();
