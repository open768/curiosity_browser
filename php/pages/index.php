<?php
$home = "../..";
require_once "$home/php/app-common.php";

$sUser = cAuth::get_user();
$bIsAdmin = false;
if ($sUser) $bIsAdmin = cAuth::is_role("admin");
?>
<!-- Doctype Fragment -->
<?php include("$home/php/fragments/doctype.txt");  ?>
<html>

<head>
        <!-- header fragments -->
        <?php include("$home/php/fragments/header.php");  ?>

        <!-- main scripts -->
        <title>Curiosity Browser</title>
        <LINK href="<?= $home ?>/css/drag.css" rel="stylesheet" type="text/css">
        <LINK href="<?= $home ?>/css/tabs.css" rel="stylesheet" type="text/css">
        <script type="text/javascript" src="<?= $jsinc ?>/ck-inc/queue.js"></script>
        <script type="text/javascript" src="<?= $jsinc ?>/ck-inc/actionqueue.js"></script>
        <script type="text/javascript" src="<?= $AppJS ?>/pages/index.js"></script>
        <script type="text/javascript" src="<?= $AppJSWidgets ?>/thumbnail.js"></script>
        <script type="text/javascript" src="<?= $AppJSWidgets ?>/thumbnail-view.js"></script>
        <script type="text/javascript" src="<?= $AppJSWidgets ?>/image-view.js"></script>
        <script type="text/javascript" src="<?= $AppJSWidgets ?>/image.js"></script>
        <script type="text/javascript" src="<?= $AppJSWidgets ?>/solinstrchooser.js"></script>
        <script type="text/javascript" src="<?= $AppJSWidgets ?>/solbuttons.js"></script>
        <script type="text/javascript" src="<?= $AppJSWidgets ?>/tagcloud.js"></script>
        <!-- end of scripts -->

        <meta property="og:title" content="Curiosity Browser - " />
        <meta property="og:image" content="http://www.mars-browser.co.uk/curiosity/images/rover.png" />
        <meta property="og:description" content="Be part of the greatest exploration team ever. Discover great finds in the amazing images from NASA's Curiosity Rover and share your discoveries with the world." />
</head>
<?php

class cIndexPageConsts{
    const ID_IMAGE_CONTAINER = "images";
    const ID_CHKTHUMBS = "chkThumbs";
    const ID_STATUS = "status";
    const ID_TAB_TAG_CONTENT = "tab-content-tags";
    const ID_TAB_SOL_CONTENT = "tab-content-sol";
    const ID_WIDGET_CHOOSER = "solInstChooser";
    const ID_WIDGET_SOLBUTTONS ="solButtons";
    const ID_WIDGET_ADMIN ="admin";
    const ID_SEARCH = "search_text";
    const ID_TAB_BAR = "tab-bar";
    const ID_INTRO = "intro";
    const ID_SOLTHUMBS = "solthumbs";
}
cPageOutput::write_JS_class_constant_IDs("cIndexPageConsts");

?>

