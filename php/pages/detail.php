<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";

require_once  cAppGlobals::$phpInc . "/ckinc/header.php";
require_once  cAppGlobals::$spaceInc . "/curiosity/facebook.php";
cHeader::redirect_if_referred();
if (cFacebook_ServerSide::is_facebook()) {
    cFacebookTags::make_fb_detail_tags();
    exit;
}

//************************************************************
class cDetailPageConstants {
    const IMAGE_CONTAINER_ID = "icontain";
    const IMAGE_ID = "image";
    const TAGS_ID = "tags";
    const TAGS_CONTAINER_ID = "tcontain";
    const SOL_CONTROLS_ID = "solcontrols";
    const COMMENTS_ID = "comments";
    const COMMENTS_CONTAINER_ID = "commentContainer";
    const PAGE_CONTENTS_ID = "pagec";
    const CAL_ID = "solCal";
    const MSL_ID = "msl";
    const IMG_INDEX = "img_index";
}

include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php include cAppGlobals::$appPhpFragments . "/header.php"; ?>
    <LINK href="<?= $home ?>/css/drag.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<?= cAppGlobals::$jsExtra ?>/sceditor/minified/themes/default.min.css" type="text/css" media="all">
    <title>Detail: Curiosity Browser</title>
    <script src="<?= cAppGlobals::$jsSpaceInc ?>/comments.js"></script>
    <script src="<?= cAppGlobals::$jsExtra ?>/sceditor/minified/jquery.sceditor.bbcode.min.js"></script>
    <script src="<?= cAppGlobals::$jsHome ?>/pages/detail.js"></script>
    <script src="<?= cAppGlobals::$jsWidgets ?>/comment-box.js"></script>
    <?php
    cPageOutput::write_JS_class_constant_IDs(cDetailPageConstants::class);
    ?>
</head>

<body onload="$( ()=>cDetail.onLoadJQuery() );">
    <?php
    cAppGlobals::$title = "Product Detail";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <DIV id="<?= cDetailPageConstants::PAGE_CONTENTS_ID ?>" class="w3-container w3-padding-small">
        <DIV>
            <!-- controls -->
            <DIV id="<?= cDetailPageConstants::SOL_CONTROLS_ID ?>" class="w3-container w3-theme-d3 w3-padding">Loading</DIV>
            <!-- tags -->
            <DIV id="<?= cDetailPageConstants::TAGS_CONTAINER_ID ?>">loading tags widget </DIV>
        </DIV>

        <!-- image container -->
        <DIV ID="<?= cDetailPageConstants::IMAGE_CONTAINER_ID ?>" class="w3-card">
            <table border="0" class="gold">
                <tr> <!-- top row -->
                    <td></td>
                    <td valign="bottom">
                        <nobr>
                            <button id="prev_prod_top" class="topnavbut leftbutton" title="previous in timeline (P)" style="width:100"><img src="<?= cAppGlobals::$appImages ?>/browser/back.png"></button><button title="previous (p)" id="prev_top" class="topnavbut leftbutton" style="width:300">&lt;</button><button title="next (n)" id="next_top" class="topnavbut rightbutton" style="width:300">&gt;</button> <button title="next product" id="next_prod_top" class="topnavbut rightbutton" title="next in timeline (N)" style="width:100"><img src="<?= cAppGlobals::$appImages ?>/browser/forward.png"></button>
                        </nobr>
                    </td>
                    <td></td>
                </tr>
                <tr> <!-- middle row -->
                    <td align="right">
                        <button title="previous (p)" class="roundbutton" id="prev_left" ;" style="height:600" class="lnavbut">&lt;</button>
                    </td>
                    <td align="middle">
                        <DIV id="container" class="container">
                            <DIV id="<?= cDetailPageConstants::IMAGE_ID ?>">Image Loading</div>
                            <DIV id="highlight"></div>
                        </div>
                        <!-- template div is not visible and doesnt have to be contained -->
                        <DIV id="box_template" class="redbox" style="display:none" highlight="true">
                            <DIV id="controls">
                                <button class="smallbutton" title="accept" id="tmpl_accept"><img src="<?= cAppGlobals::$appImages ?>/browser/bullet_tick.png"></button><button class="smallbutton" title="cancel" id="tmpl_cancel"><img src="<?= cAppGlobals::$appImages ?>/browser/bullet_cross.png"></button>
                            </div>
                            <DIV id="number" class="lucky8"></div>
                        </div>

                    </td>
                    <td align="left">
                        <button id="next_right" title="next (n)" class="roundbutton" style="height:600" class="rnavbut">&gt;</button>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td valign="top">
                        <button id="prev_prod_bottom" class="topnavbut leftbutton" title="previous in timeline (P)" style="width:100"><img src="<?= cAppGlobals::$appImages ?>/browser/back.png"></button><button title="previous (p)" id="prev_bottom" class="topnavbut leftbutton" style="width:300">&lt;</button><button title="next (n)" id="next_bottom" class="topnavbut rightbutton" style="width:300">&gt;</button><button title="next product" id="next_prod_bottom" class="topnavbut rightbutton" title="next in timeline (N)" style="width:100"><img src="<?= cAppGlobals::$appImages ?>/browser/forward.png"></button>
                    </td>
                    <td></td>
                </tr>
            </table>
        </div>
        <!-- end image container -->
        <p>
        <DIV id="<?= cDetailPageConstants::COMMENTS_CONTAINER_ID ?>"></div>

        <DIV class="w3-card w3-theme-l3 w3-margin" ">
            <header class=" w3-container w3-theme">MSL Data</header>
            <DIV class="w3-container" ID="<?= cDetailPageConstants::MSL_ID ?>">
                loading MSL data
            </div>
        </div>
    </div>

    <!-- footer -->
    <?php
    include cAppGlobals::$appPhpFragments . "/footer.php"
    ?>
</body>

</html>