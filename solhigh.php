<?php	
	$root=realpath(".");
	$phpinc = realpath("../phpinc");
	$jsinc = "../jsinc";
	require_once "$phpinc/ckinc/session.php";
	cSession::set_folder();
	session_start();

	include("php/fragments/header.php"); 
	require_once("$phpinc/ckinc/facebook.php");
	cHeader::redirect_if_referred();
	if ( cFacebook_ServerSide::is_facebook()){
		cFacebookTags::make_fb_sol_high_tags();
		exit;
	}
?><html>
<head>
	<?php include("php/fragments/header.php"); ?>
	<title>Sol Highlights - Curiosity Browser </title>
	<script type="text/javascript" src="js/pages/solhigh.js"></script>
	<script type="text/javascript" src="<?=$jsinc?>/ck-inc/tagging.js"></script>
	<script type="text/javascript" src="<?=$jsinc?>/ck-inc/queue.js"></script>
	<script type="text/javascript" src="<?=$jsinc?>/ck-inc/actionqueue.js"></script>
</head>
<body onload="$(onLoadJQuery_SOLHI);">
	<?php 
		require_once "$phpinc/ckinc/secret.php";
		include("php/fragments/analytics.php");
		include("php/fragments/facebook.php");
		$sTitle = "Highlights for sol:<span id='sol'>??</span>";
		include("php/fragments/title.php");
	?>
	<div class="gold">
		<button class="homebutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton" onclick="onClickPrevious_sol()" title="previous sol">&lt;&lt;&lt;</button>
		<button class="roundbutton" onclick="onClickSol();">sol <span id="solbutton">???</span></button>
		<button class="leftbutton" onclick="cBrowser.openWindow('allsolhighs.php','allhighs');">All Sols</button>
		<button class="rightbutton" onclick="onClickNext_sol()" title="next sol">&gt;&gt;&gt;</button>

		&nbsp;&nbsp;&nbsp;
		<button class="leftbutton" id="detail" onClick="onClickDetails()">Details</button>
		<button class="leftbutton" id="sheet" onClick="onClickNoDetails()">No Details</button>
		<button class="leftbutton" id="mosaic" onClick="onClickMosaic()">Mosaic</button>
		&nbsp;&nbsp;&nbsp;
		<span class="subtitle">Status:</span> <span class="status" id="status">	loading...</span>
	</div>
	<div class="gold"  id="solhigh">
		Loading...
	</div>
	<P>
	
	<!-- *************** footer *********************** -->
	<?php 	include("php/fragments/github.php") 	?>
</body>
</html>