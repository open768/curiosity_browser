<html>
<head>
	<LINK href="css/css.css" rel="stylesheet" type="text/css">
	<LINK href="css/drag.css" rel="stylesheet" type="text/css">
	<link href="css/jquery/jquery-ui.css" rel="stylesheet" >
	<link href="css/jsssor/jsssor.css" rel="stylesheet" >
	<title>Curiosity Browser</title>
	<script type="text/javascript" src="js/inc/secret.js"></script>
	<script type="text/javascript" src="js/inc/common.js"></script>
	<script type="text/javascript" src="js/inc/auth.js"></script>
	<script type="text/javascript" src="js/pages/index.js"></script>
	<script type="text/javascript" src="js/inc/tagging.js"></script>
	<script type="text/javascript" src="js/inc/imghilite.js"></script>
	<script type="text/javascript" src="js/jquery/jquery.js"></script>
	<script type="text/javascript" src="js/jquery/jquery-ui.js"></script>
	<script type="text/javascript" src="js/inc/facebook.js"></script>
    <script type="text/javascript" src="js/jssor/jssor.core.js"></script>
    <script type="text/javascript" src="js/jssor/jssor.utils.js"></script>
    <script type="text/javascript" src="js/jssor/jssor.slider.mini.js"></script>
	
</head>
<body onload="$(onloadJQuery);">
	<?php 
		require_once "php/inc/secret.php";
		include_once("analytics-fragment.php") 
	?>
	<font class="title">Curiosity Browser</font>
	<p>
	
	<table width="100%"><tr>
		<td class="leftcolumn" valign="top">
			<div id="tabs">
				<ul>
					<li><a href="#tabs-1" class="subtitle">Sol</a></li>
					<li><a href="#tabs-2" class="subtitle">Tags</a></li>
					<li><a href="#tabs-3" class="subtitle">All</a></li>
			   </ul>
				<div class="gold" id="tabs-1">
					<div class="subtitle">Sol: <span id="this_sol">???</span></div>
					<nobr><select id="sol_summary"></select>
					<SELECT id="sol_list">
						<option>Loading...
					</SELECT>
					</nobr>
					<table border="0" width="100%"><tr>
						<td align="left"><button class="solnav" title="previous Sol ([)" type="button" onclick="onClickPreviousSol();">&lt;--</button></td>
						<td align="right"><button class="solnav" title="next Sol (])" type="button" onclick="onClickNextSol();">--&gt;</button></td>
					
					</tr></table>
					<!-- ************************************** -->
					<div class="subtitle">Instruments:</div>
					<select name="instruments" id="instruments">
						<option>Choose a SOL...</option>
					</select>
					<div class="subtitle" id="instr_load"><i>loading...</i></div>
					<!-- ************************************** -->
					<div class="subtitle">Sol Information:</div>				
					<button title="Tags for selected Sol" id="soltag" onclick="onClickSolTag();">Tags</button>
					<button title="Highlights for selected Sol" id="solhigh" onclick="onClickSolHighs();">Highlights</button>
					<button title="Gigapans for selected Sol" id="solgiga" onclick="onClickSolGiga();">Gigapans</button>
					<button title="MSL curiosity notebook" id="solnotebook" onclick="onClickMslNotebook();">MSL Notebook</button>
					<button title="MSL curiosity notebook MAP" id="solmap" onclick="onClickMslNotebookMap();">Map</button>
					<button title="Calendar" id="solcalendar" onclick="onClickCalendar()">Calendar</button>
					<button title="force refresh cache" id="solrefresh" onclick="onClickRefresh()">Refresh Data</button>
					<button title="thumbnails for instrument sol" id="solthumbs" onclick="onClickSolThumbs()">Thumbnails</button>
					<button title="All thumbnails for sol" id="allsolthumbs" onclick="onClickAllSolThumbs()">All Thumbnails</button>
					<button title="site details for sol" id="solsite" onclick="onClickSolSite()">Site</button>
				</div>
				<div class="gold" id="tabs-2">
					<div id="tags">Loading...</div>
				</div>
				<div class="gold" id="tabs-3">
					<button onclick="cBrowser.openWindow('allsoltags.php','alltags');">All Tags</button>
					<button onclick="cBrowser.openWindow('allsolhighs.php','allhighs');">All Highlights</button>
					<button onclick="cBrowser.openWindow('allgigas.php','allgigas');">All Gigapans</button>
					<button onclick="cBrowser.openWindow('allsites.php','allsites');">All Sites</button>
					<button title="Where is curiosity now?" onclick="window.open('http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/', 'whereami');">Where is Curiosity</button>
				</div>
			</div>
		</td>
		<td valign="top">
			<div class="gold">
				<button onclick="cBrowser.openWindow('about.php', 'about');">About </button>
				<input type="textbox" id="search_text" maxlength="30" size="30"><button onclick="onClickSearch()" title="Search for Product">Search</button>
				<input id="chkThumbs" type="checkbox">Show Thumbnails
				&nbsp;&nbsp;&nbsp;&nbsp;
				<span class="subtitle"> Status: </span><span ID="status" class="status">Loading...</span>
			</div>
			<div class="gold">
				<span id="nav1">
					<button class="pagenav" id="previous" title="Previous page (p)" onclick="onClickPreviousImage();">&lt;</button>
					<span ID="current">??</span>
					<button class="pagenav" id="next" title="Next page (n)" onclick="onClickNextImage();">&gt;</button>
					max <span ID="max">??</span>
				</span>
			</div>
			<div class="gold" id="images">
			<div class="gold" id="thumbs">
				select a sol and instrument to display thumbnails
			</div>
				This browser works best with <a href="http://ie.microsoft.com">Internet Explorer 11</a> or <a href="http://chrome.google.com">Google Chrome</a>
				<H2>Lets Get Started</H2>
				Welcome to the Curiosity Browser, the place to have a 2-way social interaction about the great images being beamed back to Earth from NASA's Curiosity Rover. 
				<p>
				To get started 
				<ul>
				<li>select a <span class="subtitle">SOL</span> from the left hand list, or type it in the box above. (SOL represents the number of days that  Curiosity had been or Mars.) 
				<li>Next  select from the <span class="subtitle">instruments</span> shown for that SOL to see the amazing images.
				<li>Or Click <span class="subtitle">All</span> to see which sols are interesting
				</ul>
				<p>
				The next steps are up to you - browse the great images and you too might discover and  <span class="subtitle">tag</span> or <span class="subtitle">highlight</span> it so that anyone else can see what you are seeing. You might find a fascinating golological rock, an intruiging rock, evidence of water flows. In fact you might be the one who discovers the next great scientific discovery of Mars. Imagine that, your name up there in lights in the the halls of Science as being the one who discovered it. Go on.. its over to you then :-) 
				<p>
				<h2>Dislaimer</h2>
				<span class="subtitle">This web site is not affiliated with JPL or NASA.</span>
			</div>
			<div class="gold" id="nav2">
				<button class="pagenav" title="Previous page (p)" onclick="onClickPreviousImage();">&lt;</button>
				<span ID="current2">??</span>
				<button class="pagenav" title="Next page (n)" onclick="onClickNextImage();">&gt;</button>
				max <span ID="max2">??</span><br><br>
			</div>
		</td>
	</tr></table>
	
	<!-- footer -->
	<p class="credits">Data courtesy MSSS/MSL/NASA/JPL-Caltech.</p>
	<div class="github">
		<table border="0" width="100%"><tr>
			<td width="50"><a href="http://www.chickenkatsu.co.uk" target="chicken"><img src="images/chicken_icon.png"></a></td>
			<td>
				We're on <img src="images/github_logo.png"> <a href="https://github.com/open768/curiosity_browser">https://github.com/open768/curiosity_browser</a>
				<div class="fb-like" data-href="https://www.facebook.com/mars.features" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
			</td>
		</tr></table>
	</div>
</body>
</html>