<?php	
	$home="../..";
	require_once "$home/php/common.php";
?>
<?php 	include("$home/php/fragments/doctype.txt");  ?>
<html>
<head>
	<?php 
		include("$home/php/fragments/header.php"); 
	?>
	<title>Tags: Curiosity Browser</title>
	<script type="text/javascript" src="<?=$js?>/pages/tag.js"></script>
	<script type="text/javascript" src="<?=$jsinc?>/ck-inc/queue.js"></script>
	<script type="text/javascript" src="<?=$jsinc?>/ck-inc/actionqueue.js"></script>
	<script type="text/javascript" src="<?=$widgets?>/tag-view.js"></script>
	<script type="text/javascript" src="<?=$widgets?>/image.js"></script>
	<script type="text/javascript" src="<?=$widgets?>/tagcloud.js"></script>
</head>
<body onload="$(onLoadJQuery_TAG);">
	<?php 
		$sTitle = "Instances of Tag <span id='tagname'>tag goes here</span>";
		include("$home/php/fragments/title.php");
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
	<?php 	include("$home/php/fragments/github.php") 	?>
</body>
</html>