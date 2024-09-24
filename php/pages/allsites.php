<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
cAppGlobals::$title = "Sites";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/allsites.js"></script>
    <script>
        google.load("earth", "1");
    </script>
</head>

<body onload="$(onLoadJQuery_SITES);">
    <?php
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="gold">
        <font class="subtitle">Site:</font> <span id="sites"> loading...</span>
        <font class="subtitle">HiRise:</font><span id="hirise"> loading...</span>
    </div>
    <div class="w3-panel w3-red w3-leftbar w3-border-yellow">
        <h1>Work in progress - feature not available</h2>
    </div>
    <P>

        <?php include cAppGlobals::$appPhpFragments . "/footer.php" ?>
</body>

</html>