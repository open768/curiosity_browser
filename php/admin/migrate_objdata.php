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
    const PHASE_TAGS = "pht";
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
    //* steps:  highlights, tags, gigas, comments
    //*******************************************************************
    static function migrate() {
        cDebug::enter();

        //prevent buffering
        //echo "<script>setInterval(() => document.documentElement.scrollTop = document.documentElement.scrollHeight,10)</script>";
        cDebug::flush();
        //get the phase last migrated to
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;
        //$oDB->SHOW_SQL = true;

        //get the status of the migration
        $sPhase = $oDB->get(self::MIGRATED_PHASE);
        self::$LastSol = $oDB->get(self::MIGRATED_SOL);
        if (self::$LastSol == null) self::$LastSol = self::BEFORE_MIGRATION_SOL;
        self::$LastProduct = $oDB->get(self::MIGRATED_PRODUCT);
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
            case self::PHASE_TAGS:
                cDebug::write("completing tag migration");
                self::pr_migrate_tags();
                break;
            case self::PHASE_COMMENTS:
                cDebug::write("completing comment migration");
                self::pr_migrate_comments();
                break;
            case self::PHASE_GIGA:
                cDebug::write("completing gigapan migration");
                self::pr_migrate_gigas();
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
    private static function pr_set_last_sol($piSol) {
        $oDB = self::$objstoreDB;
        $oDB->put(self::MIGRATED_SOL, $piSol);
        self::$LastSol = $piSol;
    }

    //*******************************************************************
    //*
    //*******************************************************************
    private static function pr_migrate_highlights() {
        cDebug::enter();
        cDebug::write("migrating Highlights");
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;

        //update the state of the migration
        $oDB->put(self::MIGRATED_PHASE, self::PHASE_HIGHLIGHTS);

        //get the list
        $aList = cImageHighlight::get_top_index();

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > self::$LastSol) {
                $aProducts = cImageHighlight::get_all_highlights($iSol);
                self::pr_set_last_sol($iSol);
                cDebug::write("migrated highlights for sol $iSol");
            }

        //next migration
        self::pr_set_last_sol(self::BEFORE_MIGRATION_SOL);
        self::pr_migrate_tags();
        cDebug::leave();
    }


    //******************************************************
    private static function pr_migrate_comments() {
        cDebug::enter();
        cDebug::write("migrating comments");
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;

        //update the state of the migration
        $oDB->put(self::MIGRATED_PHASE, self::PHASE_COMMENTS);
        //get the list
        cAdminfunctions::indexComments();

        //next migration
        self::pr_set_last_sol(self::BEFORE_MIGRATION_SOL);
        $oDB->put(self::MIGRATED_PHASE, self::PHASE_COMPLETE);

        cDebug::leave();
    }

    //******************************************************
    private static function pr_migrate_tags() {
        cDebug::enter();
        cDebug::write("migrating Tags");
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;

        //update the state of the migration
        $oDB->put(self::MIGRATED_PHASE, self::PHASE_TAGS);

        //get the list
        $aList = cSpaceTags::get_top_sol_index();
        cDebug::vardump($aList);

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > self::$LastSol) {
                $aInstrData = cSpaceTags::get_sol_tags($iSol);
                foreach ($aInstrData as $sInstr => $aTags) {
                }

                self::pr_set_last_sol($iSol);
                cDebug::write("migrated highlights for sol $iSol");
                cDebug::flush();
            }

        //next migration
        self::pr_set_last_sol(self::BEFORE_MIGRATION_SOL);
        self::pr_migrate_gigas();

        cDebug::leave();
    }

    //******************************************************
    private static function pr_migrate_gigas() {
        cDebug::enter();
        cDebug::write("migrating Gigapans");
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;

        //update the state of the migration
        $oDB->put(self::MIGRATED_PHASE, self::PHASE_GIGA);

        //get the list
        $aList = cPencilNev::get_top_gigas();
        cDebug::vardump($aList);

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > self::$LastSol) {
                $aProducts = cPencilNev::get_sol_gigas($iSol);
                self::pr_set_last_sol($iSol);
                cDebug::write("migrated highlights for sol $iSol");
                cDebug::flush();
            }

        //next migration
        self::pr_set_last_sol(self::BEFORE_MIGRATION_SOL);
        self::pr_migrate_comments();

        cDebug::leave();
    }
}


cMigrateObjdata::init_obj_store_db();
