<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>sol Gigapans - Curiosity Browser</title>
    <script src="<?= $AppJS ?>/pages/solgigas.js"></script>
    <script src="<?= $AppJSWidgets ?>/solgigas.js"></script>
</head>

<body onload="$(onLoadJQuery_SOLGIG);">
    <?php
    $sTitle = "Gigapans for sol:<span id=\"sol\">??</span>";
    include("$appPhpFragments/title.php");
    ?>
    <div class="gold">
        <button class="leftbutton" onclick="cBrowser.openWindow('allgigas.php','allgigas');">All Gigapans</button>
    </div>
    <div class="gold" id="solgiga">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        $sExtraCredits = "Gigapans courtesy Neville Thompson http://www.gigapan.com/profiles/pencilnev.";
        include("$appPhpFragments/footer.php")
        ?>
</body>

</html>