<?php
	require '../inc/secret.php';
	

	$sRedirect = urlencode("http://www.mars-browser.co.uk/curiosityb/php/test/callback.php");
	
	header("Location: https://www.facebook.com/dialog/oauth?client_id=".cSecret::FB_APP."&redirect_uri=$sRedirect");
?>