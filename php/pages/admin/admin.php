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
$sOperation = cHeader::get(cAppUrlParams::OPERATION);
if ($sOperation !== null)    cDebug::on(true);
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
    case "del_empty_folders":
        cCommonFiles::delete_empty_folders(cObjStore::$rootFolder);
        break;

        //------------------------------------------------------
    case "deleteSolHighlights":
        if (cHeader::get("s") == null) {
?>
            <form method="get">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
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
    case "killHighlight":
        if (cHeader::get("p") == null) {
        ?>
            <form method="get">
                <Input type="hidden" name=<?= cAppUrlParams::OPERATION ?> value="<?= $sOperation ?>">
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
        cSpaceImageHighlight::kill_highlites(cHeader::get(cSpaceUrlParams::SOL), cHeader::get(cSpaceUrlParams::INSTRUMENT), cHeader::get(cSpaceUrlParams::PRODUCT), cHeader::get("w"));
        break;

        //------------------------------------------------------
    case "killTag":
        if (cHeader::get("t") == null) {
        ?>
            <form method="get">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
                <Input type="hidden" name="debug" value="1">
                <Input type="input" name="t"><br>
                <input type="submit"></input>
            </form>
        <?php
            exit();
        }
        cSpaceTagNames::kill_tag_name(cHeader::get("t"));
        break;

        //------------------------------------------------------
    case "killSession":
        session_destroy();
        break;
        //------------------------------------------------------
    case "killThumbFiles":
        cCommonFiles::delTree(cAppLocations::$images . "/[thumbs]");
        break;
        //------------------------------------------------------
    case "killCache":
        //cCachedHttp::clearCache();
        cDebug::error("not implemented");
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
    case "deleteManifest":
        $sSure = cHeader::get("sure");
        if ($sSure !== "yes") {
        ?>
            <h1>delete manifest</h1>
            <form method="get" name="mani">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
                Sure? <input type="submit" name="sure" value="yes">
            </form>
        <?php
        } else
            cCuriosityManifestIndex::deleteIndex();
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
        if (cHeader::get("v") == null) {
            $aCats = cCuriosityPDS::catalogs();
        ?>
            <a target="PDS" href="<?= cCuriosity::PDS_VOLUMES ?>">Curiosity PDS released volumes</a>
            <p>
            <form method="get" name="pds">
                <Input type="hidden" name="<?= cAppUrlParams::OPERATION ?>" value="<?= $sOperation ?>">
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
        $sVolume = cHeader::get("v");
        $sIndex = cHeader::get("i");
        if ($sIndex == null) cDebug::error("no index specified");

        cCuriosityPdsIndexer::run_indexer($sVolume, $sIndex);
        break;

        //------------------------------------------------------
    case "vacuum":
        cAdminFunctions::vacuum();
        break;

        //------------------------------------------------------
    case null:
        $sTitle = "Admin";
        cDebug::write("Default operation"); {
        ?>

            <form method="get">
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="backup">backup objdata<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="clean_product_tags">clean product tags<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="del_empty_folders">delete empty objdata folders<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="indexComm">index Comments<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="indexGigas">index Nevilles gigapans<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="indexManifest">index curiosity manifests<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="deleteManifest">delete manifest index(severe)<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killCache">clear cache<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killHighlight">erase particular highlight<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killSession">kill the session<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killTag">remove tag<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="killThumbFiles">remove thumbnails folder<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="mergeTags">merge a tag<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parseAllPDS">parse ALL PDS files<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parseLocations">parse curiosity locations<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="parsePDS">parse PDS files<br>
                <Input type="radio" name="<?= cAppUrlParams::OPERATION ?>" value="vacuum">sqllite vacuum database<br>
                <input type="submit" class="w3-button w3-theme-button-up"></input>
            </form>#
<?php
        }
        break;
    default:
        cDebug::error("unsupported operation: $sOperation");
}
if ($sOperation !== null)    cDebug::write("done");

echo "</BODY>";

?>