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
        try {
            $sUser = cAuth::must_get_user();
        } catch (Exception $e) {
            cPageOutput::errorbox($e->getMessage());
            cPageOutput::messagebox("go back to <a href='$home'>login</a>");
            cDebug::error($e);
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

        $aSolData = cSpaceImageHighlight::get_top_index();
        foreach ($aSolData as $sSol => $iCount) {
            cCommon::flushprint("+");

            $aSolData = cSpaceImageHighlight::get_sol_highlighted_products($sSol);
            $aMem = [];
        }


        cDebug::error("not implemented");
        cDebug::leave();
    }
}

//#######################################################################
//#######################################################################
