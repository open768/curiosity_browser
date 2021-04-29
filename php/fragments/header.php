<?php
	require_once "$phpinc/ckinc/secret.php";
	require_once "$phpinc/ckinc/header.php";
?>
<!-- meta tags -->
<meta property="fb:app_id" content="<?=(cHeader::is_localhost()?cSecret::FB_DEV_APP:cSecret::FB_APP)?>" />

<!-- common ckinc -->
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/debug.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/bean/bean.js"></script>
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
<link rel="stylesheet" href="<?=$jsinc?>/jquery-ui/jquery-ui.min.css">
<link rel="stylesheet" href="<?=$jsinc?>/jquery-spinner/css/gspinner.min.css">


<!-- jquery -->
<script type="text/javascript" src="<?=$jsinc?>/jquery/jquery-3.2.1.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-ui/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-inview/jquery.inview.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-visible/jquery.visible.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-spinner/g-spinner.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-cookie/jquery.cookie.js"></script>

<!-- everything else -->
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/common.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/http.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/httpqueue.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/auth.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/curiosity.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/space.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/tagging.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/space/imghilite.js"></script>

