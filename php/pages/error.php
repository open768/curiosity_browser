<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>Error </title>
</head>

<body>
    <?php
    cAppGlobals::$title = "Errrrrror";
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
                    <font class="big_error">OOPS THERE WAS AN ERROR</font>
                    <P>
                        Message was "<?= cHeader::get(cSpaceUrlParams::MISSION) ?>"
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