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
	<title>All Highlights - Curiosity Browser</title>
	<script src="<?=$jsinc?>/ck-inc/secret.js"></script>
	<script src="js/widgets/solhighgrid.js"></script>
	<script src="js/pages/allsolhighs.js"></script>
</head>
<body onload="$(onLoadJQuery_HIGHS);">
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Sols with Highlights";
		include("php/fragments/title.php");
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
		include("php/fragments/github.php") 	
	?>
</body>
</html>