<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>All Gigapans - by Neville Thompson</title>
    <script src="<?= cAppGlobals::$jsWidgets ?>/allgrid.js"></script>
    <script src="<?= cAppGlobals::$jsHome ?>/classes/solgrid.js"></script>
</head>

<body onload="$(onLoadJQuery_GIGAS);">
    <?php
    cAppGlobals::$title = "All Gigapans - by Neville Thompson";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <script>
        function onLoadJQuery_GIGAS() {
            $("#solgiga").allgrid({
                caption: "gigapan",
                mission: cMission,
                data_url: 'gigapans.php',
                sol_url: 'solgigas.php'
            })
        }
    </script>
    <div class="gold">
        Behind each of these buttons are extraordinary gigapans published by enthusiast <a target="pencilnev" href="http://www.gigapan.com/profiles/pencilnev">Neville Thompson</a>.
        Neville also curates and moderates a number of facebook groups which discuss the topic of life on other worlds. Find Neville on <a href="https://uk.linkedin.com/in/neville-thompson-27a798b" target="pencilnev">LinkedIn</a>
    </div>
    <div class="gold" id="solgiga">
        Loading...
    </div>
    <P>

        <!-- *************** footer *********************** -->
        <?php
        $sExtraCredits = "Data courtesy Neville Thompson http://www.gigapan.com/profiles/pencilnev";
        include cAppGlobals::$appPhpFragments . "/footer.php"
        ?>
</body>

</html>