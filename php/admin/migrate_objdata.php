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
    const PHASE_FACEBOOK = "pfb";
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
        if (self::$objstoreDB == null) {
            self::$objstoreDB = new cObjStoreDB(self::OBJDB_REALM, "migrate");
        }
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
        $sPhase = self::get_phase();
        self::$LastSol = $oDB->get(self::MIGRATED_SOL);
        if (self::$LastSol == null) self::$LastSol = self::BEFORE_MIGRATION_SOL;
        self::$LastProduct = $oDB->get(self::MIGRATED_PRODUCT);

        if (cCommon::is_string_empty($sPhase)) {
            cDebug::write("migration not attempted before");
            $sPhase = null;
        }

        return $sPhase;
    }

    static function migrate() {
        cDebug::enter();
        $sPhase = self::initialise();

        cDebug::extra_debug("migration phase is '$sPhase'");

        //process according to the reached phase
        switch ($sPhase) {
            case null:
                cDebug::write("starting migration");
                cMigrateHighlights::migrate_highlights();
                break;
            case self::PHASE_HIGHLIGHTS:
                cDebug::write("completing highlight migration");
                cMigrateHighlights::migrate_highlights();
                break;
            case self::PHASE_TAG_NAMES:
                cDebug::write("completing tag name migration");
                cMigrateTags::migrate_tag_names();
                break;
            case self::PHASE_PRODUCT_TAGS:
                cDebug::write("completing product tag migration");
                cMigrateTags::migrate_product_tags();
                break;
            case self::PHASE_COMMENTS:
                cDebug::write("completing comment migration");
                cMigrateComments::migrate_comments();
                break;
            case self::PHASE_GIGA:
                cDebug::write("completing gigapan migration");
                cMigrateGigas::migrate_gigas();
                break;
            case self::PHASE_MOSAIC:
                cDebug::write("completing mosaic migration");
                cMigrateHighlights::migrate_mosaics();
                break;
            case self::PHASE_FACEBOOK:
                cDebug::write("completing facebook migration");
                cMigrateFacebook::migrate_FB();
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

    //*******************************************************************
    static function set_phase($psPhase) {
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;

        //update the state of the migration
        cDebug::write("storing  phase $psPhase");
        $oDB->put(self::MIGRATED_PHASE, $psPhase, true);
    }

    //*******************************************************************
    static function get_phase() {
        /** @var cObjStoreDB $oDB */
        $oDB = self::$objstoreDB;
        $sPhase = $oDB->get(self::MIGRATED_PHASE);
        cDebug::write("current phase is $sPhase");
        return $sPhase;
    }
}


cMigrateObjdata::init_obj_store_db();
