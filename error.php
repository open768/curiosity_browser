<?php	
	$home = ".";
	require_once "$home/php/common.php";
?>
<html>
<head>
	<?php 
		include("php/fragments/header.php"); 
	?>
	<title>Error  </title>
</head>
<body>
	<?php 
		$sTitle = "Errrrrror";
		include("php/fragments/title.php");
	?>
	<script src="<?=$jsinc?>/ck-inc/common.js"></script>
	<div class="gold" >
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<p>
		<table border="0" width="100%"><tr>
			<td valign=middle>
				<img src="images/browser/rover.png" height="120">
			</td>
			<td>
				<font class="big_error">OOPS THERE WAS AN ERROR</font><P>
				Message was "<?=cHeader::get("m")?>"
			</td>
			<td align="right">
				<img src="images/browser/dude.png" height="120">
			</td>
		</tr></table>
	</div>

	<!-- footer -->
	<?php 	include("php/fragments/github.php") 	?>
</body>
</html>