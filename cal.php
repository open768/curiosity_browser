<html>
<head>
	<LINK href="css/css.css" rel="stylesheet" type="text/css">
	<title>calendar - Curiosity Browser</title>
	<script src="js/inc/secret.js"></script>
	<script src="js/inc/auth.js"></script>
	<script src="js/pages/cal.js"></script>
	<script src="js/inc/common.js"></script>
	<script src="js/jquery/jquery.js"></script>
	<script src="js/jquery/jquery-ui.js"></script>
	<script src="js/inc/analytics.js"></script>
	<script src="js/inc/facebook.js"></script>
</head>
<body onload="$(onLoadJQuery);">
	<DIV class="title">Curiosity calendar for SOL: <span id="sol">???</span></DIV>

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
	<p class="credits">Data courtesy MSSS/MSL/NASA/JPL-Caltech.</p>
	<div class="github">
		<table border="0" width="100%"><tr>
			<td width="50"><a href="http://www.chickenkatsu.co.uk" target="chicken"><img src="images/chicken_icon.png"></a></td>
			<td>
				We're on <img src="images/github_logo.png"> <a href="https://github.com/open768/curiosity_browser">https://github.com/open768/curiosity_browser</a>
				<p>
				<div class="fb-like" data-href="https://www.facebook.com/mars.features" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
			</td>
		</tr></table>
	</div>
</body>
</html>