<?php

require_once "$spaceInc/misc/tags.php";
require_once "$spaceInc/misc/pichighlight.php";
require_once "$spaceInc/misc/comments.php";

class cMigrateObjdata {
    /** @var cObjStoreDB $objstoreDB */
    static $objstoreDB = null;
    static $LastProduct = null;
    static $LastSol = null;
    const OBJDB_REALM = "Migrate";
    const MIGRATED_PHASE = "MIPh";
    const MIGRATED_SOL = "MIS";
    const MIGRATED_PRODUCT = "MIPr";
    const PHASE_COMPLETE = "phdone";
    const PHASE_COMMENTS = "phc";
    const PHASE_GIGA = "phg";
    const PHASE_HIGHLIGHTS = "phh";
    const PHASE_PRODUCT_TAGS = "pht";
    const PHASE_MOSAIC = "phmos";
    const PHASE_TAG_NAMES = "phtn";
    const BEFORE_MIGRATION_SOL = -1;

    //*******************************************************************
    static function init_obj_store_db() {
        cDebug::enter();
        if (self::$objstoreDB == null) {
            self::$objstoreDB = new cObjStoreDB(self::OBJDB_REALM, "migrate");
        }
        cDebug::leave();
    }


    //*******************************************************************
    //* steps:  highlights, tags, tagname, gigas, comments, mosaics
    //*******************************************************************
    static function initialise() {
        //get the phase last migrated to
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;
        //$oDB->SHOW_SQL = true;

        //get the status of the migration
        $sPhase = $oDB->get(self::MIGRATED_PHASE);
        self::$LastSol = $oDB->get(self::MIGRATED_SOL);
        if (self::$LastSol == null) self::$LastSol = self::BEFORE_MIGRATION_SOL;
        self::$LastProduct = $oDB->get(self::MIGRATED_PRODUCT);

        return $sPhase;
    }

    static function migrate() {
        cDebug::enter();
        $sPhase = self::initialise();

        cDebug::extra_debug("migration phase is '$sPhase'");

        //process according to the reached phase
        switch ($sPhase) {
            case null:
                // migration not attempted
                self::pr_migrate_highlights();
                break;
            case self::PHASE_HIGHLIGHTS:
                cDebug::write("completing highlight migration");
                self::pr_migrate_highlights();
                break;
            case self::PHASE_TAG_NAMES:
                cDebug::write("completing tag name migration");
                self::pr_migrate_tag_names();
                break;
            case self::PHASE_PRODUCT_TAGS:
                cDebug::write("completing product tag migration");
                self::pr_migrate_product_tags();
                break;
            case self::PHASE_COMMENTS:
                cDebug::write("completing comment migration");
                self::pr_migrate_comments();
                break;
            case self::PHASE_GIGA:
                cDebug::write("completing gigapan migration");
                self::pr_migrate_gigas();
                break;
            case self::PHASE_MOSAIC:
                cDebug::write("completing mosaic migration");
                cAdminfunctions::migrate_mosaics();
                break;
            case self::PHASE_COMPLETE:
                // migration completed
                cDebug::error("migration completed");
                break;
            default:
                cDebug::error("unknown migration phase");
        }

        //if completed leave ask to repeat
        cDebug::leave();
    }

    //*******************************************************************
    //*
    //*******************************************************************
    static function set_last_sol($piSol) {
        $oDB = self::$objstoreDB;
        $oDB->put(self::MIGRATED_SOL, $piSol);
        self::$LastSol = $piSol;
    }

    static function set_phase($psPhase) {
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;

        //update the state of the migration
        $oDB->put(self::MIGRATED_PHASE, $psPhase);
    }

    //*******************************************************************
    //*
    //*******************************************************************
    private static function pr_migrate_highlights() {
        cDebug::enter();
        cDebug::write("migrating Highlights");

        //update the state of the migration
        self::set_phase(self::PHASE_HIGHLIGHTS);

        //get the list
        $aList = cSpaceImageHighlight::get_top_index();

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > self::$LastSol) {
                $aProducts = cSpaceImageHighlight::get_all_highlights($iSol);
                self::set_last_sol($iSol);
                cDebug::write("migrated highlights for sol $iSol");
            }

        //next migration
        self::set_last_sol(self::BEFORE_MIGRATION_SOL);
        self::pr_migrate_product_tags();
        cDebug::leave();
    }


    //******************************************************
    private static function pr_migrate_comments() {
        cDebug::enter();
        cDebug::write("migrating comments");

        //update the state of the migration
        self::set_phase(self::PHASE_COMMENTS);
        //get the list
        cAdminfunctions::indexComments();

        //next migration
        self::set_last_sol(self::BEFORE_MIGRATION_SOL);
        cAdminfunctions::migrate_mosaics();

        cDebug::leave();
    }

    //******************************************************
    private static function pr_migrate_tag_names() {
        cDebug::enter();

        //update the state of the migration
        cDebug::write("migrating Tag names");
        self::set_phase(self::PHASE_TAG_NAMES);

        //
        $aTags = cSpaceTags::get_top_tag_names();

        foreach ($aTags as $sTag => $sCount) {
            if ($sTag === "") continue;
            cDebug::write("Tag is $sTag");
            cSpaceTags::get_tag_name_index($sTag);
        }

        //next migration
        self::set_last_sol(self::BEFORE_MIGRATION_SOL);
        self::pr_migrate_gigas();

        cDebug::leave();
    }

    //******************************************************
    private static function pr_migrate_product_tags() {
        cDebug::enter();
        cDebug::write("migrating product Tags");

        //update the state of the migration
        self::set_phase(self::PHASE_PRODUCT_TAGS);

        //get the list
        $aList = cSpaceTags::get_top_sol_index();

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > self::$LastSol) {
                $aInstrData = cSpaceTags::get_sol_tags($iSol);
                if (is_array($aInstrData)) {
                    foreach ($aInstrData as $sInstr => $aTags) {
                        cSpaceTags::get_instr_index($iSol, $sInstr);
                        foreach ($aTags as $oItem) {
                            $sProduct = $oItem["p"];
                            cSpaceTags::get_product_tags($iSol, $sInstr, $sProduct);
                        }
                    }
                }

                self::set_last_sol($iSol);
                cDebug::write("done  sol $iSol");
            }

        //next migration
        self::set_last_sol(self::BEFORE_MIGRATION_SOL);
        self::pr_migrate_tag_names();

        cDebug::leave();
    }

    //******************************************************
    private static function pr_migrate_gigas() {
        cDebug::enter();
        cDebug::write("migrating Gigapans");

        //update the state of the migration
        self::set_phase(self::PHASE_GIGA);

        //get the list
        $aList = cPencilNev::get_top_gigas();

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > self::$LastSol) {
                $aProducts = cPencilNev::get_sol_gigas($iSol);
                self::set_last_sol($iSol);
                cDebug::write("done gigas for sol $iSol");
                cDebug::flush();
            }

        //next migration
        self::set_last_sol(self::BEFORE_MIGRATION_SOL);
        self::pr_migrate_comments();

        cDebug::leave();
    }
}


cMigrateObjdata::init_obj_store_db();
