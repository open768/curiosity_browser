<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include "$appPhpFragments/doctype.php";

//check for admin role to display admin button
$sUser = cAuth::get_user();
$bIsAdmin = false;
if ($sUser) $bIsAdmin = cAuth::is_role("admin");

//define PHP constants
class cIndexPageConsts
{
    const ID_IMAGE_CONTAINER = "images";
    const ID_CHKTHUMBS = "chkThumbs";
    const ID_STATUS = "status";
    const ID_TAB_TAG_CONTENT = "tab-content-tags";
    const ID_TAB_SOL_CONTENT = "tab-content-sol";
    const ID_WIDGET_SOLCHOOSER = "solInstChooser";
    const ID_WIDGET_SOLBUTTONS = "solButtons";
    const ID_WIDGET_ADMIN = "admin";
    const ID_SEARCH = "search_text";
    const ID_TAB_BAR = "tab-bar";
    const ID_INTRO = "intro";
    const ID_SOLTHUMBS = "solthumbs";
    const ID_LEFT_COL = "left-column";
    const ID_BODY = "main-body";
    const ID_PAYLOAD = "payload";
}
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

    <DIV id="<?= cIndexPageConsts::ID_PAYLOAD ?>" class="cell-row">
        <!-- LEFT COLUMN OF PAGE -->
        <div id=" <?= cIndexPageConsts::ID_LEFT_COL ?>" class="w3-cell leftcolumn">
            <!-- TABS -->
            <div id="tabs-container">
                <!-- TAB Buttons -->
                <div id="<?= cIndexPageConsts::ID_TAB_BAR ?>">
                    Loading...
                </div>
                <!-- TAB Content -->
                <div class="tab-content" id="<?= cIndexPageConsts::ID_TAB_SOL_CONTENT ?>">
                    <!-- ** SOL Chooser ************************************ -->
                    <div id="<?= cIndexPageConsts::ID_WIDGET_SOLCHOOSER ?>">loading chooser widget...</div>

                    <!-- ** SOL buttons ************************************** -->
                    <div id="<?= cIndexPageConsts::ID_WIDGET_SOLBUTTONS ?>">loading buttons widget...</div>

                    <!-- ** ADMIN content ********************************** -->
                    <div class="ui-widget" id="<?= cIndexPageConsts::ID_WIDGET_ADMIN ?>">
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

                <!-- TAB Content -->
                <div class="tab-content" id="<?= cIndexPageConsts::ID_TAB_TAG_CONTENT ?>">
                    Loading...
                </div>
                <!-- End of tabs -->
            </div>
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
                    <?php
                    include "$appPhpFragments/disclaim.html";
                    ?>
            </div>
        </div>
    </div>
    <!-- Footer -->
    <?php include("$appPhpFragments/footer.php") ?>
</body>

</html>