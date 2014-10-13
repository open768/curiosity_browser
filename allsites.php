<html>
<head>
	<LINK href="css/css.css" rel="stylesheet" type="text/css">
	<title>All Sites - Curiosity Browser</title>
	<script src="js/inc/secret.js"></script>
	<script src="js/inc/common.js"></script>
	<script src="js/inc/auth.js"></script>
	<script src="js/pages/allsites.js"></script>
	<script src="js/jquery/jquery.js"></script>
	<script src="js/jquery/jquery-ui.js"></script>
	<script src="js/inc/analytics.js"></script>
	<script src="js/inc/facebook.js"></script>
	<script src="js/inc/googleearth.js"></script>
	<script type="text/javascript" src="https://www.google.com/jsapi"></script>
	<script type="text/javascript">
		google.load("earth", "1");
	</script>
</head>
<body onload="$(onLoadJQuery);">
	<div class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<font class="subtitle">Site:</font> <span id="sites"> loading...</span>
		<font class="subtitle">HiRise:</font><span id="hirise"> loading...</span>
		
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span> 	
	</div>
	<div class="gold">
		<span id="map"></span>
	</div>
	<P>
	
	<p class="credits">Data courtesy MSSS/MSL/NASA/JPL-Caltech.</p>
	<!-- *************** footer *********************** -->
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