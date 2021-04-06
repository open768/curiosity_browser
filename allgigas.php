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
	<title>All Gigapans - by Neville Thompson</title>
	<script src="js/widgets/allsolgigas.js"></script>
	<script src="js/pages/allgigas.js"></script>
</head>
<body onload="$(onLoadJQuery_GIGAS);">
	<?php 
		$sTitle = "All Gigapans - by Neville Thompson";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold">
		Behind each of these buttons are extraordinary gigapans published by enthusiast <a target="pencilnev" href="http://www.gigapan.com/profiles/pencilnev">Neville Thompson</a>.
		Neville also curates and moderates a number of facebook groups which discuss the topic of life on other worlds. Find Neville on <a href="https://uk.linkedin.com/in/neville-thompson-27a798b" target="pencilnev">LinkedIn</a>
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