<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 -2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
 **************************************************************************/
$home = "../../..";
require_once "$home/php/fragments/app-common.php";

//phpinc includes
require_once "$phpInc/ckinc/session.php";
require_once "$phpInc/ckinc/common.php";
require_once "$phpInc/ckinc/header.php";
require_once "$phpInc/ckinc/auth.php";
require_once "$phpInc/ckinc/debug.php";
require_once "$phpInc/ckinc/cached_http.php";

//space includes
require_once "$spaceInc/curiosity/static.php";
require_once "$spaceInc/curiosity/pdsindexer.php";
require_once "$spaceInc/curiosity/locations.php";
require_once "$spaceInc/misc/gigapan.php";
require_once "$spaceInc/misc/pencilnev.php";
require_once "$spaceInc/misc/tags.php";
require_once "$spaceInc/misc/pichighlight.php";

//other includes
require_once "$home/php/classes/admin-funcs.php";

//settings to prevent buffering
prevent_buffering();

//##################################################################
//headers
include "$appPhpFragments/doctype.php";
echo "<HEAD>\n";
$sTitle = "Curiosity browser - Admin";
include("$appPhpFragments/header.php");
echo "</HEAD>\n";

//##################################################################
echo "<BODY>\n";
include("$appPhpFragments/title.php");

//force the user to logon

cAdminFunctions::check_user_is_admin();
cAdminFunctions::check_admin_file();

//##################################################################
const OPS_PARAM = "o";
if (!isset($_GET[OPS_PARAM]))
    $sOperation = "";
else {
    $sOperation = $_GET[OPS_PARAM];
    cDebug::on(true);
}
cDebug::write("Operation is '$sOperation'");

$aData = null;

switch ($sOperation) {
        //------------------------------------------------------
    case "backup":
        cObjStore::backup();
        break;

        //------------------------------------------------------
    case "parseAllPDS":
        cCuriosityPdsIndexer::index_everything();
        break;

        //------------------------------------------------------
    case "killPDSIndex":
        cPDS::kill_index_files();
        cDebug::write("done");
        break;

        //------------------------------------------------------
    case "parsePDS":
        if (!array_key_exists("v", $_GET)) {
            $aCats = cCuriosityPDS::catalogs();
?>
            <a target="PDS" href="<?= cCuriosity::PDS_VOLUMES ?>">Curiosity PDS released volumes</a>
            <p>
            <form method="get" name="pds">
                <Input type="hidden" name="<?= OPS_PARAM ?>" value="<?= $sOperation ?>">
                <Input type="hidden" name="debug" value="1">
                volume: <select name="v">
                    <?php
                    foreach ($aCats as $sCat)
                        echo "<option>$sCat</option>";
                    ?>
                </select>
                Index: <Input type="input" name="i" value="EDRINDEX">
                <input type="submit">
            </form>
        <?php
            exit();
        }
        $sVolume = $_GET["v"];
        if (!isset($_GET["i"])) cDebug::error("no index specified");

        $sIndex = $_GET["i"];
        cCuriosityPdsIndexer::run_indexer($sVolume, $sIndex);
        break;

        //------------------------------------------------------
    case "killHighlight":
        if (!array_key_exists("p", $_GET)) {
        ?>
            <form method="get">
                <Input type="hidden" name=<?= OPS_PARAM ?> value="<?= $sOperation ?>">
                <Input type="hidden" name="debug" value="1">
                sol: <Input type="input" name="s"><br>
                instr: <Input type="input" name="i"><br>
                product: <Input type="input" name="p"><br>
                which: <Input type="input" name="w"><br>
                <input type="submit">
            </form>
        <?php
            exit();
        }
        cSpaceImageHighlight::kill_highlites($_GET["s"], $_GET["i"], $_GET["p"], $_GET["w"]);
        break;

        //------------------------------------------------------
    case "del_empty_folders":
        cCommonFiles::delete_empty_folders(cObjStore::$rootFolder);
        break;

        //------------------------------------------------------
    case "deleteSolHighlights":
        if (!array_key_exists("s", $_GET)) {
        ?>
            <form method="get">
                <Input type="hidden" name="<?= OPS_PARAM ?>" value="<?= $sOperation ?>">
                <Input type="hidden" name="debug" value="1">
                Sol: <Input type="input" name="s"><br>
                <input type="submit"></input>
            </form>
        <?php
            exit();
        }
        cDebug::write("not implemented");
        break;

        //------------------------------------------------------
    case "indexGigas":
        $aItems = cGigapan::get_all_gigapans("pencilnev");
        cPencilNev::index_gigapans($aItems);
        break;

        //------------------------------------------------------
    case  "indexManifest":
        cCuriosityManifestIndex::indexManifest();
        break;

        //------------------------------------------------------
    case "killTag":
        if (!array_key_exists("t", $_GET)) {
        ?>
            <form method="get">
                <Input type="hidden" name="<?= OPS_PARAM ?>" value="<?= $sOperation ?>">
                <Input type="hidden" name="debug" value="1">
                <Input type="input" name="t"><br>
                <input type="submit"></input>
            </form>
        <?php
            exit();
        }
        cSpaceTagNames::kill_tag_name($_GET["t"]);
        break;

        //------------------------------------------------------
    case "killSession":
        cDebug::write("ok");
        session_destroy();
        break;
        //------------------------------------------------------
    case "killCache":
        //cCachedHttp::clearCache();
        cDebug::error("not implemented");
        break;

        //------------------------------------------------------
    case "reindexHilite":
        cSpaceImageHighlight::reindex();
        break;

        //------------------------------------------------------
    case "mergeTags":
        cDebug::error("to be done");
        break;

        //------------------------------------------------------
    case "migrateTagsIndex":
        cAdminMigrate::migrate_tag_index();
        break;

    case "parseLocations":
        cCuriosityLocations::parseLocations();
        break;

    default:
        $sTitle = "Admin";
        ?>

        <form method="get">
            <Input type="radio" name="<?= OPS_PARAM ?>" value="backup">backup objdata<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="del_empty_folders">delete empty objdata folders<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="del_ihighlite">delete ihighlite files<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="indexComm">index Comments<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="indexGigas">index Nevilles gigapans<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="indexManifest">index curiosity manifests<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="killCache">clear cache<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="killHighlight">erase particular highlight<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="killPDSIndex">Kill ALL PDS index files<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="killSession">kill the session<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="killTag">remove tag<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="mergeTags">merge a tag<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="migrateTagsIndex">Migrate Tag Index<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="parseAllPDS">parse ALL PDS files<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="parseLocations">parse curiosity locations<br>
            <Input type="radio" name="<?= OPS_PARAM ?>" value="parsePDS">parse PDS files<br>
            <input type="submit" class="w3-button w3-theme-button-up"></input>
        </form>
<?php
        break;
}
echo "</BODY>";

?>