<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";  ?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>Tags: Curiosity Browser</title>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/tag.js"></script>
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/queue.js"></script>
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/actionqueue.js"></script>
    <script src="<?= cAppGlobals::$jsWidgets ?>/tag-view.js"></script>
    <script src="<?= cAppGlobals::$jsWidgets ?>/image.js"></script>
    <script src="<?= cAppGlobals::$jsWidgets ?>/tagcloud.js"></script>
</head>

<body onload="$(onLoadJQuery_TAG);">
    <?php
    cAppGlobals::$title = "Instances of Tag <span id='tagname'>tag goes here</span>";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="w3-cell-row">
        <div class="w3-cell" id="tagcloud">Loading tags</div>
        <div class="w3-cell">
            <header class="w3-theme-d2">
                <h3>This Tag was seen in the following:</h3>
            </header>
            <div class="w3-container w3-theme-l4" id="tagdata">
                <span class="subtitle">initialising...</span>
            </div>
        </div>
    </div>
    <P />
    <!-- footer -->
    <?php include cAppGlobals::$appPhpFragments . "/footer.php"     ?>
</body>

</html>