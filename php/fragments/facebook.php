<?php
	require_once("$phpinc/ckinc/header.php");
	require_once("$phpinc/ckinc/facebook.php");
	$FBAPPID= (cHeader::is_localhost()?cSecret::FB_DEV_APP:cSecret::FB_APP);
	$FBSESSUSER=cFacebook::getSessionUser();
?>

<script>
	cFacebook.AppID = "<?=$FBAPPID?>";
	cFacebook.ServerUser="<?=$FBSESSUSER?>";
	window.fbAsyncInit = cFacebook.onFBBeforeInit;
	bean.on(cJQueryObj, "OnJqueryLoad", cFacebook.loadFacebook);
</script>
<div id='fb-root'></div>