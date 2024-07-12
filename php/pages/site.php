<?php	
	$home="../..";
	require_once "$home/php/app-common.php";
	include("$AppPhpFragments/doctype.php");  ?>
<html>
<head>
	<?php 
		include("$AppPhpFragments/header.php"); 
	?>
	<title>Site - Curiosity Browser</title>
	<script src="<?=$AppJS?>/pages/site.js"></script>
	<script src="<?=$jsInc?>/ck-inc/googleearth.js"></script>
	<script src="https://www.google.com/jsapi"></script>
	<script>
		google.load("earth", "1");
	</script>
</head>
<body onload="$(onLoadJQuery_SITES);">
	<?php 
		$sTitle = "Site <span id=\"siteid\"></span>";
		include("$AppPhpFragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton" onclick="cBrowser.openWindow('allsites.php','allsites');">All Sites</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="site">
		Loading...
	</div>
	<div class="gold"  id="geplugin">
		<div id="map" style="height: 400px; width: 600px;"></div>
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php include("$AppPhpFragments/footer.php") ?>
</body>
</html>