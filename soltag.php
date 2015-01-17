<html>
<head>
	<?php include("php/fragments/header.php"); ?>
	<title>sol Tags - Curiosity Browser</title>
	<script src="js/pages/soltag.js"></script>
	<script src="js/inc/tagging.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		$root=realpath(".");
		require_once "php/inc/secret.php";
		include("php/fragments/analytics.php"); 
		include("php/fragments/facebook.php");
		$sTitle = "Tags for sol:<span id='sol'>??</span>";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button onclick="cBrowser.openWindow('allsoltags.php','alltags');">All Sols</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="soltag">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	include("php/fragments/github.php") 	?>
</body>
</html>