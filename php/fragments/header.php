<?php
	require_once "$phpinc/ckinc/secret.php";
	require_once "$phpinc/ckinc/header.php";
	require_once "$phpinc/ckinc/facebook.php";
	$jsExtra = "$jsinc/extra";
?>
<!-- meta tags -->
<meta property="fb:app_id" content="<?=cFacebook_ServerSide::getAppID()["I"]?>" />
<!-- common ckinc -->
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/debug.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/bean/bean.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/secret.js"></script>

<!-- analytics -->
<?php	
	include("$root/$jsinc/ck-inc/facebook.php");
	include("php/fragments/appd.php");
	//google analytics tag included by php/fragments/title.php
?>
<script type="text/javascript">
	cFacebook.statusID = "#username";
</script>

<!-- CSS -->
<link rel="icon" href="images/browser/dude.ico" type="image/x-icon" />
<LINK href="css/css.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="<?=$jsExtra?>/jquery-ui/jquery-ui.min.css">
<link rel="stylesheet" href="<?=$jsExtra?>/jquery-spinner/css/gspinner.min.css">


<!-- jquery -->
<script type="text/javascript" src="<?=$jsExtra?>/jquery/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-ui/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-inview/jquery.inview.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-visible/jquery.visible.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-spinner/g-spinner.min.js"></script>
<script type="text/javascript" src="<?=$jsExtra?>/jquery-cookie/jquery.cookie.js"></script>

<!-- everything else -->
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/common.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/http.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/httpqueue.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/auth.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/curiosity.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/space.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/tagging.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/imghilite.js"></script>

