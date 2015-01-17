<html>
<head>
	<?php include("php/fragments/header.php"); ?>
	<title>PDS details - Curiosity Browser</title>
	<script src="js/pages/pds.js"></script>
</head>
<body onload="$(cJQueryObj.onBodyLoad);">
	<?php 
		$root=realpath(".");
		require_once "php/inc/secret.php";
		include("php/fragments/analytics.php") 
		include("php/fragments/facebook.php");
		$sTitle = "PDS details";
		include("php/fragments/title.php");
	?>
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
	<?php include("php/fragments/github.php") ?>
</body>
</html>