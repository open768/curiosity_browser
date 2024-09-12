<!-- Tracking -->
<?php
//include cAppGlobals::$appPhpFragments."/google.php";
if (!cDebug::is_localhost())
    include cAppGlobals::$appPhpFragments . "/appd.php";


$sFile = cCommonFiles::server_filename();

class cTitleConstants {
    static $IS_HOME;
    static $TITLE;
    static $IS_LOCALHOST;

    static function init($psFile) {
        $bIsHome = ($psFile === "index.php" && (cHeader::count_params() == 0));
        self::$IS_HOME = $bIsHome;
        self::$TITLE = cAppGlobals::$title;
        self::$IS_LOCALHOST =  cDebug::is_localhost();
    }
}
cTitleConstants::init($sFile);

cPageOutput::write_JS_class_constant_IDs(cTitleConstants::class);

?>
<div id='fb-root'></div>

<script src="<?= cAppGlobals::$AppJS ?>/classes/title.js"></script>
<script>
    $(() => cAppTitle.render_title("titlebut"))
</script>

<!-- Title Bar -->
<div class="w3-cell-row w3-header-theme ">
    <div class="w3-cell">
        <span class="w3-cell" id="titlebut">Crowded Spaces</span>
        <span class="w3-cell" id="toptitle"> - </span>
    </div>
    <div class="w3-cell w3-right-align">
        <span style="display: inline-block; width: 300px;" id="<?= cAppConfig::FB_ELEMENT_ID ?>">One Moment please...</span>
        <span style="display: inline-block; width: 100px;">
            <fb:login-button scope="<?= cAppConfig::FB_SCOPE ?>" onlogin="cFacebook.checkLoginStatus();" auto_logout_link="true" />
        </span>
    </div>
</div>