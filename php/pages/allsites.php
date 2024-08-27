<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>All Sites - Curiosity Browser</title>
    <script src="<?= $AppJS ?>/pages/allsites.js"></script>
    <script>
        google.load("earth", "1");
    </script>
</head>

<body onload="$(onLoadJQuery_SITES);">
    <?php
    $sTitle = "Sites";
    include("$appPhpFragments/title.php");
    ?>
    <div class="gold">
        <font class="subtitle">Site:</font> <span id="sites"> loading...</span>
        <font class="subtitle">HiRise:</font><span id="hirise"> loading...</span>
    </div>
    <div class="w3-panel w3-pale-red w3-leftbar w3-border-red">
        <h1>Work in progress - feature not available</h2>
    </div>
    <P>

        <?php include("$appPhpFragments/footer.php") ?>
</body>

</html>