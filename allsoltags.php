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
	<title>Sol Tags - Curiosity Browser</title>
	<script src="<?=$jsinc?>/ck-inc/secret.js"></script>
	<script src="js/pages/allsoltags.js"></script>
	<script src="<?=$jsinc?>/ck-inc/tagging.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
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