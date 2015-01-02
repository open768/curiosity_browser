<?php
	require_once("php/inc/header.php");
	require_once("php/inc/facebook.php");
	cHeader::redirect_if_referred();
	if ( cFacebook::is_facebook()){
		cFacebook::make_fb_detail_tags();
		exit;
	}
?>
<html>
<head>
	<LINK href="./css/css.css" rel="stylesheet" type="text/css">
	<LINK href="./css/drag.css" rel="stylesheet" type="text/css">
	<LINK href="./css/jquery/jquery-ui.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="./js/sceditor/minified/themes/default.min.css" type="text/css" media="all" />
	<title>Detail: Curiosity Browser</title>
	<script src="js/inc/secret.js"></script>
	<script src="js/pixlr/pixlr.js"></script>
	<script src="js/pages/detail.js"></script>
	<script src="js/inc/auth.js"></script>
	<script src="js/inc/common.js"></script>
	<script src="js/inc/tagging.js"></script>
	<script src="js/inc/comments.js"></script>
	<script src="js/inc/imghilite.js"></script>
	<script src="js/jquery/jquery.js"></script>
	<script src="js/jquery/jquery-ui.js"></script>
	<script src="js/inc/facebook.js"></script>
	<script src="./js/sceditor/minified/jquery.sceditor.bbcode.min.js"></script>
</head>
<body onload="$(onLoadJQuery);">
	<?php 
		require_once "php/inc/secret.php";
		include_once("analytics-fragment.php") 
	?>
	<DIV class="title">Curiosity Detail</DIV>
	<DIV class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button id="sol" title="Choose Sol" onclick="onClickSol();">loading...</button>
		<button id="instrument" title="Choose Instrument" onclick="onClickInstr();">loading</button>
		<button id="date_utc" title="Show SOL Calendar" onclick="onClickCal();">loading...</button>
		<button title="Show thumbnails" onclick="onClickThumbnails();">Thumbnails</button>
		image <span id="img_index">??</span> of <span id="max_images">??</span>
		<button title="Map at curiositybrowser.com" id="maplink" onclick="onClickMap()">Map</button>
		<button title="Original Nasa image" id="nasalink" onclick="onClickNASA()">Original</button>
		<button title="MSL curiosity Raw images" id="mslrawlink" onclick="onClickMSLRaw()">MSL Raw Image</button>
		<button title="released PDS product" id="pds_product" onclick="onClickPDS()">PDS Product</button>
		<button title="Edit Image with Pixlr" id="pixlr" onclick="onClickPixlr()">Edit Image</button>
		<button title="Search related with google" id="google" onclick="onClickGoogle()">Google</button>

		<div class="ui-widget">
			<span class="subtitle">Tags:</span> 
			<span ID="tags">Loading...</span> 
			<input type="text" size="20" maxlength="20" id="tagtext"><button onclick="onClickAddTag();">Add</button>
		</div>
	</div>
	<DIV class="gold">
		<span class="subtitle">Status:</span> <span ID="status" class="status">Loading...</span>
	</div>
	<!-- image container -->
	<table border="0" class="gold">
		<tr>
			<td></td>
			<td valign="bottom">
				<nobr>
				<button title="previous product" id="ltimebut_top" class="topnavbut" title="previous in timeline" onclick="onClickPreviousTime();" style="width:100"><img src="images/back.png"></button
				><button title="previous" id="lbut_top" class="topnavbut" onclick="onClickPrevious();" style="width:300">&lt;</button
				><button title="next" id="rbut_top" class="topnavbut" onclick="onClickNext();" style="width:300">&gt;</button
				><button title="next product" id="rtimebut_top" class="topnavbut" title="next in timeline" onclick="onClickNextTime();" style="width:100"><img src="images/forward.png"></button>
				</nobr>
			</td>
			<td></td>
		</tr>
		<tr>
			<td align="right">
				<button title="previous" id="lbut" onclick="onClickPrevious();" style="height:600" class="lnavbut">&lt;</button>
			</td>
			<td align="middle">
				<div id="container" class="container">
					<div id="image">Image Loading</div>
					<div id="highlight"></div>
				</div>
				<!-- template div is not visible and doesnt have to be contained -->
				<div id="box_template" class="redbox" style="display:none" highlight="true">
					<div id="controls">
						<button class="smallbutton" title="accept" onclick="onClickBoxAccept();"><img src="images/bullet_tick.png"></button
						><button class="smallbutton" title="cancel" onclick="onClickBoxCancel();"><img src="images/bullet_cross.png"></button>
					</div>
					<div id="number" class="lucky8"></div>
				</div>
				
			</td>
			<td align="left">
				<button id="rbut" title="next" onclick="onClickNext();" style="height:600" class="rnavbut">&gt;</button>
			</td>
		</tr>
		<tr>
			<td></td>
			<td valign="top">
				<button title="previous product" id="ltimebut_bot" class="topnavbut" title="previous in timeline" onclick="onClickPreviousTime();" style="width:100"><img src="images/back.png"></button
				><button title="previous" id="lbut_bot" class="topnavbut" onclick="onClickPrevious();" style="width:300">&lt;</button
				><button title="next" id="rbut_bot" class="topnavbut" onclick="onClickNext();" style="width:300">&gt;</button
				><button title="next product" id="rtimebut_bot" class="topnavbut" title="next in timeline" onclick="onClickNextTime();" style="width:100"><img src="images/forward.png"></button>
			</td>
			<td></td>
		</tr>
	</table>
	<!-- end image container -->
	<p>
	<div class="gold" id="#commentContainer">
		<div ID="comments" class="comments">loading comments data...</div>
		<p>
		<textarea rows="5" cols="120" id="Commentsbox" placeholder="go on share your thoughts with everyone"></textarea>
		<button onclick="onClickComment()" title="submit comment">comment</button>
	</div>
	<div class="gold" ID="msldata">
		loading MSL data
	</div>
	<p>
	<h2>Product Page</h2>
	<iframe id="label" width="1000" height="500">Label Loading...</iframe>
	<P>
	<!-- footer -->
	<p class="credits">
		Data courtesy MSSS/MSL/NASA/JPL-Caltech.<br>
		link to curiosityrover.com courtesy of Joe Knapp
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