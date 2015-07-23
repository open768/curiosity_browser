<?php
	$root = realpath(".");
	$phpinc = realpath("../phpinc");
	
	require_once "$phpinc/ckinc/secret.php";
	require_once "$phpinc/ckinc/header.php";
	require_once "$phpinc/ckinc/auth.php";
	cHeader::start_session();	//must be done before writing any HTML
	$sUser = cAuth::get_user();
	$bIsAdmin = false;
	if ($sUser) $bIsAdmin = cAuth::is_role("admin");
?>
<html>
	<head>
		<?php 	include("php/fragments/header.php");  ?>
		
		<title>Curiosity Browser</title>
		<LINK href="css/drag.css" rel="stylesheet" type="text/css">
		<LINK href="css/tabs.css" rel="stylesheet" type="text/css">
		<script type="text/javascript" src="js/pages/index.js"></script>
		<script type="text/javascript" src="js/inc/tagging.js"></script>
		<script type="text/javascript" src="js/inc/imghilite.js"></script>
		<script type="text/javascript" src="js/inc/queue.js"></script>
		<script type="text/javascript" src="js/inc/imgqueue.js"></script>
		<script type="text/javascript" src="js/inc/tabs.js"></script>
		
		<meta property="og:title" content="Curiosity Browser - Interact with Science" />
		<meta property="og:image" content="http://www.mars-browser.co.uk/curiosity/images/rover.png" />
		<meta property="og:description" content="Be part of the greatest exploration team ever. Discover great finds in the amazing images from NASA's Curiosity Rover and share your discoveries with the world." />
	</head>
	<body onload="$(cJQueryObj.onBodyLoad);">
		<?php 
			include("php/fragments/analytics.php");
			include("php/fragments/facebook.php");
			$sTitle = "Home";
			include("php/fragments/title.php");
		?>
		
		<table id="payload" width="100%"><tr>
			<td id="left-column" class="leftcolumn" valign="top">
				<div id="tabs-container" >
					<ul class="tabs-menu">
						<li class="current"><a href="#sol-tab" >Sol</a></li>
						<li><a href="#tags-tab">Tags</a></li>
						<li><a href="#all-tab">All</a></li>
					</ul>
					<div class="tab">
						<div class="tab-content" id="sol-tab">
							<div class="subtitle">Sol: <span id="this_sol">???</span></div>
							<select id="sol_summary"></select>
							<SELECT id="sol_list">
								<option>Loading...</option>
							</SELECT>
							<table border="0" width="100%"><tr>
								<td align="left"><button id="solprev" class="solnav leftarrow" title="previous Sol ([)" onclick="onClickPreviousSol();"></button></td>
								<td align="middle"><button id="sollatest" class="roundbutton" title="Latest Sol" onclick="onClickLatestSol();">latest</button></td>
								<td align="right"><button id="solnext" class="solnav rightarrow" title="next Sol (])" onclick="onClickNextSol();"></button></td>
							</tr></table>
							<!-- ************************************** -->
							<div class="subtitle">Instruments:</div>
							<select name="instruments" id="instruments">
								<option>Choose a SOL...</option>
							</select>
							<div class="subtitle" id="instr_load"><i>loading...</i></div>
							<!-- ************************************** -->
							<div class="subtitle">Sol Information:</div>				
							<button title="Tags for selected Sol" class="leftbutton" id="soltag" onclick="onClickSolTag();">Tags</button>
							<button title="Highlights for selected Sol" class="leftbutton" id="solhigh" onclick="onClickSolHighs();">Highlights</button>
							<button title="Gigapans for selected Sol" class="leftbutton" id="solgiga" onclick="onClickSolGiga();">Gigapans</button>
							<button title="MSL curiosity notebook" class="leftbutton" id="solnotebook" onclick="onClickMslNotebook();">MSL Notebook</button>
							<button title="MSL curiosity notebook MAP" id="solmap" class="leftbutton" onclick="onClickMslNotebookMap();">Map</button>
							<button title="Calendar" id="solcalendar" class="leftbutton" onclick="onClickCalendar()">Calendar</button>
							<button title="force refresh cache" id="solrefresh" class="leftbutton" onclick="onClickRefresh()">Refresh Data</button>
							<button title="All thumbnails for sol" id="allsolthumbs" class="leftbutton" onclick="onClickAllSolThumbs()">All Thumbnails</button>
							<button title="site details for sol" id="solsite" class="leftbutton" onclick="onClickSolSite()">Site</button>
							<hr/>
							<div class="subtitle">Admin</div>				
							<?php if ($bIsAdmin){?>
								<button title="Admin Functions" id="admin" onclick="cBrowser.openWindow('admin/', 'admin');">Admin functions</button>
							<?php }else{ ?>
								not an Admin.
							<?php }?>
						</div>
						<div class="tab-content" id="tags-tab">
							<div id="tags">Loading...</div>
						</div>
						<div class="tab-content" id="all-tab">
							<button class="leftbutton" onclick="cBrowser.openWindow('allsoltags.php','alltags');">All Tags</button>
							<button class="leftbutton" onclick="cBrowser.openWindow('allsolhighs.php','allhighs');">All Highlights</button>
							<button class="leftbutton" onclick="cBrowser.openWindow('allgigas.php','allgigas');">All Gigapans</button>
							<button class="leftbutton" onclick="cBrowser.openWindow('allsites.php','allsites');">All Sites</button>
							<button class="leftbutton" title="Where is curiosity now?" onclick="window.open('http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/', 'whereami');">Where is Curiosity</button>
						</div>
					</div>
				</td>
				<td id="right-column" valign="top">
					<div class="gold" id="header-pane" >
						<button class="homebutton" onclick="cBrowser.openWindow('about.php', 'about');">About </button>
						<input type="textbox" id="search_text" maxlength="30" size="30"><button class="rightbutton" onclick="onClickSearch()" title="Search for Product">Search</button>
						<input id="chkThumbs" type="checkbox">Show Thumbnails
						&nbsp;&nbsp;&nbsp;&nbsp;
						<span class="subtitle"> Status: </span><span ID="status" class="status">Loading...</span>
					</div>
					<div class="gold" id="nav1" style="display:none">
						<button class="solnav leftarrow" id="previous" title="Previous page (p)" onclick="onClickPreviousImage();"></button>
						<span ID="current">??</span>
						<button class="solnav rightarrow" id="next" title="Next page (n)" onclick="onClickNextImage();"></button>
						max <span ID="max">??</span>
					</div>
					<div class="gold" id="images">
						<div id=intro>
							<H2>Lets Get Started</H2>
							<table border="0" width="100%"><tr>
								<td valign=middle>
									<img src="images/rover.png" height="90">
								</td>
								<td>
									Welcome to the Curiosity Browser, the place to have a 2-way social interaction about the great images being beamed back to Earth from NASA's Curiosity Rover. 
									<p/>
									My name is AISH and I'll be your guide on this site. I'm an Autonomous Artificial Intelligence Scientific Hologram that can be sent to any spacecraft. 
									I'm autonomous. That means that I can make my own decisions when I am out of contact with Earth. My Mission objectives are set by a scientist on Earth at a Ground Station.
									You can usually find me working on the Chemcam instrument in the Curiosity Rover. I'm the guy in the the round window.
								</td>
								<td align="right">
									<img src="images/dude.png" height="90">
								</td>
							</tr></table>
							<p/>
							To get started 
							<ul>
								<li>select a <span class="subtitle">SOL</span> from the left hand list, or type it in the box above. (SOL represents the number of days that  Curiosity had been or Mars.)</li>
								<li>Next  select from the <span class="subtitle">instruments</span> shown for that SOL to see the amazing images.</li>
								<li>Or Click <span class="subtitle">All</span> to see which sols are interesting</li>
							</ul>
							<p/>
							The next steps are up to you - browse the great images and you too might discover and  <span class="subtitle">tag</span> or <span class="subtitle">highlight</span> it so that anyone else can see what you are seeing. You might find a fascinating golological rock, an intruiging rock, evidence of water flows. In fact you might be the one who discovers the next great scientific discovery of Mars. Imagine that, your name up there in lights in the the halls of Science as being the one who discovered it. Go on.. its over to you then :-) 
							<p/>
						</div>
						<div class="cookie" id="cookies">
							We are using cookies to give you the best experience on our site. Cookies are files stored in your browser and are used by most websites to help personalise your web experience.
							By continuing to use our website without changing the settings, you are agreeing to our use of cookies.
						</div>
						<p/>
						<div class="cookie" id="disclaimer">
							<h2><a name="disclaim">Dislaimer</a></h2>
							<span class="subtitle">This web site is not affiliated with JPL or NASA.</span>
							<p/><font size=1>
								Chicken Katsu provides the www.mars-browser.co.uk as a service to the public and other website owners.
								
								Chicken Katsu is not responsible for, and expressly disclaims all liability for, damages of any kind arising out of use, reference to, or reliance on any 
								information contained within the site. While the information contained within the site is periodically updated, no guarantee is given that the information provided in this website is correct, complete, and up-to-date.
								
								Although www.mars-browser.co.uk may publish links providing direct access to other Internet resources, including websites, Chicken Katsu, 
								as the owner and operator of www.mars-browser.co.uk is not responsible for the accuracy or content of information contained in these sites.
								
								Links from www.mars-browser.co.uk to third-party sites do not constitute an endorsement by Chicken Katsu of the parties or their products and services. The appearance on the website of 
								advertisements and product or service information does not constitute an endorsement by Chicken Katsu, and Chicken Katsu has not investigated the claims made by any advertiser. 
								Product information is based solely on material received from suppliers.			
							</font>
						</div>
					</div>
					<div class="gold" id="nav2" style="display:none">
						<button class="solnav leftarrow" title="Previous page (p)" onclick="onClickPreviousImage();"></button>
						<span ID="current2">??</span>
						<button class="solnav rightarrow" title="Next page (n)" onclick="onClickNextImage();"></button>
						max <span ID="max2">??</span><br/><br/>
					</div>
				</td>
			</tr></table>
			
			<!-- footer -->
			<?php include("php/fragments/github.php") ?>
		</body>
	</html>																																					