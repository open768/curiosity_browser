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
include cAppGlobals::$appPhpFragments . "/rest_header.php";

cDebug::extra_debug("<h2>test 1</h2>");
$aProducts = cMSLManifestOrmUtils::get_random_images("MAST%", 1);
cDebug::vardump($aProducts);

cDebug::extra_debug("<h2>test 2</h2>");
$oProduct = cMSLManifestOrmUtils::search_for_product("3865ML10426");
if ($oProduct !== null)
    cPageOutput::errorbox("failed test");
else {
    cPageOutput::messagebox("success test");
    cDebug::vardump($oProduct);
}

cDebug::extra_debug("<h2>test 3</h2>");
$oProduct = cMSLManifestOrmUtils::search_for_product("2838ML0148470330109174C00");
if ($oProduct == null)
    cPageOutput::errorbox("failed test");
else {
    cPageOutput::messagebox("success test");
    cDebug::vardump($oProduct);
}
