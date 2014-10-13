<html>
<head>
	<LINK href="css/css.css" rel="stylesheet" type="text/css">
	<LINK href="css/drag.css" rel="stylesheet" type="text/css">
	<title>Tags: Curiosity Browser</title>
	<script src="js/inc/secret.js"></script>
	<script src="js/inc/common.js"></script>
	<script src="js/inc/auth.js"></script>
	<script src="js/pages/tag.js"></script>
	<script src="js/inc/tagging.js"></script>
	<script src="js/inc/imghilite.js"></script>
	
	<script src="js/jquery/jquery.js"></script>
	<script src="js/jquery/jquery-ui.js"></script>
	<script src="js/inc/analytics.js"></script>
	<script src="js/inc/facebook.js"></script>
</head>
<body onload="$(onLoadJQuery);">
	<DIV class="title">Instances of Tag "<span id="tagname">tag goes here</span>"</DIV>
<p>

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
	<p class="credits">
		Data courtesy MSSS/MSL/NASA/JPL-Caltech.<br>
	</p>
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