<?php	
	$home="../..";
	require_once "$home/php/app-common.php";("$AppPhpFragments/doctype.php");  ?>
<html>
<head>
	<?php 
		include("$AppPhpFragments/header.php"); 
	?>
	<title>All Highlights - Curiosity Browser</title>
	<script src="<?=$AppJSWidgets?>/solhighgrid.js"></script>
	<script src="<?=$AppJS?>/pages/allsolhighs.js"></script>
	<script src="<?=$AppJS?>/classes/solgrid.js"></script>
</head>
<body onload="$(onLoadJQuery_HIGHS);">
	<?php 
		$sTitle = "Sols with Highlights";
		include("$AppPhpFragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="solhighs">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	
		include("$AppPhpFragments/github.php") 	
	?>
</body>
</html>