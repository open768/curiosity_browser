<!-- Tracking -->
<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
//
 **************************************************************************/
if (cAppConfig::USE_GOOGLE_ANALYTICS)
    include cAppGlobals::$appPhpFragments . "/google.php";

if (!cCommonEnvironment::is_localhost() && cAppConfig::USE_APPD)
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
        self::$IS_LOCALHOST =  cCommonEnvironment::is_localhost();
    }
}
cTitleConstants::init($sFile);

cPageOutput::write_JS_class_constant_IDs(cTitleConstants::class);
cPageOutput::write_JS_class_constant_IDs(cAppStatus::class);

?>
<div id='fb-root'></div>

<script src="<?= cAppGlobals::$jsHome ?>/classes/title.js"></script>
<script>
    $(() => cAppTitle.render_title("titlebut"))
</script>

<!-- Title Bar -->
<div class="w3-cell-row w3-header-theme titlebar">
    <div class="w3-cell">
        <span class="w3-cell" id="titlebut">Crowded Spaces</span>
        <span class="w3-cell" id="toptitle"> - </span>
    </div>
    <div class="w3-cell w3-right-align">
        <?php
        if (cAppConfig::USE_FACEBOOK) {
        ?>
            <span class="fb_name" id="<?= cFBConfig::ELEMENT_ID ?>">One Moment please...</span>
            <span class="fb_button">
                <fb:login-button scope="<?= cFBConfig::SCOPE ?>" onlogin="cFacebook.checkLoginStatus();" auto_logout_link="true" />
            </span>
        <?php
        } else
            echo "no Facebook"
        ?>
    </div>
</div>