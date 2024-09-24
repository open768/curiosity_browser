<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/site.js"></script>
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/googleearth.js"></script>
    <script src="https://www.google.com/jsapi"></script>
    <script>
        google.load("earth", "1");
    </script>
</head>

<body onload="$(onLoadJQuery_SITES);">
</body>

</html>