<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
(cAppGlobals::$appPhpFragments . "/doctype.php");
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>All Highlights - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$jsWidgets ?>/allgrid.js"></script>
    <script src="<?= cAppGlobals::$jsHome ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_HIGHS);">
    <?php
    cAppGlobals::$title = "Sols with Highlights";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <script>
        function onLoadJQuery_HIGHS() {
            $("#solhighs").allgrid({
                caption: "highlight",
                mission: cMission,
                data_url: 'img_highlight.php',
                sol_url: 'solhigh.php'
            })
        }
    </script>
    <div class="gold" id="solhighs">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        include cAppGlobals::$appPhpFragments . "/footer.php"
        ?>
</body>

</html>