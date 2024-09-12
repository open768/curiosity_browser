<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>sol Gigapans - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/solgigas.js"></script>
    <script src="<?= cAppGlobals::$jsWidgets ?>/solgigas.js"></script>
</head>

<body onload="$(onLoadJQuery_SOLGIG);">
    <?php
    cAppGlobals::$title = "Gigapans for sol:<span id='sol'>??</span>";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="w3-container w3-theme-d2" id='buttons'>loading...</div>
    <div class="w3-container w3-theme-l4" id="solgiga">
        Loading...
    </div>
    <P />

    <!-- *************** footer *********************** -->
    <?php
    $sExtraCredits = "Gigapans courtesy Neville Thompson http://www.gigapan.com/profiles/pencilnev";
    include cAppGlobals::$appPhpFragments . "/footer.php"
    ?>
</body>

</html>