<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$phpInc . "/ckinc/facebook.php";
cHeader::redirect_if_referred();
if (cFacebook_ServerSide::is_facebook()) {
    cFacebookTags::make_fb_sol_high_tags();
    exit;
}
include cAppGlobals::$appPhpFragments . "/doctype.php";
class cSolHighPageConstants {
    const  SOL_BUTTONS_ID = "sbid";
    const  HIGHLIGHTS_ID = "hid";
    const SOL_TITLE_ID = "st";
}
cAppGlobals::$title = "Highlights for sol:<span id='" . cSolHighPageConstants::SOL_TITLE_ID . "'>??</span>";

?>

<head>
    <?php include cAppGlobals::$appPhpFragments . "/header.php"; ?>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/solhighs.js"></script>
    <script src="<?= cAppGlobals::$jsWidgets ?>/solhighlights.js"></script>
</head>

<body onload="$( ()=>cSolHighs.onLoadJQuery() );">
    <?php
    cPageOutput::write_JS_class_constant_IDs(cSolHighPageConstants::class);
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="w3-container w3-theme-d2">
        <span id="<?= cSolHighPageConstants::SOL_BUTTONS_ID ?>"></span>
    </div>
    <Div class="w3-container w3-theme-l2" id="<?= cSolHighPageConstants::HIGHLIGHTS_ID ?>"></div>

    <!-- *************** footer *********************** -->
    <?php include cAppGlobals::$appPhpFragments . "/footer.php"     ?>
</body>

</html>