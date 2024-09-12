<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include "$appPhpFragments/doctype.php";
?>

<head>
    <?php
    include "$appPhpFragments/header.php";
    ?>
    <title>calendar - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$AppJS ?>/pages/cal.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/solcal.js"></script>
</head>

<body onload="$( ()=>cCalendar.onLoadJQuery() )">
    <?php
    cAppGlobals::$title = "Curiosity calendar for SOL: <span id='sol'>???</span>";
    include "$appPhpFragments/title.php";
    ?>
    <div id="solButtons"></div>
    <DIV ID="calendar">Loading...</div>

    <!-- footer -->
    <?php
    include "$appPhpFragments/footer.php"
    ?>
</body>

</html>