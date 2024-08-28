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
        $sUser = null;
        try {
            $sUser = cAuth::must_get_user();
        } catch (Exception $e) {
            cPageOutput::errorbox($e->getMessage());
            cPageOutput::messagebox("go back to <a href='$home'>login</a>");
            cDebug::error($e);
        }
    }
}

class cAdminMigrate {
    static function migrate_tag_index() {
        cDebug::enter();
        cDebug::error("not implemented");
        cDebug::leave();
    }
}
