<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  cAppGlobals::$ckPhpInc . "/facebook.php";
cHeader::redirect_if_referred();
if (cFacebook_ServerSide::is_facebook()) {
    cFacebookTags::make_fb_sol_high_tags();
    exit;
}
include cAppGlobals::$appPhpFragments . "/doctype.php";
class cSolMosaicPageConstants {
    const  SOL_BUTTONS_ID = "sbid";
    const  MOSAIC_ID = "mid";
    const SOL_TITLE_ID = "st";
}
cAppGlobals::$title = "Highlight Mosaic for sol:<span id='" . cSolMosaicPageConstants::SOL_TITLE_ID . "'>??</span>";
?>

<head>
    <?php include cAppGlobals::$appPhpFragments . "/header.php"; ?>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/solmosaic.js"></script>
</head>

<body onload="$( ()=>cSolMosaic.onLoadJQuery() );">
    <?php
    cPageOutput::write_JS_class_constant_IDs(cSolMosaicPageConstants::class);
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="w3-container w3-theme-d2">
        <span id="<?= cSolMosaicPageConstants::SOL_BUTTONS_ID ?>"></span>
    </div>
    <div class="w3-container w3-theme-l2" id="<?= cSolMosaicPageConstants::MOSAIC_ID ?>">loading</div>

    <!-- *************** footer *********************** -->
    <?php include cAppGlobals::$appPhpFragments . "/footer.php"     ?>
</body>

</html>