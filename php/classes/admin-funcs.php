<?php
require_once cAppGlobals::$spaceInc . "/curiosity/pdsindexer.php";
require_once cAppGlobals::$spaceInc . "/curiosity/locations.php";
require_once cAppGlobals::$spaceInc . "/misc/gigapan.php";
require_once cAppGlobals::$spaceInc . "/misc/pencilnev.php";
require_once cAppGlobals::$spaceInc . "/misc/tags.php";
require_once cAppGlobals::$spaceInc . "/misc/pichighlight.php";

class cAdminFunctions {
    //****************************************************************
    static function check_admin_file() {
        cAuth::check_for_admin_id_file();
        $sAdmin = cAuth::current_user_is_admin();
        if ($sAdmin !== cAuth::YES)
            cDebug::error("not an admin user ");
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
        cTracing::enter(); {
            cDebug::write("vacuuming cOBjStoreDB");
            cSqlLiteUtils::vacuum(cOBjStoreDB::DB_FILENAME);

            cDebug::write("vacuuming cCuriosityManifestIndex");
            cSqlLiteUtils::vacuum(cCuriosityManifestIndex::DB_FILENAME);

            cDebug::write("done");
        }
        cTracing::leave();
    }

    //****************************************************************
    static function remove_duplicate_highlights() {
        cTracing::enter();
        $iCount = 0;

        $oDB = cSpaceImageHighlight::get_db();

        //----------sol
        $aTopData = cSpaceImageHighlight::get_top_index();
        foreach ($aTopData as $sSol => $iSolCount) {

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
                    $aHighs = cSpaceImageHighlight::get($sSol, $sIntrument, $sProduct, false);
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

        cTracing::leave();
    }

    //******************************************************************
    static function export_highs() {
        cTracing::enter();
        echo "Sol,Instrument,Product,top,left,image_url\n";
        echo "=,=,=,=,=,=\n";

        $aTopData = cSpaceImageHighlight::get_top_index();
        foreach ($aTopData as $sSol => $iSolCount) {
            $aSolData = cSpaceImageHighlight::get_sol_highlighted_products($sSol);
            foreach ($aSolData as $sInstrument => $aProductData)
                foreach ($aProductData as $sProduct => $iProductCount) {
                    try {
                        $oProduct = cCuriosityManifestUtils::search_for_product($sProduct);
                        $sUrl = $oProduct->image_url;
                    } catch (Exception $e) {
                        $sUrl = "unknown url";
                    }

                    $aHighs = cSpaceImageHighlight::get($sSol, $sInstrument, $sProduct, false);
                    $aBoxes = $aHighs["d"];
                    if ($aBoxes == null || count($aBoxes) == 0) continue;
                    foreach ($aBoxes as $iBoxID => $aBox) {
                        $sTop = $aBox["t"];
                        $sLeft = $aBox["l"];
                        cCommon::flushprint("$sSol,$sInstrument,$sProduct,$sTop,$sLeft, $sUrl\n");
                    }
                }
        }
        cTracing::leave();
    }

    //******************************************************************
    static function export_tags() {
        cTracing::enter();

        echo "Tag,Sol,Instrument,Product,image_url\n";
        echo "=,=,=,=,=\n";

        $aTopTags = cSpaceTagNames::get_top_tag_names();
        foreach ($aTopTags as $sName => $iCount) {
            if (cCommon::is_string_empty($sName)) continue;

            $aTagDetails = cSpaceTagNames::get_tag_name_index($sName);
            foreach ($aTagDetails as $sItem) {
                $aParts = explode("/", $sItem);
                $sSol = $aParts[0];
                $sInstr = $aParts[1];
                $sProduct = $aParts[2];
                try {
                    $oProduct = cCuriosityManifestUtils::search_for_product($sProduct);
                    $sUrl = $oProduct->image_url;
                } catch (Exception $e) {
                    $sUrl = "unknown url";
                }
                cCommon::flushprint("$sName,$sSol,$sInstr,$sProduct,$sUrl\n");
            }
        }

        cTracing::leave();
    }
}

//#######################################################################
//#######################################################################
