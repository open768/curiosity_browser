<?php
$home = "../..";
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

require_once "$home/php/fragments/app-common.php";
include "$appPhpFragments/doctype.php";

//check for admin role to display admin button
$sUser = cAuth::get_user();
$sIsAdmin = "no";
if ($sUser && cAuth::is_role("admin")) $sIsAdmin = "yes";

//define PHP constants
class cIndexPageConsts
{
    const ID_PAYLOAD = "P";
    const ID_LEFT_COL = "LC";
    const ID_BODY = "B";
    const ID_SEARCH = "SR";
    const ID_CHKTHUMBS = "ct";
    const ID_IMAGE_CONTAINER = "ic";
    const ID_STATUS = "status";
    const ID_INTRO = "idintro";

    static $IS_ADMIN = "no";
}
cIndexPageConsts::$IS_ADMIN = $sIsAdmin;
?>
<html>

<head>
    <!-- header fragments -->
    <?php include("$appPhpFragments/header.php");  ?>

    <!-- main scripts -->
    <title>Curiosity Browser</title>
    <LINK href="<?= $home ?>/css/drag.css" rel="stylesheet" type="text/css">
    <LINK href="<?= $home ?>/css/tabs.css" rel="stylesheet" type="text/css">
    <script src="<?= $jsInc ?>/ck-inc/queue.js"></script>
    <script src="<?= $jsInc ?>/ck-inc/actionqueue.js"></script>
    <script src="<?= $AppJS ?>/pages/index.js"></script>
    <script src="<?= $AppJSWidgets ?>/thumbnail.js"></script>
    <script src="<?= $AppJSWidgets ?>/thumbnail-view.js"></script>
    <script src="<?= $AppJSWidgets ?>/image-view.js"></script>
    <script src="<?= $AppJSWidgets ?>/image.js"></script>
    <script src="<?= $AppJSWidgets ?>/solinstrchooser.js"></script>
    <script src="<?= $AppJSWidgets ?>/solbuttons.js"></script>
    <script src="<?= $AppJSWidgets ?>/tagcloud.js"></script>
    <!-- end of scripts -->

    <!-- meta properties for facebook -->
    <meta property="og:title" content="Curiosity Browser - ">
    <meta property="og:image" content="http://www.mars-browser.co.uk/curiosity/images/rover.png">
    <meta property="og:description" content="Be part of the greatest exploration team ever. Discover great finds in the amazing images from NASA's Curiosity Rover and share your discoveries with the world.">
</head>

<body onload="$( function(){ cIndexPage.onLoadJQuery()} );">
    <?php
    cPageOutput::write_JS_class_constant_IDs("cIndexPageConsts");
    ?>
    <?php
    $sTitle = "Home";
    include("$appPhpFragments/title.php");
    ?>

    <DIV id="<?= cIndexPageConsts::ID_PAYLOAD ?>" class="w3-cell-row">
        <!-- LEFT COLUMN OF PAGE -->
        <div id="<?= cIndexPageConsts::ID_LEFT_COL ?>" class="w3-cell">
            Loading ...
        </div>

        <!-- MAIN BODY OF PAGE -->
        <div id="<?= cIndexPageConsts::ID_BODY ?>" class="w3-cell">
            <!-- Search box -->
            <div class="gold" id="header-pane">
                <input type="text" id="<?= cIndexPageConsts::ID_SEARCH ?>" size="30"><button class="rightbutton" onclick="onClickSearch()" title="Search for Product">Search</button>
                <input id="<?= cIndexPageConsts::ID_CHKTHUMBS ?>" type="checkbox">Show Thumbnails&nbsp;&nbsp;&nbsp;&nbsp;
                <span class="subtitle"> Status: </span><span ID="<?= cIndexPageConsts::ID_STATUS ?>" class="status">Loading...</span>
            </div>

            <!-- will contain images when selected -->
            <div class="gold" id="<?= cIndexPageConsts::ID_IMAGE_CONTAINER ?>">
                <div id="<?= cIndexPageConsts::ID_INTRO ?>" style="display:none">
                    <H2>Curiosity Browser</H2>
                    <img src="<?= $appImages ?>/browser/dude.png" height="90" align="left">
                    Welcome to the best place to find great images beamed from Curiosity, NASA's Mars Science Lab on Mars.
                    <p>
                        You might find a fascinating geological formation, an intruiging rock, evidence of water flows, or something else.
                        You might even be the one who discovers the next great scientific discovery of Mars.
                    <p>
                        And then let everyone know about your discoveries by sharing what you find.
                    <p>
                        <b>To get started</b>
                    <ol>
                        <li>select a <span class="subtitle">SOL</span> from the left hand list, or type it in the box above. (SOL represents the number of Mars days that Curiosity has been on Mars.)</li>
                        <li>Then select from the <span class="subtitle">instruments</span> shown for that SOL to see the amazing images.</li>
                    </ol>
                </div>
                <p>&nbsp;
                <p>&nbsp;
                <p>&nbsp;
                <p>&nbsp;
                <p>&nbsp;
            </div>
        </div>
    </div>
    <!-- Footer -->
    <?php
    include "$appPhpFragments/disclaim.html";
    include "$appPhpFragments/footer.php";
    ?>
</body>

</html>