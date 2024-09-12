<?php
$home = "../..";
cAppGlobals::$title = "All Comments";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>All Comments - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$jsWidgets ?>/allgrid.js"></script>
    <script src="<?= cAppGlobals::$jsHome ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_Comments);">
    <?php
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <script>
        function onLoadJQuery_Comments() {
            $("#solcomments").allgrid({
                caption: "comment",
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
    include cAppGlobals::$appPhpFragments . "/footer.php"
    ?>
</body>

</html>