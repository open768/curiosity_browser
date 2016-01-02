<?php	
	$root=realpath(".");
	$phpinc = realpath("../phpinc");
	$jsinc = "../jsinc";
	require_once "$phpinc/ckinc/session.php";
	cSession::set_folder();
	session_start();
?>
<html>
<head>
	<?php 
		include("php/fragments/header.php"); 
	?>
	<title>All Sites - Curiosity Browser</title>
	<script src="js/pages/allsites.js"></script>
	<script src="<?=$jsinc?>/ck-inc/googleearth.js"></script>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script type="text/javascript">
		google.load("earth", "1");
	</script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Sites";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<font class="subtitle">Site:</font> <span id="sites"> loading...</span>
		<font class="subtitle">HiRise:</font><span id="hirise"> loading...</span>
		
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span> 	
	</div>
	<div class="gold">
		<span id="map"></span>
	</div>
	<P>
	
	<?php include("php/fragments/github.php") ?>
</body>
</html>