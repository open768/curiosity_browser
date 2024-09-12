<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
cAppGlobals::$title = "Tagged Sols";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>Sol Tags - Curiosity Browser</title>
    <script src="<?= cAppGlobals::$AppJSWidgets ?>/allgrid.js"></script>
    <script src="<?= cAppGlobals::$AppJS ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_TAGS);">
    <script>
        function onLoadJQuery_TAGS() {
            $("#soltag").allgrid({
                caption: "tag",
                mission: cMission,
                data_url: 'tag.php',
                sol_url: 'soltag.php'
            })
        }
    </script>
    <?php
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <DIV class="title">Tagged Sols</DIV>
    <p>
    <div class="gold" id="soltag">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        include cAppGlobals::$appPhpFragments . "/footer.php"
        ?>
</body>

</html>