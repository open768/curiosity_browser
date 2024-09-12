<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>Site - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$AppJS ?>/pages/site.js"></script>
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/googleearth.js"></script>
    <script src="https://www.google.com/jsapi"></script>
    <script>
        google.load("earth", "1");
    </script>
</head>

<body onload="$(onLoadJQuery_SITES);">
    <?php
    cAppGlobals::$title = "Site <span id=\"siteid\"></span>";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="gold">
        <button class="leftbutton" onclick="cBrowser.openWindow('allsites.php','allsites');">All Sites</button>
    </div>
    <div class="gold" id="site">
        Loading...
    </div>
    <div class="gold" id="geplugin">
        <div id="map" style="height: 400px; width: 600px;"></div>
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php include cAppGlobals::$appPhpFragments . "/footer.php" ?>
</body>

</html>