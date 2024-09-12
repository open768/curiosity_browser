<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>calendar - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/cal.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/solcal.js"></script>
</head>

<body onload="$( ()=>cCalendar.onLoadJQuery() )">
    <?php
    cAppGlobals::$title = "Curiosity calendar for SOL: <span id='sol'>???</span>";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div id="solButtons"></div>
    <DIV ID="calendar">Loading...</div>

    <!-- footer -->
    <?php
    include cAppGlobals::$appPhpFragments . "/footer.php"
    ?>
</body>

</html>