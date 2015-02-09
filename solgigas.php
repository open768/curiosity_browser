<html>
<head>
	<?php include("php/fragments/header.php"); ?>
	<title>sol Gigapans - Curiosity Browser</title>
	<script src="js/pages/solgigas.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		$root=realpath(".");
		$phpinc = realpath("../phpinc");
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Gigapans for sol:<span id=\"sol\">??</span>";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button onclick="cBrowser.openWindow('allgigas.php','allgigas');">All Gigapans</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="solgiga">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	
		$sExtraCredits="Gigapans courtesy Neville Thompson http://www.gigapan.com/profiles/pencilnev.";
		include("php/fragments/github.php") 	
	?>
</body>
</html>