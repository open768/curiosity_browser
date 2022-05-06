<?php
	require_once "$phpinc/ckinc/header.php";
	require_once "$phpinc/ckinc/facebook.php";
?>
<!-- meta tags -->
<meta property="fb:app_id" content="<?=cFacebook_ServerSide::getAppID()->id?>" />
<!-- common ckinc -->
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/debug.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/bean/bean.js"></script>
<script type="text/javascript" src="<?=$home?>/js/secret.js"></script>

<!-- analytics -->
<?php	
	include("$jsinc/ck-inc/facebook.php");
	//include("php/fragments/appd.php"); not using appdynamics
	//google analytics tag included by php/fragments/title.php
?>
<script type="text/javascript">
	cFacebook.statusID = "#username";
</script>

<!-- CSS -->
<link rel="icon" href="<?=$home?>/images/browser/dude.ico" type="image/x-icon" />
<LINK href="<?=$home?>/css/css.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?=$jsExtra?>/jquery-ui/jquery-ui.min.css">
<link rel="stylesheet" href="<?=$jsExtra?>/jquery-spinner/css/gspinner.min.css">


<!-- jquery -->
<script type="text/javascript" src="<?=$jsExtra?>/jquery/jquery-3.6.0.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-ui/jquery-ui.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-inview/jquery.inview.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-visible/jquery.visible.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-spinner/g-spinner.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-cookie/jquery.cookie.js"></script>

<!-- everything else -->
<script type="text/javascript">
	var cLocations = {
		home: "<?=$home?>",
		rest: "<?=$home?>/php/rest",
		jsextra: "<?=$jsExtra?>"
	};
</script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/common.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/http.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/httpqueue.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/auth.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/curiosity.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/space.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/tagging.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/imghilite.js"></script>

