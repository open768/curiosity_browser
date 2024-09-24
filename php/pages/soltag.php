<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
cAppGlobals::$title = "Tags for sol:<span id='sol'>??</span>";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/soltag.js"></script>
</head>

<body onload="$(onLoadJQuery_SOLTAG);">
    <?php
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="w3-container w3-theme-d2" id="solbuttons">Please Wait</div>
    <div class="w3-container w3-theme-l4" id="soltag">
        Loading...
    </div>

    <!-- *************** footer *********************** -->
    <?php include cAppGlobals::$appPhpFragments . "/footer.php"     ?>
</body>

</html>