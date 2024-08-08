<?php
require_once "$phpInc/ckinc/header.php";
require_once "$phpInc/ckinc/facebook.php";
?>
<!-- facebook meta tags -->
<?php
$oFBAppId = cFacebook_ServerSide::getAppID();
$sFBUser = cFacebook_ServerSide::getSessionUser();
?>
<meta property="fb:app_id" content="<?= $oFBAppId->id ?>">

<!-- CSS -->
<link rel="icon" href="<?= $appImages ?>/browser/dude.ico" type="image/x-icon">
<LINK href="<?= $home ?>/css/app.css" rel="stylesheet" type="text/css">
<LINK href="<?= $home ?>/css/app-theme.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?= $jsExtra ?>/jquery-ui/jquery-ui.min.css">
<link rel="stylesheet" href="<?= $jsExtra ?>/jquery-spinner/css/gspinner.min.css">

<!-- CSS frameworks -->
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<!-- common ckinc -->
<script src="<?= $jsInc ?>/ck-inc/common.js"></script>
<script src="<?= $jsInc ?>/ck-inc/render.js"></script>
<script src="<?= $jsInc ?>/ck-inc/debug.js"></script>
<script src="<?= $jsExtra ?>/bean/bean.js"></script>

<!-- jquery -->
<script src="<?= $jsExtra ?>/jquery/jquery-3.6.0.min.js"></script>
<script src="<?= $jsExtra ?>/jquery-ui/jquery-ui.js"></script>
<script src="<?= $jsExtra ?>/jquery-inview/jquery.inview.min.js"></script>
<script src="<?= $jsExtra ?>/jquery-visible/jquery.visible.min.js"></script>
<script src="<?= $jsExtra ?>/jquery-spinner/g-spinner.min.js"></script>
<script src="<?= $jsExtra ?>/jquery-cookie/jquery.cookie.js"></script>

<!-- everything else -->
<script>
    class cSecret {
        static GA_TrackingID = "<?= cAppSecret::GOOGLE_ANALYTICS_ID ?>"
        static GA_App = "mars-tourist-guide.co.uk"
    }

    class cLocations {
        static home = "<?= $home ?>"
        static rest = "<?= $home ?>/php/rest"
        static jsextra = "<?= $jsExtra ?>"
    };
</script>
<script src="<?= $jsInc ?>/ck-inc/http.js"></script>
<script src="<?= $jsInc ?>/ck-inc/httpqueue.js"></script>
<script src="<?= $jsInc ?>/ck-inc/auth.js"></script>
<script src="<?= $jsInc ?>/ck-inc/space/curiosity.js"></script>
<script src="<?= $jsInc ?>/ck-inc/space/space.js"></script>
<script src="<?= $jsInc ?>/ck-inc/space/tagging.js"></script>
<script src="<?= $jsInc ?>/ck-inc/space/imghilite.js"></script>

<!-- Facebook -->
<script src="<?= $jsInc ?>/ck-inc/facebook.js"></script>

<script>
    cFacebook.ServerSide = "<?= $home ?>/php/rest/facebook.php";
    cFacebook.ServerUser = "<?= $sFBUser ?>";
    cFacebook.Version = "<?= cAppConfig::FB_VERSION ?>";
    cFacebook.AppID = <?= $oFBAppId->id ?>;
    bean.on(
        cFacebook,
        cFacebook.STATUS_EVENT,
        (psText) => $("#<?= cAppConfig::FB_ELEMENT_ID ?>").html(psText)
    );
</script>

<!-- New relic -->
<script src="<?= $AppJS ?>/fragments/newrelic.php"></script>