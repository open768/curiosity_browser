<?php	
	$home="../..";
	require_once "$home/php/app-common.php";
	include("$appPhpFragments/doctype.php");  ?>
<html>
<head>
	<?php 
		include("$appPhpFragments/header.php"); 
	?>
	<title>sol Tags - Curiosity Browser</title>
	<script src="<?=$AppJS?>/pages/soltag.js"></script>
</head>
<body onload="$(onLoadJQuery_SOLTAG);">
	<?php 
		$sTitle = "Tags for sol:<span id='sol'>??</span>";
		include("$appPhpFragments/title.php");
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
	<?php 	include("$appPhpFragments/footer.php") 	?>
</body>
</html>