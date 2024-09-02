<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>sol Tags - Curiosity Browser</title>
    <script src="<?= $AppJS ?>/pages/soltag.js"></script>
</head>

<body onload="$(onLoadJQuery_SOLTAG);">
    <?php
    $sTitle = "Tags for sol:<span id='sol'>??</span>";
    include("$appPhpFragments/title.php");
    ?>
    <div class="w3-container w3-theme-d2" id="solbuttons">Please Wait</div>
    <div class="w3-container w3-theme-l4" id="soltag">
        Loading...
    </div>

    <!-- *************** footer *********************** -->
    <?php include("$appPhpFragments/footer.php")     ?>
</body>

</html>