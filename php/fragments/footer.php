<div class="w3-cell-row w3-cell-middle">
    <div class="w3-cell about w3-padding-small w3-theme">
        <p class="credits">Data courtesy MSSS/MSL/NASA/JPL-Caltech.<br>Please note <a href="index.php#disclaim">site disclaimer</a></p>
        <?php if (isset($sExtraCredits)) { ?>
            <p class="credits"><?= $sExtraCredits ?>.</p>
        <?php } ?>
    </div>
    <div class="w3-cell about w3-cell-middle w3-theme-l1">
        <img src="<?= cAppGlobals::$appImages ?>/browser/chicken_icon.png" align="left">
        We're on
        <a href="https://github.com/open768/curiosity_browser"><img src="<?= cAppGlobals::$appImages ?>/github_logo.png"></a>
    </div>
    <div class="w3-cell about w3-cell-middle w3-theme">
        <a href="https://www.facebook.com/mars.features/"><img src="<?= cAppGlobals::$appImages ?>/facebook/FB-FindUsonFacebook-online-114.png" border="0"></a>
    </div>
    <div class="w3-cell about w3-cell-middle w3-theme-l1">
        <div class=" fb-like" data-href="<?= $_SERVER['REQUEST_URI'] ?>" data-layout="standard" data-action="like" data-size="small" data-show-faces="false" data-share="true"></div><br>
        <div class="fb-follow" data-href="https://www.facebook.com/mars.features/" data-layout="standard" data-size="small" data-show-faces="true"></div>
    </div>
</div>
<!-- status -->
<div class="w3-card w3-theme-l5">
    <span class="subtitle">Status:</span> <span class="status" id="<?= cAppIDs::STATUS_ID ?>"> loading...</span>
</div>