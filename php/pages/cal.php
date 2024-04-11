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
	<title>calendar - Curiosity Browser</title>
	<script src="<?=$js?>/pages/cal.js"></script>
	<script src="<?=$widgets?>/solcal.js"></script>
</head>
<body onload="$( ()=>cAppCal.onLoadJQuery() )">
	<?php 
		$sTitle = "Curiosity calendar for SOL: <span id='sol'>???</span>";
		include("$home/php/fragments/title.php");
	?>
	<DIV class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton"title="go to SOL" onclick="onClickGotoSol()">Sol <span id="gotoSOL">...</span></button>
		<button class="leftbutton"title="force refresh cache" id="solrefresh" onclick="onClickRefresh()">Refresh Data</button>
		<button class="leftbutton" onclick="onClickPrevious()" title="previous Sol">&lt;&lt; Previous</button>
		Status: <span ID="status" class="status">Loading...</span>
		<button class="rightbutton" onclick="onClickNext()" title="Next Sol">Next &gt;&gt;</button>
	</div>
	<DIV ID="calendar">Loading...</div>
	
	<!-- footer -->
	<?php 	
		include("$home/php/fragments/github.php") 	
	?>
</body>
</html>