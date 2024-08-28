<!-- Tracking -->
<?php
//include("$appPhpFragments/google.php");
if (!cDebug::is_localhost()) {
    include("$appPhpFragments/appd.php");
}

$sFile = cCommonFiles::server_filename();

class cTitleConstants {
    static $IS_HOME;
    static $TITLE;
    static $IS_LOCALHOST;

    static function init($psFile) {
        global $sTitle;
        $bIsHome = ($psFile === "index.php" && (cHeader::count_params() == 0));
        self::$IS_HOME = $bIsHome;
        self::$TITLE = $sTitle;
        self::$IS_LOCALHOST =  cDebug::is_localhost();
    }
}
cTitleConstants::init($sFile);

cPageOutput::write_JS_class_constant_IDs("cTitleConstants");

?>
<div id='fb-root'></div>
<script>
    function render_title() {
        var oDiv = $("#titlebut")
        oDiv.empty();
        if (!cTitleConstants.IS_HOME) {
            var sUrl = cAppLocations.home + "/php/pages/index.php"
            var sImgUrl = cAppLocations.home + "/css/mb_images/greydude.png"
            var oImg = $("<img>", {
                class: "homebutton",
                src: sImgUrl
            })
            var oButton = cAppRender.make_button(null, "Home", "Home", false, () => cBrowser.openWindow(sUrl, "index"));
            {
                oButton.prepend(oImg);
                //oButton.addClass("homebutton")
                oDiv.append(oButton);
            }
        } else
            oDiv.append("Curiosity Browser")
        oDiv.append(" - " + cTitleConstants.TITLE)

        if (cTitleConstants.IS_LOCALHOST) oDiv.append(" - <font color='red'>DEVELOPMENT</font>")
    }
    $(render_title)
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