<?php	
	$home = "../..";
	require_once "$home/php/app-common.php";
 	include("$AppPhpFragments/doctype.php");  ?>
<html>
<head>
	<?php 
		include("$AppPhpFragments/header.php"); 
	?>
	<title>All Sites - Curiosity Browser</title>
	<script src="<?=$AppJS?>/pages/allsites.js"></script>
	<script src="<?=$jsInc?>/ck-inc/googleearth.js"></script>
	<script src="https://www.google.com/jsapi"></script>
	<script>
		google.load("earth", "1");
	</script>
</head>
<body onload="$(onLoadJQuery_SITES);">
	<?php 
		$sTitle = "Sites";
		include("$AppPhpFragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<font class="subtitle">Site:</font> <span id="sites"> loading...</span>
		<font class="subtitle">HiRise:</font><span id="hirise"> loading...</span>
		
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span> 	
	</div>
	<div class="gold">
		<span id="map">This page used the google earth plugin which is no longer supported by google</span>
	</div>
	<P>
	
	<?php include("$AppPhpFragments/github.php") ?>
</body>
</html>