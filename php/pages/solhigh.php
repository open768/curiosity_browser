<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
require_once  "$phpInc/ckinc/facebook.php";
cHeader::redirect_if_referred();
if (cFacebook_ServerSide::is_facebook()) {
    cFacebookTags::make_fb_sol_high_tags();
    exit;
}
include("$appPhpFragments/doctype.php");  ?>
<html>

<head>
    <?php include("$appPhpFragments/header.php"); ?>
    <title>Sol Highlights - Curiosity Browser </title>
    <script src="<?= $AppJS ?>/pages/solhighs.js"></script>
    <script src="<?= $AppJSWidgets ?>/solhighlights.js"></script>
</head>

<body onload="$( ()=>cSolHighs.onLoadJQuery() );">
    <?php
    $sTitle = "Highlights for sol:<span id='sol'>??</span>";
    include("$appPhpFragments/title.php");
    ?>
    <div class="gold">
        <button class="leftbutton" onclick="cSolHighs.onClickPrevious_sol()" title="previous sol">&lt;&lt;&lt;</button>
        <button class="roundbutton" onclick="cSolHighs.onClickSol();">sol <span id="solbutton">???</span></button>
        <button class="leftbutton" onclick="cBrowser.openWindow('allsolhighs.php','allhighs');">All Sols</button>
        <button class="rightbutton" onclick="cSolHighs.onClickNext_sol()" title="next sol">&gt;&gt;&gt;</button>

        &nbsp;&nbsp;&nbsp;
        <input id="chkMosaic" type="checkbox">Mosaic
    </div>
    <div class="gold" id="solhigh">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php include("$appPhpFragments/footer.php")     ?>
</body>

</html>