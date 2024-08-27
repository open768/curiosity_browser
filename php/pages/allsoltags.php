<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");
$sTitle = "Tagged Sols";
?>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>Sol Tags - Curiosity Browser</title>
    <script src="<?= $AppJSWidgets ?>/allgrid.js"></script>
    <script src="<?= $AppJS ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_TAGS);">
    <script>
        function onLoadJQuery_TAGS() {
            $("#soltag").allgrid({
                mission: cMission,
                data_url: 'tag.php',
                sol_url: 'soltag.php'
            })
        }
    </script>
    <?php
    include("$appPhpFragments/title.php");
    ?>
    <DIV class="title">Tagged Sols</DIV>
    <p>
    <div class="gold" id="soltag">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        include("$appPhpFragments/footer.php")
        ?>
</body>

</html>