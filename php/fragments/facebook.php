<?php
	require_once("$phpinc/ckinc/header.php");
	$FBAPPID= (cHeader::is_localhost()?cSecret::FB_DEV_APP:cSecret::FB_APP);
?>

<script>
	cFacebook.AppID = "<?=$FBAPPID?>";
	window.fbAsyncInit = cFacebook.onFBBeforeInit;
	bean.on(cJQueryObj, "OnJqueryLoad", cFacebook.loadFacebook);
</script>
<div id='fb-root'></div>