<?php	
	$home="../..";
	require_once "$home/php/app-common.php";
	include("$appPhpFragments/doctype.php");  ?>
<html>
<head>
	<?php 
		include("$appPhpFragments/header.php"); 
	?>
	<title>calendar - Curiosity Browser</title>
	<script src="<?=$AppJS?>/pages/cal.js"></script>
	<script src="<?=$AppJSWidgets?>/solcal.js"></script>
</head>
<body onload="$( ()=>cAppCal.onLoadJQuery() )">
	<?php 
		$sTitle = "Curiosity calendar for SOL: <span id='sol'>???</span>";
		include("$appPhpFragments/title.php");
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
		include("$appPhpFragments/footer.php") 	
	?>
</body>
</html>