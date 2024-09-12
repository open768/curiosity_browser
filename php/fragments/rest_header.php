<?php
if (cDebug::is_debugging()) {
    include cAppGlobals::$appPhpFragments . "/doctype.php";
    cAppGlobals::$title = "REST interface " . cCommonFiles::server_filename();
?>
    <HTML>

    <HEAD>
        <TITLE><?= cAppGlobals::$title ?></title>
        <?php include cAppGlobals::$appPhpFragments . "/header.php";  ?>
    </HEAD>

    <BODY>
    <?PHP
    include cAppGlobals::$appPhpFragments . "/title.php";
} else
    @header('Content-Type: application/json');
