<?php
require_once "$phpInc/ckinc/header.php";
require_once "$phpInc/ckinc/facebook.php";
?>
<!-- facebook meta tags -->
<?php
$oFBAppId = cFacebook_ServerSide::getAppID();
$sFBUser = cFacebook_ServerSide::getSessionUser();
?>
<meta property="fb:app_id" content="<?= $oFBAppId->id ?>" >

<!-- CSS -->
<link rel="icon" href="<?= $appImages ?>/browser/dude.ico" type="image/x-icon" >
<LINK href="<?= $home ?>/css/app.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?= $jsExtra ?>/jquery-ui/jquery-ui.min.css">
<link rel="stylesheet" href="<?= $jsExtra ?>/jquery-spinner/css/gspinner.min.css">
<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">

<!-- common ckinc -->
<script src="<?= $jsInc ?>/ck-inc/common.js"></script>
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
    cFacebook.buttonID = "fbusername";
    cFacebook.ServerSide = "<?= $home ?>/php/rest/facebook.php";
    cFacebook.ServerUser = "<?= $sFBUser ?>";
    cFacebook.Version = "<?= cAppSecret::FB_VERSION ?>";
    cFacebook.AppID = <?= $oFBAppId->id ?>;
</script>

<!-- New relic -->
<script src="<?= $AppJS ?>/fragments/newrelic.php"></script>