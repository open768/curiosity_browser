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
if (cDebug::is_debugging()) {
    include cAppGlobals::$appPhpFragments . "/doctype.php";
    cAppGlobals::$title = "REST interface " . cCommonFiles::server_filename();
?>

    <HEAD>
        <TITLE><?= cAppGlobals::$title ?></title>
        <?php include cAppGlobals::$appPhpFragments . "/header.php";  ?>
    </HEAD>

    <BODY>
    <?PHP
    include cAppGlobals::$appPhpFragments . "/title.php";
} else
    @header('Content-Type: application/json');
