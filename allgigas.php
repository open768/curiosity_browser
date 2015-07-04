<html>
<head>
	<?php 
		$root=realpath(".");
		$phpinc = realpath("../phpinc");
		include("php/fragments/header.php"); 
	?>
	<title>All Gigapans - Curiosity Browser</title>
	<script src="js/pages/allgigas.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "All Gigapans";
		include("php/fragments/title.php");
	?>
	<div class="gold">
			<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
	<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="solgiga">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 
		$sExtraCredits="Data courtesy Neville Thompson http://www.gigapan.com/profiles/pencilnev";
		include("php/fragments/github.php") 
	?>
</body>
</html>