<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";

require_once  "$phpInc/ckinc/header.php";
require_once  "$spaceInc/curiosity/facebook.php";
cHeader::redirect_if_referred();
if (cFacebook_ServerSide::is_facebook()) {
    cFacebookTags::make_fb_detail_tags();
    exit;
}
include("$appPhpFragments/doctype.php");

//************************************************************
class cDetailPageConstants {
    const IMAGE_CONTAINER_ID = "icontain";
    const IMAGE_ID = "image";
    const TAGS_ID = "tags";
    const CONTROLS_ID = "controls";
    const COMMENTS_ID = "comments";
    const PAGE_CONTENTS_ID = "pagec";
}

?>

<html>

<head>
    <?php include("$appPhpFragments/header.php"); ?>
    <LINK href="<?= $home ?>/css/drag.css" rel="stylesheet" type="text/css">
    <link rel="stylesheet" href="<?= $jsExtra ?>/sceditor/minified/themes/default.min.css" type="text/css" media="all">
    <title>Detail: Curiosity Browser</title>
    <script src="<?= $jsInc ?>/ck-inc/space/comments.js"></script>
    <script src="<?= $jsExtra ?>/sceditor/minified/jquery.sceditor.bbcode.min.js"></script>
    <script src="<?= $AppJS ?>/pages/detail.js"></script>
</head>

<body onload="$( ()=>cDetail.onLoadJQuery() );">
    <?php
    $sTitle = "Product Detail";
    include("$appPhpFragments/title.php");
    cPageOutput::write_JS_class_constant_IDs("cDetailPageConstants");
    ?>
    <div id="<?= cDetailPageConstants::PAGE_CONTENTS_ID ?>">
        <!-- controls -->
        <DIV id="<? cDetailPageConstants::CONTROLS_ID ?>" class="gold">
            <button class="leftbutton" id="sol" title="Choose Sol">loading...</button>
            <button class="leftbutton" id="instrument" title="Choose Instrument">loading</button>
            <button class="leftbutton" id="solCal" title="Show SOL Calendar">Calendar</button>
            <button class="leftbutton" id="showthumb" title="Show thumbnails">Thumbnails</button>
            <button class="leftbutton" id="highlights" title="Highlights">Highlights</button>
            image <span id="img_index">??</span> of <span id="max_images">??</span>
            <button class="leftbutton" id="maplink" title="Map at curiositybrowser.com">Map</button>
            <button class="leftbutton" id="nasalink" title="Original Nasa image">Original</button>
            <button class="leftbutton" id="mslrawlink" title="MSL curiosity Raw images">MSL Raw Image</button>
            <button class="leftbutton" id="pds_product" title="released PDS product">PDS Product</button>
            <button class="leftbutton" id="google" title="Search related with google">Google</button>

            <!-- add a tag -->
            <div class="ui-widget">
                <span class="subtitle">Tags:</span>
                <span ID="<?= cDetailPageConstants::TAGS_ID ?>">Loading...</span>
                <input type="text" size="20" maxlength="20" id="tagtext"><button class="rightbutton" id="submittag">Add</button>
            </div>
        </div>

        <!-- image container -->
        <div ID="<?= cDetailPageConstants::IMAGE_CONTAINER_ID ?>">
            <table border="0" class="gold">
                <tr>
                    <td></td>
                    <td valign="bottom">
                        <nobr>
                            <button id="prev_prod_top" class="topnavbut leftbutton" title="previous in timeline (P)" style="width:100"><img src="<?= $appImages ?>/browser/back.png"></button><button title="previous (p)" id="prev_top" class="topnavbut leftbutton" style="width:300">&lt;</button><button title="next (n)" id="next_top" class="topnavbut rightbutton" style="width:300">&gt;</button> <button title="next product" id="next_prod_top" class="topnavbut rightbutton" title="next in timeline (N)" style="width:100"><img src="<?= $appImages ?>/browser/forward.png"></button>
                        </nobr>
                    </td>
                    <td></td>
                </tr>
                <tr>
                    <td align="right">
                        <button title="previous (p)" class="roundbutton" id="prev_left" ;" style="height:600" class="lnavbut">&lt;</button>
                    </td>
                    <td align="middle">
                        <div id="container" class="container">
                            <div id="<?= cDetailPageConstants::IMAGE_ID ?>">Image Loading</div>
                            <div id="highlight"></div>
                        </div>
                        <!-- template div is not visible and doesnt have to be contained -->
                        <div id="box_template" class="redbox" style="display:none" highlight="true">
                            <div id="controls">
                                <button class="smallbutton" title="accept" id="tmpl_accept"><img src="<?= $appImages ?>/browser/bullet_tick.png"></button><button class="smallbutton" title="cancel" id="tmpl_cancel"><img src="<?= $appImages ?>/browser/bullet_cross.png"></button>
                            </div>
                            <div id="number" class="lucky8"></div>
                        </div>

                    </td>
                    <td align="left">
                        <button id="next_right" title="next (n)" class="roundbutton" style="height:600" class="rnavbut">&gt;</button>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td valign="top">
                        <button id="prev_prod_bottom" class="topnavbut leftbutton" title="previous in timeline (P)" style="width:100"><img src="<?= $appImages ?>/browser/back.png"></button><button title="previous (p)" id="prev_bottom" class="topnavbut leftbutton" style="width:300">&lt;</button><button title="next (n)" id="next_bottom" class="topnavbut rightbutton" style="width:300">&gt;</button><button title="next product" id="next_prod_bottom" class="topnavbut rightbutton" title="next in timeline (N)" style="width:100"><img src="<?= $appImages ?>/browser/forward.png"></button>
                    </td>
                    <td></td>
                </tr>
            </table>
        </div>
        <!-- end image container -->
        <p>
        <div class="gold" id="commentContainer">
            <div ID="<?= cDetailPageConstants::COMMENTS_ID ?>" class="comments">loading comments data...</div>
            <p>
                <textarea rows="5" cols="120" id="Commentsbox" placeholder="go on share your thoughts with everyone"></textarea>
                <button class="leftbutton" id="btnComment" id="submit_comment" title="submit comment">comment</button>
        </div>

        <div class="gold" ID="msldata">
            loading MSL data
        </div>
    </div>
    <p>
        <!-- footer -->
        <?php
        $sExtraCredits = "link to curiosityrover.com courtesy of Joe Knapp";
        include("$appPhpFragments/footer.php")
        ?>
</body>

</html>