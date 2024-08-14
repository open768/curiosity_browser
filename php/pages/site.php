<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");  ?>
<html>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>Site - Curiosity Browser</title>
    <script src="<?= $AppJS ?>/pages/site.js"></script>
    <script src="<?= $jsInc ?>/ck-inc/googleearth.js"></script>
    <script src="https://www.google.com/jsapi"></script>
    <script>
        google.load("earth", "1");
    </script>
</head>

<body onload="$(onLoadJQuery_SITES);">
    <?php
    $sTitle = "Site <span id=\"siteid\"></span>";
    include("$appPhpFragments/title.php");
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
        <?php include("$appPhpFragments/footer.php") ?>
</body>

</html>