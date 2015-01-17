<html>
<head>
	<?php include("php/fragments/header.php"); ?>
	<title>Tags: Curiosity Browser</title>
	<script src="js/pages/tag.js"></script>
	<script src="js/inc/tagging.js"></script>
	<script src="js/inc/imghilite.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		$root=realpath(".");
		require_once "php/inc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Instances of Tag <span id='tagname'>tag goes here</span>";
		include("php/fragments/title.php");
	?>
	<table width="100%"><tr>
		<td class="leftcolumn" valign="top">
			<div class="gold" id="tags">Loading tags</div>
		</td>
		<td valign="top">
			<div class="gold">
				<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
				Status: <span class="status" id="status">	loading...</span>
			</div>
			<div class="gold" >
				This Tag was seen in the following:
				<p>
				<ul id="tagdata">
					<li><span class="subtitle">Loading Tag data</span>
				</ul>
			</div>
		</td>
	</tr></table>
	
	<P>
	<!-- footer -->
	<?php 	include("php/fragments/github.php") 	?>
</body>
</html>