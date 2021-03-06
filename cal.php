<?php	
	$root=realpath(".");
	$jsinc = "../jsinc";
	require_once "$root/php/common.php";
?>
<html>
<head>
	<?php 
		include("php/fragments/header.php"); 
	?>
	<title>calendar - Curiosity Browser</title>
	<script src="js/pages/cal.js"></script>
	<script src="js/widgets/solcal.js"></script>
</head>
<body onload="$(onLoadJQuery_CAL);">
	<?php 
		$sTitle = "Curiosity calendar for SOL: <span id='sol'>???</span>";
		include("php/fragments/title.php");
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
		include("php/fragments/github.php") 	
	?>
</body>
</html>