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
	<title>Sol Tags - Curiosity Browser</title>
	<script src="<?=$jsinc?>/ck-inc/secret.js"></script>
	<script src="<?=$js?>/pages/allsoltags.js"></script>
	<script src="<?=$widgets?>/soltags.js"></script>
</head>
<body onload="$(onLoadJQuery_TAGS);">
	<?php 
		$sTitle = "Tagged Sols";
		include("$home/php/fragments/title.php");
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
		include("$home/php/fragments/github.php") 	
	?>
</body>
</html>