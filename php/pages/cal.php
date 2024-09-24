<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
cAppGlobals::$title = "calendar for SOL: <span id='sol'>???</span>";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/cal.js"></script>
    <script src="<?= cAppGlobals::$jsWidgets ?>/solcal.js"></script>
</head>

<body onload="$( ()=>cCalendar.onLoadJQuery() )">
    <?php
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