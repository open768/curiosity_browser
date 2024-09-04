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
    <script src="<?= $AppJSWidgets ?>/allgrid.js"></script>
    <script src="<?= $AppJS ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_Comments);">
    <?php
    include("$appPhpFragments/title.php");
    ?>
    <script>
        function onLoadJQuery_Comments() {
            $("#solcomments").allgrid({
                caption: "comments",
                mission: cMission,
                data_url: 'comments.php',
                sol_url: 'solcomment.php'
            })
        }
    </script>
    <div class="w3-panel" id="solcomments">
        Loading...
    </div>

    <!-- *************** footer *********************** -->
    <?php
    include("$appPhpFragments/footer.php")
    ?>
</body>

</html>