<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>Migrate</title>
</head>

<body>
    <?php
    cAppGlobals::$title = "Migrate";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <script src="<?= cAppGlobals::$jsInc ?>/ck-inc/common.js"></script>
    <div class="gold">
        <table border="0" width="100%">
            <tr>
                <td valign=middle>
                    <img src="<?= cAppGlobals::$appImages ?>/browser/rover.png" height="120">
                </td>
                <td>
                    <font class="big_error">Migrating</font>
                    <div class="w3-panel w3-red w3-leftbar w3-border-yellow">
                        Sorry About this, those clever space agency people have moved data around. We're the ones who have to restore order to this data chaos.
                        Hang on a while, we're migrating our data and having regulation tea breaks... may be a while... a long while... days if not longer.... has been known to be weeks... actually to be honest months .. a lot of months.
                    </DIV>
                    Sol: "<?= cHeader::get(cSpaceUrlParams::SOL) ?>"
                    Instrument: "<?= cHeader::get(cSpaceUrlParams::INSTRUMENT) ?>"
                    Migrating From: "<?= cHeader::get(cAppUrlParams::PRODUCT_FROM) ?>"
                    Migrating To: "<?= cHeader::get(cAppUrlParams::PRODUCT_TO) ?>"
                </td>
                <td align="right">
                    <img src="<?= cAppGlobals::$appImages ?>/browser/dude.png" height="120">
                </td>
            </tr>
        </table>
    </div>

    <!-- footer -->
    <?php include cAppGlobals::$appPhpFragments . "/footer.php"     ?>
</body>

</html>