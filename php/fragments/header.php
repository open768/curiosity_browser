<?php
	require_once "$phpinc/ckinc/secret.php";
	require_once "$phpinc/ckinc/header.php";
?>
<link rel="icon" href="images/browser/dude.ico" type="image/x-icon" />
<LINK href="css/css.css" rel="stylesheet" type="text/css">
<link rel="stylesheet" href="css/jquery/jquery-ui.css">
<link rel="stylesheet" href="<?=$jsinc?>/jquery-spinner/css/gspinner.min.css">
<script type="text/javascript" src="<?=$jsinc?>/jquery/jquery-3.0.0.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery/jquery-migrate-3.0.0.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery/jquery.cookie.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-ui/jquery-ui.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-inview/jquery.inview.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-visible/jquery.visible.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/jquery-spinner/g-spinner.min.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/bean/bean.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/secret.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/debug.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/common.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/http.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/httpqueue.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/auth.js"></script>
<script type="text/javascript" src="<?=$jsinc?>/ck-inc/facebook.php"></script>
<script type="text/javascript" src="js/common.js"></script>
<meta property="fb:app_id" content="<?=(cHeader::is_localhost()?cSecret::FB_DEV_APP:cSecret::FB_APP)?>" />