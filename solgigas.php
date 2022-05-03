<?php	
	$home=".";
	require_once "$home/php/common.php";
?>
<html>
<head>
	<?php 
		include("php/fragments/header.php"); 
	?>
	<title>sol Gigapans - Curiosity Browser</title>
	<script src="js/pages/solgigas.js"></script>
	<script src="<?=$widgets?>/solgigas.js"></script>
</head>
<body onload="$(onLoadJQuery_SOLGIG);">
	<?php 
		$sTitle = "Gigapans for sol:<span id=\"sol\">??</span>";
		include("php/fragments/title.php");
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
		include("php/fragments/github.php") 	
	?>
</body>
</html>