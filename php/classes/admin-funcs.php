<?php
require_once cAppGlobals::$spaceInc . "/misc/tags.php";

class cAdminFunctions {
    //****************************************************************
    static function check_admin_file() {
        cAuth::check_for_admin_id_file();
        $sAdmin = cAuth::current_user_is_admin();
        if ($sAdmin !== cAuth::YES)
            cDebug::error("not an admin user ");
        cDebug::check_GET_or_POST();
    }

    //****************************************************************
    static function check_user_is_admin() {
        global $home;
        $sAdmin = cAuth::current_user_is_admin();
        if ($sAdmin !== cAuth::YES) {
            cPageOutput::messagebox("not an admin go back to <a href='$home'>login</a>");
            cDebug::error("not an admin");
        }
    }

    //****************************************************************
    static function vacuum_dbs() {
        cDebug::enter(); {
            cDebug::write("vacuuming cOBjStoreDB");
            cSqlLiteUtils::vacuum(cOBjStoreDB::DB_FILENAME);

            cDebug::write("vacuuming cCuriosityManifestIndex");
            cSqlLiteUtils::vacuum(cCuriosityManifestIndex::DB_FILENAME);

            cDebug::write("done");
        }
        cDebug::leave();
    }

    //****************************************************************
    static function remove_duplicate_highlights() {
        cDebug::enter();
        $iCount = 0;

        $oDB = cSpaceImageHighlight::get_db();
        $oDB->SHOW_SQL = false;

        //----------sol
        $aSolData = cSpaceImageHighlight::get_top_index();
        foreach ($aSolData as $sSol => $iSolCount) {

            $aSolData = cSpaceImageHighlight::get_sol_highlighted_products($sSol);
            if ($aSolData == null) {
                cCommon::flushprint(" 🌇");
                continue;
            }
            cCommon::flushprint(" ☀️");

            //----------instrument
            foreach ($aSolData as $sIntrument => $aProductData) {
                cCommon::flushprint("🎺");

                //------product
                foreach ($aProductData as $sProduct => $iProductCount) {
                    $aMemory = [];
                    $aHighs = cSpaceImageHighlight::get($sSol, $sIntrument, $sProduct);
                    $aBoxes = $aHighs["d"];
                    if ($aBoxes == null || count($aBoxes) == 0) {
                        cCommon::flushprint("🍗");
                        continue;
                    }
                    cCommon::flushprint(".");

                    $aOut = [];
                    $iProdCount = 0;
                    foreach ($aBoxes as $iBoxID => $aBox) {
                        cCommon::flushprint(".");
                        $sTop = $aBox["t"];
                        $sLeft = $aBox["l"];
                        $sKey = "{$sTop}{$sLeft}";
                        if (array_key_exists($sKey, $aMemory)) {
                            $iProdCount++;
                            cCommon::flushprint("❌");
                        } else {
                            $aMemory[$sKey] = 1;
                            $aOut[] = $aBox;
                        }
                    }
                    if ($iProdCount > 0) {
                        cCommon::flushprint("💾");
                        cSpaceImageHighlight::put($sSol, $sIntrument, $sProduct, $aOut);
                    }
                    $iCount += $iProdCount;
                }
            }
        }
        cDebug::write("");
        cDebug::write("$iCount Duplicate items found");

        cDebug::leave();
    }
}

//#######################################################################
//#######################################################################
