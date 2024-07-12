<?php	
	$home="../..";
	require_once "$home/php/app-common.php";
	include("$AppPhpFragments/doctype.php");  ?>
<html>
<head>
	<?php 
		include("$AppPhpFragments/header.php"); 
	?>
	<title>sol Gigapans - Curiosity Browser</title>
	<script src="<?=$AppJS?>/pages/solgigas.js"></script>
	<script src="<?=$AppJSWidgets?>/solgigas.js"></script>
</head>
<body onload="$(onLoadJQuery_SOLGIG);">
	<?php 
		$sTitle = "Gigapans for sol:<span id=\"sol\">??</span>";
		include("$AppPhpFragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton" onclick="cBrowser.openWindow('allgigas.php','allgigas');">All Gigapans</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="solgiga">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	
		$sExtraCredits="Gigapans courtesy Neville Thompson http://www.gigapan.com/profiles/pencilnev.";
		include("$AppPhpFragments/github.php") 	
	?>
</body>
</html>