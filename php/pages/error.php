<?php	
	$home = "../..";
	require_once "$home/php/app-common.php";
	include("$AppPhpFragments/doctype.txt");  ?>
<html>
<head>
	<?php 
		include("$AppPhpFragments/header.php"); 
	?>
	<title>Error  </title>
</head>
<body>
	<?php 
		$sTitle = "Errrrrror";
		include("$AppPhpFragments/title.php");
	?>
	<script src="<?=$jsinc?>/ck-inc/common.js"></script>
	<div class="gold" >
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<p>
		<table border="0" width="100%"><tr>
			<td valign=middle>
				<img src="<?=$home?>/images/browser/rover.png" height="120">
			</td>
			<td>
				<font class="big_error">OOPS THERE WAS AN ERROR</font><P>
				Message was "<?=cHeader::get("m")?>"
			</td>
			<td align="right">
				<img src="<?=$home?>/images/browser/dude.png" height="120">
			</td>
		</tr></table>
	</div>

	<!-- footer -->
	<?php 	include("$AppPhpFragments/github.php") 	?>
</body>
</html>