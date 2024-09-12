<?php
$home = "../..";
/*
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
*/

require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";

//define PHP constants
class cIndexPageConsts {
    const ID_LEFT_COL = "LC";
    const ID_BODY = "B";
    const ID_SEARCH = "SR";
    const ID_SEARCH_PANE = "SP";
    const ID_CHKTHUMBS = "ct";
    const ID_IMAGE_CONTAINER = "ic";
    const ID_INTRO = "idintro";
    const ID_INTRO_BODY = "idintrobody";
    const ID_INTRO_FOOTER = "idintrofoot";

    static $IS_ADMIN = "no";
}
cIndexPageConsts::$IS_ADMIN = cAuth::current_user_is_admin();
?>

<head>
    <!-- header fragments -->
    <?php include cAppGlobals::$appPhpFragments . "/header.php";  ?>

    <!-- main scripts -->
    <title>Curiosity Browser</title>
    <LINK href="<?= $home ?>/css/drag.css" rel="stylesheet" type="text/css">
    <LINK href="<?= $home ?>/css/tabs.css" rel="stylesheet" type="text/css">
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/queue.js"></script>
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/actionqueue.js"></script>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/index.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/thumbnail.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/thumbnail-view.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/image-view.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/image.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/solinstrchooser.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/solbuttons.js"></script>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/tagcloud.js"></script>
    <!-- end of scripts -->

    <!-- meta properties for facebook -->
    <meta property="og:title" content="Curiosity Browser - ">
    <meta property="og:image" content="http://www.mars-browser.co.uk/curiosity/images/rover.png">
    <meta property="og:description" content="Be part of the greatest exploration team ever. Discover great finds in the amazing images from NASA's Curiosity Rover and share your discoveries with the world.">
</head>

<body onload="$( function(){ cIndexPage.onLoadJQuery()} );">
    <?php
    cPageOutput::write_JS_class_constant_IDs(cIndexPageConsts::class);
    ?>
    <?php
    cAppGlobals::$title = "Home";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>

    <DIV id="payload" class="w3-cell-row">
        <!-- LEFT COLUMN OF PAGE -->
        <div id="<?= cIndexPageConsts::ID_LEFT_COL ?>" class="w3-cell">
            Loading ...
        </div>

        <!-- MAIN BODY OF PAGE -->
        <div id="<?= cIndexPageConsts::ID_BODY ?>" class="w3-cell w3-cell-top">
            <!-- Search box -->
            <div class="w3-card w3-theme-d2" id="<?= cIndexPageConsts::ID_SEARCH_PANE ?>">... </div>

            <!-- will contain images when selected -->
            <div class="w3-container" id="<?= cIndexPageConsts::ID_IMAGE_CONTAINER ?>">
                <div id="<?= cIndexPageConsts::ID_INTRO ?>" class="w3-card" style="display:none">
                    <header class="w3-container w3-theme-l1">
                        <h2>Curiosity Browser</h2>
                    </header>
                    <div class="w3-container w3-padding-large" style="height:800px" id="<?= cIndexPageConsts::ID_INTRO_BODY ?>">
                        <img src="<?= cAppGlobals::$appImages ?>/browser/dude.png" height="200" align="left" style="margin:20px">
                        <span>
                            <div class="intro_text">
                                Welcome to the best place to find great images beamed from Curiosity, NASA's Mars Science Lab on Mars.
                            </div>
                            <div class="intro_text">
                                You might find a fascinating geological formation, an intruiging rock, evidence of water flows, or something else.
                            </div>
                            <div class="intro_text">
                                You might even be the one who discovers the next great scientific discovery of Mars.
                            </div>
                            <div class="intro_text">
                                And then let everyone know about your discoveries by sharing what you find.
                            </div>
                            <div class="intro_text">
                                <b>To get started</b>
                                <ol>
                                    <li>select a <span class="subtitle">SOL</span> from the left hand list, or type it in the box above. (SOL represents the number of Mars days that Curiosity has been on Mars.)</li>
                                    <li>Then select from the <span class="subtitle">instruments</span> shown for that SOL to see the amazing images.</li>
                                </ol>
                            </div>
                            <div class="intro_text">
                                <a href="about.php" class="w3-theme-action w3-button"><span class="material-symbols-outlined">info</span> click here to find out more about this website</a>
                            </div>
                        </span>
                    </div>

                </div>
                <footer class="w3-container w3-theme-l3" style:"display:none" id="<?= cIndexPageConsts::ID_INTRO_FOOTER ?>">
                </footer>
            </div>
        </div>
    </div>
    </div>
    </div>
    <!-- Footer -->
    <?php
    include cAppGlobals::$appPhpFragments . "/disclaim.html";
    include cAppGlobals::$appPhpFragments . "/footer.php";
    ?>
</body>