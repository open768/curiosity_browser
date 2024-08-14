<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include("$appPhpFragments/doctype.php");  ?>
<html>

<head>
    <?php
    include("$appPhpFragments/header.php");
    ?>
    <title>Error </title>
</head>

<body>
    <?php
    $sTitle = "Errrrrror";
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
                    <font class="big_error">OOPS THERE WAS AN ERROR</font>
                    <P>
                        Message was "<?= cHeader::get("m") ?>"
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