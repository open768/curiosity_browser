<?php	
	$home="../..";
	require_once "$home/php/fragments/app-common.php";
	include("$appPhpFragments/doctype.php");  ?>
<html>
<head>
	<?php 
		include("$appPhpFragments/header.php"); 
	?>
	<title>Tags: Curiosity Browser</title>
	<script src="<?=$AppJS?>/pages/tag.js"></script>
	<script src="<?=$jsInc?>/ck-inc/queue.js"></script>
	<script src="<?=$jsInc?>/ck-inc/actionqueue.js"></script>
	<script src="<?=$AppJSWidgets?>/tag-view.js"></script>
	<script src="<?=$AppJSWidgets?>/image.js"></script>
	<script src="<?=$AppJSWidgets?>/tagcloud.js"></script>
</head>
<body onload="$(onLoadJQuery_TAG);">
	<?php 
		$sTitle = "Instances of Tag <span id='tagname'>tag goes here</span>";
		include("$appPhpFragments/title.php");
	?>
	<table width="100%"><tr>
		<td class="leftcolumn" valign="top">
			<div class="gold" id="tagcloud">Loading tags</div>
		</td>
		<td valign="top">
			<div class="gold">
				<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
				Status: <span class="status" id="status">	initialising...</span>
			</div>
			<div class="gold" >
				This Tag was seen in the following:
				<p>
				<div id="tagdata">
					<span class="subtitle">initialising...</span>
				</div>
			</div>
		</td>
	</tr></table>
	
	<P>
	<!-- footer -->
	<?php 	include("$appPhpFragments/footer.php") 	?>
</body>
</html>