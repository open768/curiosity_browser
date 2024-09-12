<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  "$phpInc/ckinc/facebook.php";
cHeader::redirect_if_referred();
if (cFacebook_ServerSide::is_facebook()) {
    cFacebookTags::make_fb_sol_high_tags();
    exit;
}
include "$appPhpFragments/doctype.php";
class cSolHighPageConstants {
    const  SOL_BUTTONS_ID = "sbid";
    const  HIGHLIGHTS_ID = "hid";
    const  CHK_MOSAIC_ID = "cmid";
    const SOL_TITLE_ID = "st";
}

?>

<head>
    <?php include "$appPhpFragments/header.php"; ?>
    <title>Sol Highlights - Curiosity Browser </title>
    <script src="<?= $AppJS ?>/pages/solhighs.js"></script>
    <script src="<?= $AppJSWidgets ?>/solhighlights.js"></script>
</head>

<body onload="$( ()=>cSolHighs.onLoadJQuery() );">
    <?php
    cAppGlobals::$title = "Highlights for sol:<span id='" . cSolHighPageConstants::SOL_TITLE_ID . "'>??</span>";
    cPageOutput::write_JS_class_constant_IDs(cSolHighPageConstants::class);
    include "$appPhpFragments/title.php";
    ?>
    <div class="w3-container w3-theme-d2">
        <span id="<?= cSolHighPageConstants::SOL_BUTTONS_ID ?>"></span>

        <span><input id="<?= cSolHighPageConstants::CHK_MOSAIC_ID ?>" type="checkbox">Mosaic</span>
    </div>
    <Div class="w3-container w3-theme-l2" id="<?= cSolHighPageConstants::HIGHLIGHTS_ID ?>"></div>

    <!-- *************** footer *********************** -->
    <?php include "$appPhpFragments/footer.php"     ?>
</body>

</html>