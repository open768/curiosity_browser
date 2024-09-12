<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include "$appPhpFragments/doctype.php";
?>

<head>
    <?php
    include "$appPhpFragments/header.php";
    ?>
    <title>sol Gigapans - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$AppJS ?>/pages/solgigas.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/solgigas.js"></script>
</head>

<body onload="$(onLoadJQuery_SOLGIG);">
    <?php
    cAppGlobals::$title = "Gigapans for sol:<span id='sol'>??</span>";
    include "$appPhpFragments/title.php";
    ?>
    <div class="w3-container w3-theme-d2" id='buttons'>loading...</div>
    <div class="w3-container w3-theme-l4" id="solgiga">
        Loading...
    </div>
    <P />

    <!-- *************** footer *********************** -->
    <?php
    $sExtraCredits = "Gigapans courtesy Neville Thompson http://www.gigapan.com/profiles/pencilnev";
    include "$appPhpFragments/footer.php"
    ?>
</body>

</html>