<?php
	require_once "$phpinc/ckinc/header.php";
	require_once "$phpinc/ckinc/facebook.php";
?>
<!-- meta tags -->
<?php
	$oFBAppId = cFacebook_ServerSide::getAppID();
	$sFBUser = cFacebook_ServerSide::getSessionUser();
?>
<meta property="fb:app_id" content="<?=$oFBAppId->id?>" />

<!-- CSS -->
<link rel="icon" href="<?=$home?>/images/browser/dude.ico" type="image/x-icon" />
<LINK href="<?=$home?>/css/css.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?=$jsExtra?>/jquery-ui/jquery-ui.min.css">
<link rel="stylesheet" href="<?=$jsExtra?>/jquery-spinner/css/gspinner.min.css">

<!-- common ckinc -->
<script src="<?=$jsinc?>/ck-inc/common.js"></script>
<script src="<?=$jsinc?>/ck-inc/debug.js"></script>
<script src="<?=$jsExtra?>/bean/bean.js"></script>
<script src="<?=$home?>/js/secret.js"></script>

<!-- jquery -->
<script src="<?=$jsExtra?>/jquery/jquery-3.6.0.min.js"></script>
<script src="<?=$jsExtra?>/jquery-ui/jquery-ui.js"></script>
<script src="<?=$jsExtra?>/jquery-inview/jquery.inview.min.js"></script>
<script src="<?=$jsExtra?>/jquery-visible/jquery.visible.min.js"></script>
<script src="<?=$jsExtra?>/jquery-spinner/g-spinner.min.js"></script>
<script src="<?=$jsExtra?>/jquery-cookie/jquery.cookie.js"></script>

<!-- everything else -->
<script type="text/javascript">
	var cLocations = {
		home: "<?=$home?>",
		rest: "<?=$home?>/php/rest",
		jsextra: "<?=$jsExtra?>"
	};
</script>
<script src="<?=$jsinc?>/ck-inc/http.js"></script>
<script src="<?=$jsinc?>/ck-inc/httpqueue.js"></script>
<script src="<?=$jsinc?>/ck-inc/auth.js"></script>
<script src="<?=$jsinc?>/ck-inc/space/curiosity.js"></script>
<script src="<?=$jsinc?>/ck-inc/space/space.js"></script>
<script src="<?=$jsinc?>/ck-inc/space/tagging.js"></script>
<script src="<?=$jsinc?>/ck-inc/space/imghilite.js"></script>
<script src="<?=$jsinc?>/ck-inc/space/imghilite.js"></script>

<!-- Facebook -->
<script src="<?=$jsinc?>/ck-inc/facebook.js"></script>

<script type="text/javascript">
	cFacebook.statusID = "#username";
	cFacebook.ServerSide = "php/rest/facebook.php";
	cFacebook.ServerUser = "<?=$sFBUser?>";
	cFacebook.Version = "v11.0";
	cFacebook.AppID = <?=$oFBAppId->id?>;
</script>
