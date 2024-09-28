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


//other includes
require_once "$home/php/classes/admin-funcs.php";

//settings to prevent buffering
prevent_buffering();

//##################################################################
//headers
include cAppGlobals::$appPhpFragments . "/doctype.php";
echo "<HEAD>\n";
cAppGlobals::$title = "Admin";
include cAppGlobals::$appPhpFragments . "/header.php";
echo "</HEAD>\n";

//##################################################################
echo "<BODY>\n";
include cAppGlobals::$appPhpFragments . "/title.php";

//force the user to logon

cAdminFunctions::check_user_is_admin();
cAdminFunctions::check_admin_file();

//##################################################################
$sOperation = cHeader::get(cAppUrlParams::OPERATION);
if ($sOperation !== null)    cDebug::on(true);
echo "<div class='w3-container w3-theme-l5 admin'>";
cDebug::write("Operation is '$sOperation'");

$aData = null;

switch ($sOperation) {
        //------------------------------------------------------
    case "backup":
        cObjStore::backup();
        break;

    case "clean_product_tags":
        cSpaceTags::clean_product_tags();
        break;

        //------------------------------------------------------
    case "file_del_empty_folders":
        cCommonFiles::delete_empty_folders(cObjStore::$rootFolder);
        break;

        //------------------------------------------------------
    case "deleteSolHighlights":
        if (cHeader::get(cSpaceUrlParams::SOL) == null) {
?>
            <form method="get">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
                Sol: <Input type="input" name="<?= cSpaceUrlParams::SOL ?>"><br>
                <input type="submit"></input>
            </form>
        <?php
            exit();
        }
        cDebug::write("not implemented");
        break;

        //------------------------------------------------------
    case "duplicate_highlights":
        cAdminFunctions::remove_duplicate_highlights();
        break;

        //------------------------------------------------------
    case "export_tags":
        cDebug::off();
        cHeader::redirect("export.php?o=tags");
        break;
        //------------------------------------------------------
    case "export_highs":
        cDebug::off();
        cHeader::redirect("export.php?o=highs");
        break;
        //------------------------------------------------------

    case "killHighlight":
        if (cHeader::get(cSpaceUrlParams::PRODUCT) == null) {
        ?>
            <form method="get">
                <Input type="hidden" name=<?= cAppUrlParams::OPERATION ?> value="<?= $sOperation ?>">
                sol: <Input type="input" name="<?= cSpaceUrlParams::SOL ?>"><br>
                instr: <Input type="input" name="<?= cSpaceUrlParams::INSTRUMENT ?>"><br>
                product: <Input type="input" name="<?= cSpaceUrlParams::PRODUCT ?>"><br>
                <input type="submit">
            </form>
        <?php
            exit();
        }
        cSpaceImageHighlight::kill_highlites(cHeader::get(cSpaceUrlParams::SOL), cHeader::get(cSpaceUrlParams::INSTRUMENT), cHeader::get(cSpaceUrlParams::PRODUCT));
        break;

        //------------------------------------------------------
    case "killTag":
        $sTag = cHeader::get(cAppUrlParams::TAG);
        if ($sTag == null) {
        ?>
            <form method="get">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
                <Input type="input" name="<?= cAppUrlParams::TAG ?>"><br>
                <input type="submit"></input>
            </form>
        <?php
            exit();
        }
        cSpaceTagNames::kill_tag_name($sTag);
        break;

        //------------------------------------------------------
    case "killSession":
        session_destroy();
        break;
        //------------------------------------------------------
    case "file_delete _thumbs":
        cCommonFiles::delTree(cAppLocations::$images . "/[thumbs]");
        break;
        //------------------------------------------------------
    case "killCache":
        //cCachedHttp::clearCache();
        cDebug::error("not implemented");
        break;
        //------------------------------------------------------
    case "parse_gigas":
        $aItems = cGigapan::get_all_gigapans("pencilnev");
        cPencilNev::index_gigapans($aItems);
        break;

        //------------------------------------------------------
    case  "parse_manifest":
        cCuriosityManifestIndex::updateIndex();
        break;
        //------------------------------------------------------
    case "deleteManifest":
        $sSure = cHeader::get(cAppUrlParams::SURE);
        if ($sSure !== "yes") {
        ?>
            <h1>delete manifest</h1>
            <form method="get" name="mani">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
                Sure? <input type="submit" name="<?= cAppUrlParams::SURE ?>" value="yes">
            </form>
        <?php
        } else
            cCuriosityManifestIndex::deleteEntireIndex();
        break;

        //------------------------------------------------------
    case "mergeTags":
        cDebug::error("to be done");
        break;

        //------------------------------------------------------
    case "parseLocations":
        cCuriosityLocations::parseLocations();
        break;

        //------------------------------------------------------
    case "parseAllPDS":
        cCuriosityPdsIndexer::index_everything();
        break;

        //------------------------------------------------------
    case "parsePDS":
        $sVol = cHeader::get(cSpaceUrlParams::PDS_VOLUME);
        if ($sVol == null) {
            $aCats = cCuriosityPDS::catalogs();
        ?>
            <a target="PDS" href="<?= cCuriosity::PDS_VOLUMES ?>">Curiosity PDS released volumes</a>
            <p>
            <form method="get" name="pds">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
                volume: <select name="<?= cSpaceUrlParams::PDS_VOLUME ?>">
                    <?php
                    foreach ($aCats as $sCat)
                        echo "<option>$sCat</option>";
                    ?>
                </select>
                Index: <Input type="input" name="<?= cSpaceUrlParams::EDR_INDEX ?>" value="EDRINDEX">
                <input type="submit">
            </form>
        <?php
            exit();
        }
        $sIndex = cHeader::get(cSpaceUrlParams::EDR_INDEX);
        if ($sIndex == null) cDebug::error("no index specified");

        cCuriosityPdsIndexer::run_indexer($sVol, $sIndex);
        break;

        //------------------------------------------------------
    case "vacuum":
        cAdminFunctions::vacuum_dbs();
        break;

        //------------------------------------------------------
    case null:
        cAppGlobals::$title = "Admin";
        cDebug::write("Default operation"); {
        ?>

            <form method="get">
                <dl>
                    <dt>removing stuff</dt>
                    <dd>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killCache">clear cache<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killHighlight">erase particular highlight<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killSession">kill the session<br>
                    </dd>
                    <dt>Files</dt>
                    <dd>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="file_delete _thumbs">remove thumbnails folder<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="file_del_empty_folders">delete empty objdata folders<br>
                    </dd>
                    <dt>Parsing external data</dt>
                    <dd>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parse_gigas">index Nevilles gigapans<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parse_manifest">index curiosity manifests<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parseAllPDS">parse ALL PDS files<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parseLocations">parse curiosity locations<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parsePDS">parse PDS files<br>
                    </dd>
                    <dt>Database stuff</dt>
                    <dd>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="deleteManifest">delete manifest index(severe)<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="mergeTags">merge a tag<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="duplicate_highlights">remove duplicate highlights<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="vacuum">sqllite vacuum database<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killTag">remove tag<br>
                    </dd>
                    <dt>Exports</dt>
                    <DD>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="export_tags">Export Tags<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="export_high">Export Highlights<br>
                    </DD>
                    <dt>possibly Obsolete stuff</dt>
                    <dd>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="backup">backup objdata<br>
                        <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="clean_product_tags">clean product tags<br>
                    </dd>
                </dl>
                <input type="submit" class="w3-button w3-theme-button-up"></input>
            </form>
            <p>
            <ul>
                <li><a href="info.php">php info</a>
                <li>to mark app as down edit: <?= realpath(cAppLocations::$appconfig) ?>
            </ul>
            </p>
<?php
        }
        break;
    default:
        cDebug::error("unsupported operation: $sOperation");
}
if ($sOperation !== null)    cDebug::write("done");
echo "</div>";

echo "</BODY>";

?>