<?php	
	$home="../..";
	require_once "$home/php/app-common.php";
?>
<?php 	include("$home/php/fragments/doctype.txt");  ?>
<html>
<head>
	<?php 
		include("$home/php/fragments/header.php"); 
	?>
	<title>All Highlights - Curiosity Browser</title>
	<script src="<?=$AppJSWidgets?>/solhighgrid.js"></script>
	<script src="<?=$AppJS?>/pages/allsolhighs.js"></script>
</head>
<body onload="$(onLoadJQuery_HIGHS);">
	<?php 
		$sTitle = "Sols with Highlights";
		include("$home/php/fragments/title.php");
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
		include("$home/php/fragments/github.php") 	
	?>
</body>
</html>