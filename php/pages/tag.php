<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");  ?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>Tags: Curiosity Browser</title>
    <script src="<?= $AppJS ?>/pages/tag.js"></script>
    <script src="<?= $jsInc ?>/ck-inc/queue.js"></script>
    <script src="<?= $jsInc ?>/ck-inc/actionqueue.js"></script>
    <script src="<?= $AppJSWidgets ?>/tag-view.js"></script>
    <script src="<?= $AppJSWidgets ?>/image.js"></script>
    <script src="<?= $AppJSWidgets ?>/tagcloud.js"></script>
</head>

<body onload="$(onLoadJQuery_TAG);">
    <?php
    $sTitle = "Instances of Tag <span id='tagname'>tag goes here</span>";
    include("$appPhpFragments/title.php");
    ?>
    <div class="w3-cell-row">
        <div class="w3-cell w3-theme-l3" style="width:200px" id="tagcloud">Loading tags</div>
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
    <?php include("$appPhpFragments/footer.php")     ?>
</body>

</html>