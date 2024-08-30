<?php
require_once "$spaceInc/misc/tags.php";

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
    static function vacuum() {
        cDebug::enter(); {
            cDebug::write("vacuuming cOBjStoreDB");
            cSqlLiteUtils::vacuum(cOBjStoreDB::DB_FILENAME);

            cDebug::write("vacuuming cCuriosityManifestIndex");
            cSqlLiteUtils::vacuum(cCuriosityManifestIndex::DB_FILENAME);

            cDebug::write("done");
        }
        cDebug::leave();
    }
}

//#######################################################################
//#######################################################################
