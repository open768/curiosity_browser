<?php
$home = "../..";
$sTitle = "All Comments";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>All Comments - Curiosity Browser</title>
    <script src="<?= $AppJSWidgets ?>/allcomments.js"></script>
    <script src="<?= $AppJS ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_Comments);">
    <?php
    include("$appPhpFragments/title.php");
    ?>
    <script>
        function onLoadJQuery_Comments() {
            $("#solcomments").solcommentgrid({
                mission: cMission,
            })
        }
    </script>
    <div class="w3-panel" id="solcomments">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        include("$appPhpFragments/footer.php")
        ?>
</body>

</html>