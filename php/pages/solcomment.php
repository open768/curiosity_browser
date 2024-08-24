<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
?>

<head>
    <?php include("$appPhpFragments/header.php"); ?>
    <title>Sol comments - Curiosity Browser </title>
    <script src="<?= $AppJS ?>/pages/solcomments.js"></script>
</head>

<body onload="$( ()=>cSolComments.onLoadJQuery() );">
    <?php
    $sTitle = "Comments for sol:<span id='sol'>??</span>";
    include("$appPhpFragments/title.php");
    ?>
    <div class="w3-container w3-theme-l1" id="buttons">loading.. </div>
    <div class="w3-container" id="comments">loading.. </div>

    <!-- *************** footer *********************** -->
    <?php include("$appPhpFragments/footer.php")     ?>
</body>

</html>