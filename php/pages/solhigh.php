<?php	
	$home="../..";
	require_once "$home/php/app-common.php";

	include("$home/php/fragments/header.php"); 
	require_once("$phpinc/ckinc/facebook.php");
	cHeader::redirect_if_referred();
	if ( cFacebook_ServerSide::is_facebook()){
		cFacebookTags::make_fb_sol_high_tags();
		exit;
	}
?>
<?php 	include("$home/php/fragments/doctype.txt");  ?>
<html>
<head>
	<?php include("$home/php/fragments/header.php"); ?>
	<title>Sol Highlights - Curiosity Browser </title>
	<script type="text/javascript" src="<?=$js?>/pages/solhighs.js"></script>
	<script type="text/javascript" src="<?=$widgets?>/solhighlights.js"></script>
</head>
<body onload="$( ()=>cSolHighs.onLoadJQuery() );">
	<?php 
		$sTitle = "Highlights for sol:<span id='sol'>??</span>";
		include("$home/php/fragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton" onclick="cSolHighs.onClickPrevious_sol()" title="previous sol">&lt;&lt;&lt;</button>
		<button class="roundbutton" onclick="cSolHighs.onClickSol();">sol <span id="solbutton">???</span></button>
		<button class="leftbutton" onclick="cBrowser.openWindow('allsolhighs.php','allhighs');">All Sols</button>
		<button class="rightbutton" onclick="cSolHighs.onClickNext_sol()" title="next sol">&gt;&gt;&gt;</button>

		&nbsp;&nbsp;&nbsp;
		<input id="chkMosaic" type="checkbox">Mosaic
		&nbsp;&nbsp;&nbsp;
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="solhigh">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	include("$home/php/fragments/github.php") 	?>
</body>
</html>