<body onload="$( function(){ cIndexPage.onLoadJQuery()} );">
        <?php
        $sTitle = "Home";
        include("$home/php/fragments/title.php");
        ?>

        <table id="payload" width="100%">
                <tr>
                        <td id="left-column" class="leftcolumn" valign="top">
                                <!-- TABS -->
                                <div id="tabs-container">
                                        <div id="<?=cIndexPageConsts::ID_TAB_BAR?>" cclass="w3-bar">
                                                Loading...
                                        </div>
                                        <div class="tab-content" id="<?=cIndexPageConsts::ID_TAB_SOL_CONTENT?>">
                                                <div>
                                                        <!-- ************************************** -->
                                                        <div id="<?=cIndexPageConsts::ID_WIDGET_CHOOSER?>">loading chooser widget...</div>
                                                        <!-- ************************************** -->
                                                        <div id="<?=cIndexPageConsts::ID_WIDGET_SOLBUTTONS?>">loading buttons widget...</div>
                                                        <!-- ************************************** -->
                                                        <div class="ui-widget" id="<?=cIndexPageConsts::ID_WIDGET_ADMIN?>">
                                                                <div class="ui-widget-header">Admin</div>
                                                                <div class="ui-widget-body">
                                                                        <?php if ($bIsAdmin) { ?>
                                                                                <button title="Admin Functions" id="admin" onclick="cBrowser.openWindow('admin/', 'admin');">Admin functions</button>
                                                                        <?php } else { ?>
                                                                                not an Admin.
                                                                        <?php } ?>
                                                                </div>
                                                        </div>
                                                </div>
                                        </div>
                                        <div class="tab-content" id="<?=cIndexPageConsts::ID_TAB_TAG_CONTENT?>">
                                                Loading...
                                        </div>
                                        <!-- End of tabs -->
                                </div>
                        </td>
                        <td id="right-column" valign="top" style="min-width:600px">
                                <div class="gold" id="header-pane">
                                        <input type="textbox" id="<?=cIndexPageConsts::ID_SEARCH?>" maxlength="30" size="30"><button class="rightbutton" onclick="onClickSearch()" title="Search for Product">Search</button>
                                        <input id="<?=cIndexPageConsts::ID_CHKTHUMBS?>" type="checkbox">Show Thumbnails&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span class="subtitle"> Status: </span><span ID="<?=cIndexPageConsts::ID_STATUS?>" class="status">Loading...</span>
                                </div>
                                <div class="gold" id="<?=cIndexPageConsts::ID_IMAGE_CONTAINER?>">
                                        <div id="intro" style="display:none">
                                                <H2>Curiosity Browser</H2>
                                                <img src="<?= $home ?>/images/browser/dude.png" height="90" align="left">
                                                Welcome to the best place to find great images beamed from Curiosity, NASA's Mars Science Lab on Mars.
                                                <p>
                                                        You might find a fascinating geological formation, an intruiging rock, evidence of water flows, or something else.
                                                        You might even be the one who discovers the next great scientific discovery of Mars.
                                                <p>
                                                        And then let everyone know about your discoveries by sharing what you find.
                                                        <p />
                                                        <b>To get started</b>
                                                <ol>
                                                        <li>select a <span class="subtitle">SOL</span> from the left hand list, or type it in the box above. (SOL represents the number of Mars days that Curiosity has been on Mars.)</li>
                                                        <li>Then select from the <span class="subtitle">instruments</span> shown for that SOL to see the amazing images.</li>
                                                </ol>
                                        </div>
                                        <P>&nbsp;</P>
                                        <P>&nbsp;</P>
                                        <P>&nbsp;</P>
                                        <P>&nbsp;</P>
                                        <P>&nbsp;</P>
                                        <P>&nbsp;</P>
                                        <div class="cookie">
                                                <b>An Appeal from the webmaster:</b> Have you got skills in PHP, Javascript or web design, or would love a project to help develop these skills?<br>
                                                We <b>desperately</b> need your help in developing this platform so it becomes the leading place to interact with space science images.<br>
                                                Please join us at <a href="https://github.com/open768/curiosity_browser">Github</a> or <a href="https://www.facebook.com/mars.features/">Facebook</a>.
                                        </div>
                                        <p />
                                        <div class="cookie">
                                                We are using cookies to give you the best experience on our site. Cookies are files stored in your browser and are used by most websites to help personalise your web experience.
                                                By continuing to use our website without changing the settings, you are agreeing to our use of cookies.
                                        </div>
                                        <p />
                                        <div class="disclaim">
                                                <div class="subtitle">Dislaimer</div>
                                                <ul>
                                                        <li>Chicken Katsu is not responsible for, and expressly disclaims all liability for, damages of any kind arising out of use, reference to, or reliance on any
                                                                information contained within the site. While the information contained within the site is periodically updated, no guarantee is given that the information provided in this website is correct, complete, and up-to-date.
                                                        <li>Although www.mars-browser.co.uk may contain links providing direct access to other Internet resources, including websites, Chicken Katsu,
                                                                as the owner and operator of www.mars-browser.co.uk is not responsible for the accuracy or content of information contained in these sites.
                                                        <li><b>This web site is not affiliated with JPL or NASA.</b>
                                                </ul>
                                        </div>
                                </div>
                        </td>
                </tr>
        </table>

        <!-- footer -->
        <?php include("$home/php/fragments/github.php") ?>
</body>

</html>