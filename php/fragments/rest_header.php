<?php

if (cDebug::is_debugging()) {
    include "$appPhpFragments/doctype.php";
    $title = "REST interface " . __FILE__;
?>
    <HTML>

    <HEAD>
        <TITLE>REST interface "<?= $title ?></title>
        <?php include "$appPhpFragments/header.php";  ?>
    </HEAD>

    <BODY>
    <?PHP
    include "$appPhpFragments/title.php";
} else
    @header('Content-Type: application/json');
