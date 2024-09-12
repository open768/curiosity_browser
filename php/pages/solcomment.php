<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
class cSolCommentPageConstants {
    const ID_BUTTONS = "scb";
    const ID_COMMENTS_CONTAINER = "scc";
    const ID_SOL = "scs";
}
?>

<head>
    <?php include("$appPhpFragments/header.php"); ?>
    <title>Sol comments - Curiosity Browser </title>
    <script src="<?= $jsSpaceInc ?>/comments.js"></script>
    <script src="<?= $AppJS ?>/pages/solcomments.js"></script>
    <script src="<?= $AppJSWidgets ?>/comment-box.js"></script>
</head>

<body onload="$( ()=>cSolComments.onLoadJQuery() );">
    <?php
    $sTitle = "Comments for sol:<span id='" . cSolCommentPageConstants::ID_SOL . "'>??</span>";
    include("$appPhpFragments/title.php");

    cPageOutput::write_JS_class_constant_IDs(cSolCommentPageConstants::class);
    ?>

    <div class="w3-container w3-theme-d2" id="<?= cSolCommentPageConstants::ID_BUTTONS ?>">loading.. </div>
    <div class="w3-container w3-theme-l4" id="<?= cSolCommentPageConstants::ID_COMMENTS_CONTAINER ?>">loading.. </div>

    <!-- *************** footer *********************** -->
    <?php include("$appPhpFragments/footer.php")     ?>
</body>

</html>