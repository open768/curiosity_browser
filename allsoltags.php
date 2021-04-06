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
	<title>Sol Tags - Curiosity Browser</title>
	<script src="<?=$jsinc?>/ck-inc/secret.js"></script>
	<script src="js/pages/allsoltags.js"></script>
	<script src="js/widgets/soltags.js"></script>
</head>
<body onload="$(onLoadJQuery_TAGS);">
	<?php 
		$sTitle = "Tagged Sols";
		include("php/fragments/title.php");
	?>
	<DIV class="title">Tagged Sols</DIV>
<p>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="soltag">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	
		include("php/fragments/github.php") 	
	?>
</body>
</html>