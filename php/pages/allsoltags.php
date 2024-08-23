<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>Sol Tags - Curiosity Browser</title>
    <script src="<?= $AppJS ?>/pages/allsoltags.js"></script>
    <script src="<?= $AppJSWidgets ?>/soltags.js"></script>
    <script src="<?= $AppJS ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_TAGS);">
    <?php
    $sTitle = "Tagged Sols";
    include("$appPhpFragments/title.php");
    ?>
    <DIV class="title">Tagged Sols</DIV>
    <p>
    <div class="gold" id="soltag">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        include("$appPhpFragments/footer.php")
        ?>
</body>

</html>