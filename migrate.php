<?php	
	$root=realpath(".");
	$phpinc = realpath("../phpinc");
	require_once "$phpinc/ckinc/session.php";
	cSession::set_folder();
	session_start();
?>
<html>
<head>
	<?php 
		include("php/fragments/header.php"); 
	?>
	<title>Migrate</title>
</head>
<body>
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Migrate";
		include("php/fragments/title.php");
	?>
	<script src="js/inc/common.js"></script>
	<div class="gold" >
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<p>
		<table border="0" width="100%"><tr>
			<td valign=middle>
				<img src="images/rover.png" height="120">
			</td>
			<td>
				<font class="big_error">Migrating</font><P>
				Sol: "<?=cHeader::get("s")?>"
				Instrument: "<?=cHeader::get("i")?>"
				Migrating From: "<?=cHeader::get("pfrom")?>"
				Migrating To: "<?=cHeader::get("pto")?>"
			</td>
			<td align="right">
				<img src="images/dude.png" height="120">
			</td>
		</tr></table>
	</div>

	<!-- footer -->
	<?php 	include("php/fragments/github.php") 	?>
</body>
</html>