<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
("$appPhpFragments/doctype.php");
?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>All Highlights - Curiosity Browser</title>
    <script src="<?= $AppJSWidgets ?>/solhighgrid.js"></script>
    <script src="<?= $AppJS ?>/pages/allsolhighs.js"></script>
    <script src="<?= $AppJS ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_HIGHS);">
    <?php
    $sTitle = "Sols with Highlights";
    include("$appPhpFragments/title.php");
    ?>
    <div class="gold" id="solhighs">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        include("$appPhpFragments/footer.php")
        ?>
</body>

</html>