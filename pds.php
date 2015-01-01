<html>
<head>
	<LINK href="css/css.css" rel="stylesheet" type="text/css">
	<LINK href="css/drag.css" rel="stylesheet" type="text/css">
	<title>PDS details - Curiosity Browser</title>
	<script src="js/inc/secret.js"></script>
	<script src="js/pages/pds.js"></script>
	<script src="js/inc/common.js"></script>
	<script src="js/jquery/jquery.js"></script>
	<script src="js/jquery/jquery-ui.js"></script>
	<script src="js/inc/facebook.js"></script>
</head>
<body onload="$(onLoadJQuery);">
	<?php 
		require_once "php/inc/secret.php";
		include_once("analytics-fragment.php") 
	?>
	<DIV class="title">Curiosity PDS Detail</DIV>

	<DIV class="gold">
		<button onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button onclick="onClickDetail()">Back to Detail</button>
		<button id="EDR" title="jump to PDS EDR" onclick="onClickEDRLBL();">EDR LBL</button>
		<button id="EDR" title="jump to PDS EDR" onclick="onClickEDRDAT();">EDR DAT</button>
		<button id="RDR" title="jump to PDS RDR" onclick="onClickRDRLBL();">RDR LBL</button>
		<button id="RDR" title="jump to PDS RDR" onclick="onClickRDRIMG();">RDR IMG</button>
		<button title="MSL curiosity Notebook" id="notelink" onclick="onClickNotebook()">MSL NoteBook</button>
		<button id="ParsePDS" title="parse product PDS" onclick="onClickParsePDS();">Debug - Parse PDS</button><br>
		<ul>
			<li>To understand PDS format  see: <a target="NASA" href="http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0002/DOCUMENT/MSL_MMM_EDR_RDR_DPSIS.PDF"
			>Software Interface Specification</a>
			<li>use  <a href="http://www.mmedia.is/bjj/utils/img2png/#download">IMG2PNG</a> to convert .IMG files into PNG format. (Do not use Nasaview on windows as you will spend weeks tearing your hair out only to realise that nasaview is itself worthless)
			<li>you will need <a target="NASA" href="http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0002/SOFTWARE/SRC/">DAT2IMG</a> 
			to extract IMG files from the DAT files. <a href="https://drive.google.com/file/d/0B0mcRo6MJ9NhSjlJWUIxLTVLWTg/edit?usp=sharing">[Download for windows7]</a>
			<li>on MSWindows you might like to use bash from cygwin to run dat2zip.
			<li>the XXXX and DRXXX and DRCX are processing codes. (see the SIS for details on what the letters mean)
			<ul>
			<li>The EDR is always named XXXX as it is the unprocessed original from the spacecraft. 
			<li>the RDR will contain processed files eg DRCL, DRCX,DRLX, DRXX 
			</ul>
		</ul>
	</div>
	<DIV class="gold">
		<span class="subtitle">Status:</span> <span ID="status" class="status">Loading...</span>
	</div>
	<DIV class="gold">
		<IFRAME id="PDS_FRAME" width=100% height=80%>
			lOADING pds DATA...
		</IFRAME>
	</div>
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