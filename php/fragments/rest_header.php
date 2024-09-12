<?php
if (cDebug::is_debugging()) {
    include "$appPhpFragments/doctype.php";
    cAppGlobals::$title = "REST interface " . cCommonFiles::server_filename();
?>
    <HTML>

    <HEAD>
        <TITLE><?= cAppGlobals::$title ?></title>
        <?php include "$appPhpFragments/header.php";  ?>
    </HEAD>

    <BODY>
    <?PHP
    include "$appPhpFragments/title.php";
} else
    @header('Content-Type: application/json');
