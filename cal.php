<html>
<head>
	<?php include("php/fragments/header.php"); ?>
	<title>calendar - Curiosity Browser</title>
	<script src="js/pages/cal.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		$root=realpath(".");
		$phpinc = realpath("../phpinc");
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Curiosity calendar for SOL: <span id='sol'>???</span>";
		include("php/fragments/title.php");
	?>
	<DIV class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button title="force refresh cache" id="solrefresh" onclick="onClickRefresh()">Refresh Data</button>
		<button onclick="onClickPrevious()" title="previous Sol">&lt;&lt; Previous</button>
		Status: <span ID="status" class="status">Loading...</span>
		<button onclick="onClickNext()" title="Next Sol">Next &gt;&gt;</button>
	</div>
	<DIV class="gold" id="colours">
		loading colours
	</div>
	<DIV class="gold" ID="calendar">
		Calendar Loading
	</div>
	
	<!-- footer -->
	<?php 	
		include("php/fragments/github.php") 	
	?>
</body>
</html>