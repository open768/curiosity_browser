<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 -2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
 **************************************************************************/
$home = "../..";
require_once  "$home/php/fragments/app-common.php";
require_once "$phpInc/ckinc/session.php";
//cSession::set_folder();       //dont set the folder as it will never be cleaned

require_once  "$phpInc/ckinc/common.php";
require_once  "$phpInc/ckinc/header.php";
require_once  "$phpInc/ckinc/auth.php";
require_once  "$phpInc/ckinc/debug.php";
require_once  "$phpInc/ckinc/cached_http.php";

require_once  "$spaceInc/curiosity/static.php";
require_once  "$spaceInc/curiosity/pdsindexer.php";
require_once  "$spaceInc/curiosity/locations.php";
require_once  "$spaceInc/misc/gigapan.php";
require_once  "$spaceInc/misc/pencilnev.php";
require_once  "$spaceInc/misc/tags.php";
require_once  "$spaceInc/misc/pichighlight.php";

include("$appPhpFragments/header.php");

//force the user to logon
$sUser = null;
try {
    $sUser = cAuth::must_get_user();
} catch (Exception $e) {
    cPageOutput::errorbox($e->getMessage());
    cPageOutput::messagebox("go back to <a href='$home'>login</a>");
    cDebug::error($e);
}
cAuth::check_for_admin_id_file();
$sAdmin = cAuth::current_user_is_admin();
if ($sAdmin !== cAuth::YES)
    cDebug::error("not an admin user ");
cDebug::check_GET_or_POST();


//***************************************************
ini_set("max_execution_time", 60);
ini_set("max_input_time", 60);
set_time_limit(600);

//***************************************************
if (!isset($_GET["o"]))
    $sOperation = "";
else
    $sOperation = $_GET["o"];
cDebug::write("Operation is '$sOperation'");

$aData = null;

switch ($sOperation) {
        //------------------------------------------------------
    case "backup":
        $sFilename = addslashes("$root/backup.zip");
        $sFolder = addslashes("$root/[objdata]");
        $cmd = "zip -r \"$sFilename\" \"$sFolder\"";
        cDebug::write("running command $cmd");
        $iReturn = 0;
        echo exec($cmd, $output, $iReturn);
        cDebug::write("done: $iReturn");
        cDebug::vardump($output);
        break;

    case "parseAllPDS":
        cCuriosityPdsIndexer::index_everything();
        break;

    case "killPDSIndex":
        cPDS::kill_index_files();
        cDebug::write("done");
        break;

    case "parsePDS":
        if (!array_key_exists("v", $_GET)) {
            $aCats = cCuriosityPDS::catalogs();
?>
            <a target="PDS" href="http://pds-imaging.jpl.nasa.gov/volumes/msl.html">Curiosity PDS released volumes</a>
            <p>
            <form method="get" name="pds">
                <Input type="hidden" name="o" value="<?= $sOperation ?>">
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
                <Input type="hidden" name="o" value="<?= $sOperation ?>">
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
        cImageHighlight::kill_highlites($_GET["s"], $_GET["i"], $_GET["p"], $_GET["w"]);
        break;

        //------------------------------------------------------
    case "deleteSolHighlights":
        if (!array_key_exists("s", $_GET)) {
        ?>
            <form method="get">
                <Input type="hidden" name="o" value="<?= $sOperation ?>">
                <Input type="hidden" name="debug" value="1">
                Sol: <Input type="input" name="s"><br>
                <input type="submit"></input>
            </form>
        <?php
            exit();
        }
        cDebug::write("not implemented");
        break;

    case "killTag":
        if (!array_key_exists("t", $_GET)) {
        ?>
            <form method="get">
                <Input type="hidden" name="o" value="<?= $sOperation ?>">
                <Input type="hidden" name="debug" value="1">
                <Input type="input" name="t"><br>
                <input type="submit"></input>
            </form>
        <?php
            exit();
        }
        cTags::kill_tag($_GET["t"]);
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
    case "rebuildHiliteSolIndex":
        cImageHighlight::rebuildSolIndices();   //not implelemnted
        break;

        //------------------------------------------------------
    case "reindexTags":
        cTags::reindex();
        break;

        //------------------------------------------------------
    case "reindexHilite":
        cImageHighlight::reindex();
        break;

        //------------------------------------------------------
    case "mergeTags":
        throw new Exception("to be done");
        break;

        //------------------------------------------------------
    case "indexGigas":
        set_time_limit(600);
        $aItems = cGigapan::get_all_gigapans("pencilnev");
        cPencilNev::index_gigapans($aItems);
        break;

        //------------------------------------------------------
    case "parseLocations":
        set_time_limit(600);
        cCuriosityLocations::parseLocations();
        break;

        //------------------------------------------------------
    case "migrate_to_Objdb":
        cDebug::error("not implemented");
        //------------------------------------------------------
    default:
        $sTitle = "Admin";
        include("$appPhpFragments/title.php");
        ?>

        <form method="get">
            <Input type="radio" name="o" value="backup">backup objdata<br>
            <Input type="radio" name="o" value="parsePDS">parse PDS files<br>
            <Input type="radio" name="o" value="parseAllPDS">parse ALL PDS files<br>
            <Input type="radio" name="o" value="killPDSIndex">Kill ALL PDS index files<br>
            <Input type="radio" name="o" value="killCache">clear cache<br>
            <Input type="radio" name="o" value="killTag">remove tag<br>
            <Input type="radio" name="o" value="mergeTags">merge a tag<br>
            <Input type="radio" name="o" value="indexGigas">index Nevilles gigapans<br>
            <Input type="radio" name="o" value="parseLocations">parse curiosity locations<br>

            <Input type="radio" name="o" value="rebuildHiliteSolIndex">rebuild hilite indices<br>
            <Input type="radio" name="o" value="reindexTags">reindex Tags - needed after deletion<br>
            <Input type="radio" name="o" value="reindexHilite">reindex image highlights <br>
            <Input type="radio" name="o" value="killHighlight">erase particular highlight<br>
            <Input type="radio" name="o" value="deleteSolHighlights">Delete Sol highlight image files<br>
            <Input type="radio" name="o" value="killSession">kill the session<br>
            <Input type="radio" name="o" value="migrate_to_Objdb">Migrate to objdb<br>
            <Input type="hidden" name="debug" value="1">
            <input type="submit"></input>
        </form>
<?php
        break;
}
?>