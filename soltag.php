<?php	
	$root=realpath(".");
	$jsinc = "../jsinc";
	require_once "$root/php/common.php";
?>
<html>
<head>
	<?php 
		include("php/fragments/header.php"); 
	?>
	<title>sol Tags - Curiosity Browser</title>
	<script src="js/pages/soltag.js"></script>
</head>
<body onload="$(onLoadJQuery_SOLTAG);">
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php"); 
		include("php/fragments/facebook.php");
		$sTitle = "Tags for sol:<span id='sol'>??</span>";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton" onclick="cBrowser.openWindow('allsoltags.php','alltags');">All Sols</button>
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