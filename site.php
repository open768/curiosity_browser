<html>
<head>
	<LINK href="css/css.css" rel="stylesheet" type="text/css">
	<title>Site - Curiosity Browser</title>
	<script src="js/inc/secret.js"></script>
	<script src="js/inc/common.js"></script>
	<script src="js/inc/auth.js"></script>
	<script src="js/pages/site.js"></script>
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
	<DIV class="title">Site <span id="siteid"></span></DIV>
<p>
	<div class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button onclick="cBrowser.openWindow('allsites.php','allsites');">All Sites</button>
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="site">
		Loading...
	</div>
	<div class="gold"  id="geplugin">
		<div id="map" style="height: 400px; width: 600px;"></div>
	</div>
	<P>
	
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