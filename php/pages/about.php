<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
cAppGlobals::$title = "About me";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
</head>

<body>
    <?php
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/common.js"></script>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme">
        <div class="w3-cell-row">
            <div class="w3-cell w3-padding-small">
                <img src="<?= cAppGlobals::$appImages ?>/browser/rover.png" height="120">
            </div>
            <div class="w3-cell w3-padding-large">
                <h1>About Curiosity Browser</h1>
                The curiosity browser makes MSL curiosity data more accessible to citizen scientists by providing sticky social features to tag,
                highlight and comment on images.
            </div>
            <div class="w3-cell w3-right">
                <img src="<?= cAppGlobals::$appImages ?>/browser/dude.png" height="120">
            </div>
        </div>
    </div>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme-l1">
        <h1>Your Personal Passport to Exploring Another World</h1>
        Ever wish you could hop onto a Mars rover and see the planet up close—no fancy degree required?
        Now you can! Our platform offers a fun, straightforward way to view real images from Mars (with more missions to come)
        and share what catches your eye. Best of all, space scientists might use your contributions when they plan future explorations.

        <P>
            <span class="material-symbols-outlined">label</span>
            <span class="intro_high">Tag What You See -</span>
            If something grabs your attention — like a strange shape or a curious patch of ground —
            add a tag so you can find it later or share it with others.
        </P>

        <P>
            <span class="material-symbols-outlined">featured_video</span>
            <span class="intro_high">Highlight the Interesting Bits -</span>
            Draw a box around the exact spot that amazes you. Think of it like pointing a flashlight at the cool parts of a photo.
        </P>

        <P>
            <span class="material-symbols-outlined">chat_bubble</span>
            <span class="intro_high">Comment and Chat -</span>
            Have a hunch about what you’re looking at or just want to say, <font face="tektur">“Wow, look at that!”</font>? Leave a comment and start a conversation.
        </P>

        <P>
            <span class="material-symbols-outlined">share</span>
            <span class="intro_high">Share or Keep It Private -</span>
            Invite friends and fellow space fans to check out your discoveries—or keep your thoughts just for yourself. It’s your choice.
        </P>

        <P>
            <span class="material-symbols-outlined">local_activity</span>
            <span class="intro_high">Explore What’s Popular -</span>
            Curious about everyone else’s favorites? See the most-tagged, highlighted, or talked-about images and dive into the latest buzz.

        </P>

        <P><span class="material-symbols-outlined">science</span>
            <span class="intro_high">Why It Matters -</span>
            All these tags, highlights, and comments aren’t just for fun—space scientists can look at what people find fascinating, then use those insights to help shape where rovers go next, what they study, and how missions are planned. By exploring with us, you’re helping pave the way for exciting new discoveries on Mars and beyond.
        </P>
    </div>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme-l2">
        <h2>Sources of information:</h2>
        <ul>
            <li>this is the <a href="https://www.mapbox.com/blog/tracking-mars-curiosity-rover/">article</a> that inspired me
            <li>this is where the browser began: <a href="http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json">http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json</a>
            <li>a cool map resource: <a href="http://curiosityrover.com/">http://curiosityrover.com/</a>
            <li>MSL notebook: <a href="https://an.rsl.wustl.edu/msl/mslbrowser">https://an.rsl.wustl.edu/msl/mslbrowser</a>
            <li>raw images: <a href="http://mars.nasa.gov/msl/multimedia/">http://mars.nasa.gov/msl/multimedia/</a>
            <li>PDS: <a href="http://pds-imaging.jpl.nasa.gov/volumes/msl.html">http://pds-imaging.jpl.nasa.gov/volumes/msl.html</a>
            <li>Software Interface Spec: <a href="http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0005/DOCUMENT/MSL_MMM_EDR_RDR_DPSIS.PDF">http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0005/DOCUMENT/MSL_MMM_EDR_RDR_DPSIS.PDF</a>
            <li>Curiosity Locations: <a href="http://mars.jpl.nasa.gov/msl-raw-images/locations.xml">http://mars.jpl.nasa.gov/msl-raw-images/locations.xml</a>
            <li>Where is Curiosity: <a href="http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/">http://mars.jpl.nasa.gov/msl/mission/whereistherovernow/</a>
            <li>Gigapans by Neville Thompson: <a href="http://www.gigapan.com/profiles/pencilnev">http://www.gigapan.com/profiles/pencilnev</a>
            <li>Mars taxonomy (USGS): <a href="http://planetarynames.wr.usgs.gov/GIS_Downloads">http://planetarynames.wr.usgs.gov/GIS_Downloads</a>
        </ul>
    </div>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme-l3">
        <h2>And thanks to </h2>
        <ul>
            <li><a href="https://twitter.com/hrwgc">Chris Herwig</a> - for inspiring me to write the curiosity browser.
            <li>Thomas C Stein - MSL notebook, Spice and being nice.
            <li>Joe Knapp - maps
            <li>Karen Boggs - for help with the PDS
            <li>Emily S Law (PDS operator)- for helping get the NASA curiosity json feed fixed.
            <li>Neville Thompson - for making amazing gigapans
            <li>NASA PDS operator - help with getting nasaview fixed.
            <li>Jennifer Buz - for help with informal names used by MSL
            <li><a href="http://www.chickenkatsu.co.uk/" target='sunil'>Sunil Vanmullem</a> - thats me folks - coder, owner, creator
        </ul>
        <p>
            <span class="subtitle">This web site is not affiliated with JPL or NASA.</span>
        <p>
    </div>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme-l4">

        <h2>tools and technologies used</h2>
        <ul>
            <li>PHP: http://php.net/
            <li>JQuery: http://jquery.org/
            <li>Sciedit: http://www.sceditor.com/
            <li>camanjs: http://camanjs.com/
            <li>bean: http://ender.no.de
            <li>inview: https://github.com/zuk/jquery.inview
            <li>jquery visible:https://github.com/customd/jquery-visible/
        </ul>
        <p>

        <h2>PDS data</h2>
        contains cached indexed data from PDS for mastcam volumes 1 to 5 (ie upto sol 443)
        <p>
    </div>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme-l5">

        <h2>Other Excellent sources of information about Curosity </h2>
        <ul>
            <li> NASA
                <ul>
                    <a href="https://science.nasa.gov/mission/msl-curiosity/" target="sources">NASA Curiosity mission page </a>
                    <li><a href="https://www.jpl.nasa.gov/missions/mars-science-laboratory-curiosity-rover-msl/" target="sources">JPL Curiosity site</a>
                    <li><a href="http://mars.jpl.nasa.gov/explore/learnaboutrover/" target="sources">JPL Explore Mars! learn about the rover</a>
                    <li><a href="https://eyes.nasa.gov/apps/mrn/#/mars" target="sources">3d visualisation of where Nasa rovers and spacecraft are</a>
                    <li><a href="https://science.nasa.gov/mars/resources/?types=mosaics" target="sources">NASA Mars Mosaics</a>
                    <li><a href="https://trek.nasa.gov/mars/" target="sources">Maps of Mars</a>
                    <li><a href="http://pds-geosciences.wustl.edu/missions/msl/chemcam.htm" target="sources">PDS chemcam catalogue</a>
                    <li><a href="http://www.msl-chemcam.com/" target="sources">MSL Chemcam results site</a>
                </ul>
            <li>Others
                <ul>
                    <li><a href="http://www.midnightplanets.com/" target="sources">Midnight Planets - an amazing 3D visualisation</a> by Midnight Martian (unfortunately on a hiatus)
                    <li><a href="http://www.nev-t-gigamacros.com/" target="sources">panoramas by Neville Thompson</a>
                        <!-- <li><a href="http://www.spaceflight101.com/msl-sam-science-reports.html" target="sources">MSL SAM instrument</a> -->
                    <li><a href="https://twitter.com/MarsCuriosity" target="sources">Curiosity Twitter feed</a>
                    <li><a href="http://www.nytimes.com/interactive/science/space/mars-curiosity-rover-tracker.html" target="sources">NY times curiosity tracker (upto sol 1065)</a>
                        <!-- not there anymore
                        <li><a href="http://curiosityrover.com/synth/">not quite an automatic panorama but not bad!</a>
                        <li><a href="http://curiosityrover.com/rems/">REMS instrument Temperature measurements</a>
                    -->
                    <li><a href="https://mslsci.com/joy/papers.html" target="sources">publications from an ex MSL project scientist</a>
                    <li><a href="http://www.unmannedspaceflight.com/index.php?showforum=59" target="sources"> planetary society forums for MSL</a>
                    <li><a href="http://en.wikipedia.org/wiki/Mars_Science_Laboratory" target="sources">Wikipedia</a>
                    <li><a href="https://en.wikipedia.org/wiki/List_of_rocks_on_Mars#2012_.E2.80.93_Curiosity_rover_.28Mars_Science_Laboratory.29" target="sources">Wikipedia List of rocks and areas</a>
                    <li><a href="http://www.reddit.com/r/curiosityrover" target="sources">Reddit feed</a>
                    <li><a href="https://marslife.org/" target="sources">marslife.org - Automatic Panoramas of Mars</a>
                </ul>
        </ul>
        <p>
    </div>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme-l6">

        <h2>Other Excellent sources of information about Mars</h2>
        <ul>
            <li><a href="http://redplanet.asu.edu/">The Red Planet Report</a>
            <li><a href="http://www.nasa.gov/socialmedia/#.U8jsjPldWAg">Engage with NASA on Social Media</a>
            <li><a href="http://saganet.org/events/talk-to-an-astrobiologist-dr-james-kasting">Saganet - talk to an astrobiologist</a>
            <li><a href="http://hirise.lpl.arizona.edu/">HiRISE - High Resolution Imaging Space Experiment</a>
            <li><a href="http://redplanet.asu.edu/">short summaries of published scientific literature on Mars, written so you can understand what they mean. If don’t have the time to plow through journals and papers to find new results, they’ll do it for you.</a>
            <li><a href="https://www.zooniverse.org/projects?discipline=astronomy">The Zooniverse is the world’s largest and most popular platform for people-powered research - including mars research</a>
        </ul>
        <p>
    </div>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large cookie">
        <b>An Appeal from the webmaster:</b> Have you got skills in PHP, Javascript or web design, or would love a project to help develop these skills?<br>
        We <b>desperately</b> need your help in developing this platform so it becomes the leading place to interact with space science images.<br>
        Please join us at <a href="https://github.com/open768/curiosity_browser">Github</a> or <a href="https://www.facebook.com/mars.features/">Facebook</a>.
    </div>


    <!-- ##################################################################### -->
    <?php
    include cAppGlobals::$appPhpFragments . "/disclaim.html"; ?>

    <!-- ##################################################################### -->
    <div class="w3-panel w3-card-2 w3-padding-large w3-theme-action">
        <h2>end of document</h2>
        now get back to work
    </div>

    <!-- footer -->
    <?php
    include cAppGlobals::$appPhpFragments . "/footer.php"     ?>
</body>

</html>