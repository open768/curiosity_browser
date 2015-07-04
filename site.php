<html>
<head>
	<?php 
		$root=realpath(".");
		$phpinc = realpath("../phpinc");
		include("php/fragments/header.php"); 
	?>
	<title>Site - Curiosity Browser</title>
	<script src="js/pages/site.js"></script>
	<script src="js/inc/googleearth.js"></script>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script type="text/javascript">
		google.load("earth", "1");
	</script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php") 
		include("php/fragments/facebook.php");
		$sTitle = "Site <span id=\"siteid\"></span>";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button onclick="cBrowser.openWindow('allsites.php','allsites');">All Sites</button>
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
	<?php include("php/fragments/github.php") ?>
</body>
</html>