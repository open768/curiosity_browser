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
}

//#######################################################################
//#######################################################################
class cAdminMigrate {
    static $objstoreDB = null;
    const MIGRATE_DIR = "[migrate]";
    const TAG_MIGRATE = "tag";
    const STAGE1_KEY = "status";
    const STAGE2_KEY = "killindex";


    //********************************************************************
    //* objdb stuff
    //********************************************************************
    static function init_obj_store_db() {
        if (!self::$objstoreDB)
            self::$objstoreDB = new cObjStoreDB("migrate", "migrate");
    }

    //********************************************************************
    //* status stuff
    //********************************************************************
    static function put_migrate_status($psMigrationName, $psKey, $psValue) {
        /** @var cObjStoreDB $oDB **/
        $oDB = self::$objstoreDB;
        $oDB->put(self::MIGRATE_DIR . "/$psMigrationName/$psKey", $psValue, true);
    }

    static function get_migrate_status($psMigrationName, $psKey) {
        /** @var cObjStoreDB $oDB **/
        $oDB = self::$objstoreDB;
        return $oDB->get(self::MIGRATE_DIR . "/$psMigrationName/$psKey");
    }

    //********************************************************************
    //* status stuff
    //********************************************************************
    static function migrate_tag_index() {
        cDebug::enter();

        //--------------------------------------------------------------------
        //stage1 - update the New Index
        cDebug::write("stage1");
        $iLastSol = self::get_migrate_status(self::TAG_MIGRATE, self::STAGE1_KEY);
        if (!$iLastSol) $iLastSol = -1;
        cDebug::write("migration status is: '$iLastSol'");

        // get the old top index
        $aOldIndex = cOldSpaceTagsIndex::get_top_sol_index();
        if ($aOldIndex)
            foreach ($aOldIndex as $sSol => $iCount) {
                if ($sSol <= $iLastSol) continue;

                cDebug::write("processing sol: $sSol");

                $aSolTags = cSpaceTags::get_sol_tags($sSol);
                foreach ($aSolTags as $sInstr => $aInstrData)
                    foreach ($aInstrData as $aItem) {
                        $sProduct = $aItem["p"];
                        cSpaceTagsIndex::update_indexes($sSol, $sInstr, $sProduct, 1);
                    }

                self::put_migrate_status(self::TAG_MIGRATE, self::STAGE1_KEY, $sSol);
            }

        //--------------------------------------------------------------------
        //stage2 - remove redundant files
        cDebug::write("stage2");
        $iLastSol = self::get_migrate_status(self::TAG_MIGRATE, self::STAGE2_KEY);
        if (!$iLastSol) $iLastSol = -1;
        $aOldIndex = cOldSpaceTagsIndex::get_top_sol_index();
        if ($aOldIndex) {
            foreach ($aOldIndex as $sSol => $iCount) {
                if ($sSol <= $iLastSol) continue;
                $aSolTags = cSpaceTags::get_sol_tags($sSol);
                foreach ($aSolTags as $sInstr => $aInstrData)
                    cOldSpaceTagsIndex::kill_instr_index($sSol, $sInstr);
                self::put_migrate_status(self::TAG_MIGRATE, self::STAGE2_KEY, $sSol);
            }
            cOldSpaceTagsIndex::kill_top_sol_index();
        }

        cDebug::write("done");
        cDebug::leave();
    }
}
cAdminMigrate::init_obj_store_db();
