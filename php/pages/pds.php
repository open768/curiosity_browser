<?php	
	$home="../..";
	require_once "$home/php/app-common.php";
?>
<?php 	include("$home/php/fragments/doctype.txt");  ?>
<html>
<head>
	<?php 
		include("$home/php/fragments/header.php"); 
	?>
	<title>PDS details - Curiosity Browser</title>
	<script src="<?=$AppJS?>/pages/pds.js"></script>
</head>
<body onload="$(onLoadJQuery_PDS);">
	<?php 
		$sTitle = "PDS details";
		include("$home/php/fragments/title.php");
	?>
	<DIV class="gold">
		<button class="leftbutton" onclick="cBrowser.openWindow('index.php','index')">Home</button>
		<button class="leftbutton" onclick="onClickDetail()">Back to Detail</button>
		<button class="leftbutton" id="EDR" title="jump to PDS EDR Label" onclick="onClickEDRLBL();">EDR LBL</button>
		<button class="leftbutton" title="MSL curiosity Notebook" id="notelink" onclick="onClickNotebook()">MSL NoteBook</button>
		<ul>
			<li>To understand PDS format  see: <a target="NASA" href="http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0002/DOCUMENT/MSL_MMM_EDR_RDR_DPSIS.PDF"
			>Software Interface Specification</a>
			<li>use  <a href="http://www.mmedia.is/bjj/utils/img2png/#download">IMG2PNG</a> to convert .IMG files into PNG format. (Do not use Nasaview on windows as you will spend weeks tearing your hair out only to realise that nasaview is itself worthless)
			<li>you will need <a target="NASA" href="http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0002/SOFTWARE/SRC/">DAT2IMG</a> 
			to extract IMG files from the DAT files. <a href="https://drive.google.com/file/d/0B0mcRo6MJ9NhSjlJWUIxLTVLWTg/edit?usp=sharing">[Download for windows7]</a>
			<li>on MSWindows you might like to use bash from cygwin to run dat2zip.
			<li>the characters after the "_" such as XXXX and DRCX etc are processing codes. 
				<ul>
				<li>
				D=Decompressed,
				R=Radiometrically calibrated, 
				C=Color corrected or contrast stretched,
				L=Linearized,
				X=Fill character
				<li>The EDR is always named XXXX as it is the unprocessed original from the spacecraft. 
				<li>the RDR will contain processed files eg DRCL, DRCX,DRLX, DRXX 
			</ul>
		</ul>
	</div>
	<DIV class="gold">
		<span class="subtitle">Status:</span> <span ID="status" class="status">Loading...</span>
	</div>
	<DIV class="gold">
		<IFRAME id="PDS_FRAME" width="100%" height="500">
			lOADING pds DATA...
		</IFRAME>
	</div>
	<DIV class="gold" ID="PDS_Images">
			lOAdING pds Images...
	</div>
	<!-- footer -->
	<?php include("$home/php/fragments/github.php") ?>
</body>
</html>