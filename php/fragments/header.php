<?php
require_once cAppGlobals::$phpInc . "/ckinc/header.php";
require_once cAppGlobals::$phpInc . "/ckinc/facebook.php";
?>
<!-- facebook meta tags -->
<?php
$oFBAppId = cFacebook_ServerSide::getAppID();
$sFBUser = cFacebook_ServerSide::getSessionUser();
?>
<meta property="fb:app_id" content="<?= $oFBAppId->id ?>">

<!-- CSS -->
<link rel="icon" href="<?= cAppGlobals::$appImages ?>/browser/dude.ico" type="image/x-icon">
<LINK href="<?= $home ?>/css/app.css" rel="stylesheet" type="text/css">
<LINK href="<?= $home ?>/css/app-theme.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?= cAppGlobals::$jsExtra ?>/jquery-ui/1.14/jquery-ui.min.css">
<link rel="stylesheet" href="<?= cAppGlobals::$jsExtra ?>/jquery-spinner/css/gspinner.min.css">

<!-- CSS frameworks -->
<!-- <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"> -->
<link rel="stylesheet" href="<?= $home ?>/css/w3.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<!-- Constants -->
<script>
    class cSecret {
        static GA_TrackingID = "<?= cAppSecret::GOOGLE_ANALYTICS_ID ?>"
        static GA_App = "mars-tourist-guide.co.uk"
    }
</script>
<?php
cPageOutput::write_JS_class_constant_IDs(cAppLocations::class);
cPageOutput::write_JS_class_constant_IDs(cSpaceConstants::class);
cPageOutput::write_JS_class_constant_IDs(cSpaceUrlParams::class);
cPageOutput::write_JS_class_constant_IDs(cAppUrlParams::class);

//write out the title
if (cCommon::is_string_empty(cAppGlobals::$title))
    cAppGlobals::$title = "MISSING TITLE";
$title = "";
if (cDebug::is_localhost()) $title = "DEVELOPMENT -";
$title .= strip_tags(cAppGlobals::$title);
$title .= " - " . cAppConfig::APP_NAME;
?>
<title><?= $title ?></TITLE>


<!-- common ckinc -->
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/common.js"></script>
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/render.js"></script>
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/debug.js"></script>
<script src="<?= cAppGlobals::$jsExtra ?>/bean/bean.js"></script>

<!-- jquery -->
<script src="<?= cAppGlobals::$jsExtra ?>/jquery/jquery-3.7.1.min.js"></script>
<script src="<?= cAppGlobals::$jsExtra ?>/jquery-ui/1.14/jquery-ui.js"></script>
<script src="<?= cAppGlobals::$jsExtra ?>/jquery-inview/jquery.inview.min.js"></script>
<script src="<?= cAppGlobals::$jsExtra ?>/jquery-visible/jquery.visible.min.js"></script>
<script src="<?= cAppGlobals::$jsExtra ?>/jquery-spinner/g-spinner.min.js"></script>
<script src="<?= cAppGlobals::$jsExtra ?>/jquery-cookie/jquery.cookie.js"></script>
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/jquery/jquery.common.js"></script>

<!-- everything else -->
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/http.js"></script>
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/httpqueue.js"></script>
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/auth.js"></script>
<script src="<?= cAppGlobals::$jsSpaceInc ?>/curiosity.js"></script>
<script src="<?= cAppGlobals::$jsSpaceInc ?>/space.js"></script>
<script src="<?= cAppGlobals::$jsSpaceInc ?>/tagging.js"></script>
<script src="<?= cAppGlobals::$jsSpaceInc ?>/imghilite.js"></script>

<!-- Facebook -->
<script src="<?= cAppGlobals::$jsInc ?>/ck-inc/facebook.js"></script>

<!-- app stuff -->
<script src="<?= cAppGlobals::$jsHome ?>/classes/curiosity.js"></script>
<script src="<?= cAppGlobals::$jsHome ?>/classes/app-common.js"></script>

<script>
    cFacebook.ServerSide = cAppLocations.rest + "/facebook.php";
    cFacebook.ServerUser = "<?= $sFBUser ?>";
    cFacebook.Version = "<?= cAppConfig::FB_VERSION ?>";
    cFacebook.AppID = <?= $oFBAppId->id ?>;
    bean.on(
        cFacebook,
        cFacebook.STATUS_EVENT,
        (psText) => $("#<?= cAppConfig::FB_ELEMENT_ID ?>").html(psText)
    );
</script>