<!-- Tracking -->
<?php
//include("$appPhpFragments/google.php");
include("$appPhpFragments/appd.php");

$sFile = cCommonFiles::server_filename();
$bIsHome =  ($sFile === "index.php");
?>
<div id='fb-root'></div>

<!-- Title Bar -->
<div class="w3-cell-row w3-header-theme ">
    <div class="w3-cell">
        <?php
        if ($bIsHome)
            echo "Curiosity Browser";
        else {
        ?>
            <button class='homebutton' onclick='cBrowser.openWindow("<?= $home ?>/php/pages/index.php","index")'>Home</button>
        <?php
        }
        ?>
        <span id="toptitle"><?= $sTitle ?></span>
        <?= (cDebug::is_localhost() ? " - <span><font color='red'>DEVELOPMENT</font></span>" : "") ?>
    </div>
    <div class="w3-cell w3-right-align">
        <span style="display: inline-block; width: 300px;" id="<?= cAppConfig::FB_ELEMENT_ID ?>">One Moment please...</span>
        <span style="display: inline-block; width: 100px;">
            <fb:login-button scope="<?= cAppConfig::FB_SCOPE ?>" onlogin="cFacebook.checkLoginStatus();" auto_logout_link="true" />
        </span>
    </div>
</div>