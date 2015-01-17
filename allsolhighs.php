<html>
<head>
	<?php include("php/fragments/header.php"); ?>
	<title>All Highlights - Curiosity Browser</title>
	<script src="js/inc/secret.js"></script>
	<script src="js/pages/allsolhighs.js"></script>
	<script src="js/inc/tagging.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		$root=realpath(".");
		require_once "php/inc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Sols with Highlights";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="solhighs">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	
		include("php/fragments/github.php") 	
	?>
</body>
</html>