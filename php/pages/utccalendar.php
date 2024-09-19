<?php
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/doctype.php";
?>

<head>
    <?php
    include cAppGlobals::$appPhpFragments . "/header.php";
    ?>
    <title>UTC calendar</title>
</head>

<body>
    <?php
    cAppGlobals::$title = "Curiosity UTC calendar";
    include cAppGlobals::$appPhpFragments . "/title.php";
    ?>
    <div class="w3-panel w3-red w3-leftbar w3-border-yellow">
        <h1>Not Implemented</h1>
    </div>

    <!-- footer -->
    <?php
    include cAppGlobals::$appPhpFragments . "/footer.php"
    ?>
</body>

</html>