<?php	
	$home="../..";
	require_once "$home/php/app-common.php";
	
	require_once("$phpinc/ckinc/header.php");
	require_once("$spaceinc/curiosity/facebook.php");
	cHeader::redirect_if_referred();
	if ( cFacebook_ServerSide::is_facebook()){
		cFacebookTags::make_fb_detail_tags();
		exit;
	}
?>
<?php 	include("$home/php/fragments/doctype.txt");  ?>

<html>
<head>
	<?php include("$home/php/fragments/header.php"); ?>
	<LINK href="<?=$home?>/css/drag.css" rel="stylesheet" type="text/css">
	<link rel="stylesheet" href="<?=$jsExtra?>/sceditor/minified/themes/default.min.css" type="text/css" media="all" />
	<title>Detail: Curiosity Browser</title>
	<script src="<?=$jsExtra?>/pixlr/pixlr.js"></script>
	<script src="<?=$jsinc?>/ck-inc/comments.js"></script>
	<script src="<?=$jsExtra?>/sceditor/minified/jquery.sceditor.bbcode.min.js"></script>
	<script src="<?=$js?>/pages/detail.js"></script>
</head>
<body onload="$( ()=>cDetail.onLoadJQuery() );">
	<?php 
		$sTitle = "Product Detail";
		include("$home/php/fragments/title.php");
	?>
	<!-- TODO convert into a widget -->
	<DIV class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton" id="sol" 		title="Choose Sol">loading...</button>
		<button class="leftbutton" id="instrument" 	title="Choose Instrument" >loading</button>
		<button class="leftbutton" id="solCal" 	title="Show SOL Calendar" >loading...</button>
		<button class="leftbutton" id="showthumb"		title="Show thumbnails" >Thumbnails</button>
		<button class="leftbutton" id="highlights" 	title="Highlights">Highlights</button>
		image <span id="img_index">??</span> of <span id="max_images">??</span>
		<button class="leftbutton" id="maplink" 	title="Map at curiositybrowser.com" >Map</button>
		<button class="leftbutton" id="nasalink" 	title="Original Nasa image" >Original</button>
		<button class="leftbutton" id="mslrawlink"	title="MSL curiosity Raw images" >MSL Raw Image</button>
		<button class="leftbutton" id="pds_product" title="released PDS product" >PDS Product</button>
		<button class="leftbutton" id="pixlr" 		title="Edit Image with Pixlr" >Edit Image</button>
		<button class="leftbutton" id="google" 		title="Search related with google" >Google</button>

		<!-- add a tag -->
		<div class="ui-widget">
			<span class="subtitle">Tags:</span> 
			<span ID="tags">Loading...</span> 
			<input type="text" size="20" maxlength="20" id="tagtext"><button class="rightbutton" id="submittag">Add</button>
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
				<button title="previous product" id="prev_prod_top" class="topnavbut leftbutton" title="previous in timeline" style="width:100"><img src="<?=$home?>/images/browser/back.png"></button
				><button title="previous" id="prev_top" class="topnavbut leftbutton"  style="width:300">&lt;</button
				><button title="next" id="next_top" class="topnavbut rightbutton"  style="width:300">&gt;</button
				><button title="next product" id="next_prod_top" class="topnavbut rightbutton" title="next in timeline" style="width:100"><img src="<?=$home?>/images/browser/forward.png"></button>
				</nobr>
			</td>
			<td></td>
		</tr>
		<tr>
			<td align="right">
				<button title="previous" class="roundbutton" id="prev_left";" style="height:600" class="lnavbut">&lt;</button>
			</td>
			<td align="middle">
				<div id="container" class="container">
					<div id="image">Image Loading</div>
					<div id="highlight"></div>
				</div>
				<!-- template div is not visible and doesnt have to be contained -->
				<div id="box_template" class="redbox" style="display:none" highlight="true">
					<div id="controls">
						<button class="smallbutton" title="accept" id="tmpl_accept" ><img src="<?=$home?>/images/browser/bullet_tick.png"></button
						><button class="smallbutton" title="cancel" id="tmpl_cancel" ><img src="<?=$home?>/images/browser/bullet_cross.png"></button>
					</div>
					<div id="number" class="lucky8"></div>
				</div>
				
			</td>
			<td align="left">
				<button id="next_right" title="next" class="roundbutton" style="height:600" class="rnavbut">&gt;</button>
			</td>
		</tr>
		<tr>
			<td></td>
			<td valign="top">
				<button title="previous product" id="prev_prod_bottom" class="topnavbut leftbutton" title="previous in timeline" style="width:100"><img src="<?=$home?>/images/browser/back.png"></button
				><button title="previous" id="prev_bottom" class="topnavbut leftbutton"  style="width:300">&lt;</button
				><button title="next" id="next_bottom" class="topnavbut rightbutton" style="width:300">&gt;</button
				><button title="next product" id="next_prod_bottom" class="topnavbut rightbutton" title="next in timeline" style="width:100"><img src="<?=$home?>/images/browser/forward.png"></button>
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
		<button class="leftbutton" id="btnComment" id="submit_comment" title="submit comment">comment</button>
	</div>

	<div class="gold" ID="msldata">
		loading MSL data
	</div>
	<p>
	<!-- <h2>Product Page</h2>
	<iframe id="label" width="1000" height="500">Label Loading...</iframe>
	<P>
	-->
	
	<!-- footer -->
	<?php 	
		$sExtraCredits="link to curiosityrover.com courtesy of Joe Knapp";
		include("$home/php/fragments/github.php") 	
	?>
</body>
</html>