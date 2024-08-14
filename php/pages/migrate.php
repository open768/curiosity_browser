<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");  ?>
<html>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>Migrate</title>
</head>

<body>
    <?php
    $sTitle = "Migrate";
    include("$appPhpFragments/title.php");
    ?>
    <script src="<?= $jsInc ?>/ck-inc/common.js"></script>
    <div class="gold">
        <table border="0" width="100%">
            <tr>
                <td valign=middle>
                    <img src="<?= $appImages ?>/browser/rover.png" height="120">
                </td>
                <td>
                    <font class="big_error">Migrating</font>
                    <P>
                        Sorry About this, those clever space agency people have moved data around. We're the ones who have to restore order to this data chaos.
                        Hang on a while, we're migrating our data and having regulation tea breaks... may be a while... a long while... days if not longer.... has been known to be weeks.
                    <p>
                        Sol: "<?= cHeader::get("s") ?>"
                        Instrument: "<?= cHeader::get("i") ?>"
                        Migrating From: "<?= cHeader::get("pfrom") ?>"
                        Migrating To: "<?= cHeader::get("pto") ?>"
                </td>
                <td align="right">
                    <img src="<?= $appImages ?>/browser/dude.png" height="120">
                </td>
            </tr>
        </table>
    </div>

    <!-- footer -->
    <?php include("$appPhpFragments/footer.php")     ?>
</body>

</html>