<?php

class cMigrateHighlights {
    //******************************************************
    static function migrate_highlights() {
        cDebug::enter();
        cDebug::write("migrating Highlights");

        //update the state of the migration
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_HIGHLIGHTS);

        //get the list
        $aList = cSpaceImageHighlight::get_top_index();

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > cMigrateObjdata::$LastSol) {
                $aProducts = cSpaceImageHighlight::get_all_highlights($iSol);
                cMigrateObjdata::set_last_sol($iSol);
                cDebug::write("migrated highlights for sol $iSol");
            }

        //next migration
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateTags::migrate_product_tags();
        cDebug::leave();
    }

    //******************************************************
    static function pr_mosaic_filter(SplFileInfo $poFile) {
        if ($poFile->isDir()) return true;      //allows recursion
        $sFileName = $poFile->getFileName();
        return ($sFileName === "[moscount].txt");
    }

    //******************************************************
    static function migrate_mosaics() {
        cDebug::enter();
        cDebug::write("migrating mosaics");

        //update the state of the migration
        $sFolder = realpath(cObjStore::$rootFolder);
        cDebug::write("directory is $sFolder");
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_MOSAIC);
        $oIter = cCommonFiles::get_directory_iterator(
            $sFolder,
            function ($poFileInfo) {
                return self::pr_mosaic_filter($poFileInfo);
            }
        );
        /** @var SplFileInfo $oFile */
        foreach ($oIter as  $oFile) {
            $sPath = $oFile->getPath();
            $oParentInfo = $oFile->getPathInfo();
            $sSol = $oParentInfo->getBasename();
            cDebug::write("found file: $sPath");
            cSpaceImageHighlight::get_mosaic_sol_highlight_count($sSol);
        }

        //next step
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_COMPLETE);
        cDebug::leave();
    }
}

//##########################################################################
class cMigrateComments {
    //******************************************************
    static function migrate_comments() {
        cDebug::enter();
        cDebug::write("migrating comments");

        //update the state of the migration
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_COMMENTS);
        //get the list
        self::indexComments();

        //next migration
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateHighlights::migrate_mosaics();

        cDebug::leave();
    }

    //******************************************************
    static function pr_comment_filter(SplFileInfo $poFile) {
        if ($poFile->isDir()) return true;      //allows recursion
        $sFileName = $poFile->getFileName();
        return ($sFileName === "[comment].txt");
    }

    //******************************************************
    static function indexComments() {
        cDebug::enter();

        //scan the objdata directory for comments files to determine the SOL and instrument
        $sFolder = realpath(cObjStore::$rootFolder);
        cDebug::write("scanning  folder {$sFolder} for comments files");

        $oIter = cCommonFiles::get_directory_iterator(
            $sFolder,
            function ($poFile) {
                return self::pr_comment_filter($poFile);
            }
        );
        /** @var SplFileInfo $oFile */
        foreach ($oIter as $oFile) {
            //-------- find the sol, instrument and product
            $oParent = $oFile->getPathInfo();
            $sProduct = $oParent->getBasename();

            $oParent = $oParent->getPathInfo();
            $sInstr = $oParent->getBasename();

            $oParent = $oParent->getPathInfo();
            $sSol = $oParent->getBasename();

            if (!is_numeric($sSol)) continue;
            if (!is_numeric($sInstr)) continue;
            cDebug::write("s:{$sSol} i:{$sInstr} p:{$sProduct}");

            // --------- migrate the comment itself (can only do this once so do it right)
            $aComments = cSpaceComments::get($sSol, $sInstr, $sProduct);
            foreach ($aComments as $oComment)
                //---------- add comment to index (can only do this once so do it right)
                cSpaceComments::add_to_index($sSol, $sInstr, $sProduct);
        }

        cDebug::leave();
    }
}

//##########################################################################
class cMigrateGigas {
    static function migrate_gigas() {
        cDebug::enter();
        cDebug::write("migrating Gigapans");

        //update the state of the migration
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_GIGA);

        //get the list
        $aList = cPencilNev::get_top_gigas();

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > cMigrateObjdata::$LastSol) {
                $aProducts = cPencilNev::get_sol_gigas($iSol);
                cMigrateObjdata::set_last_sol($iSol);
                cDebug::write("done gigas for sol $iSol");
                cDebug::flush();
            }

        //next migration
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateComments::migrate_comments();

        cDebug::leave();
    }
}

//##########################################################################
class cMigrateTags {
    //******************************************************
    static function pr_filter_product_tag(SplFileInfo $poFile) {
        if ($poFile->isDir()) return true;      //allows recursion
        $sFileName = $poFile->getFileName();
        return ($sFileName === cSpaceTags::PRODUCT_TAG_FILE);
    }

    static function mop_up_product_tags() {
        $oIter = cCommonFiles::get_directory_iterator(
            cObjStore::$rootFolder,
            function ($poFileInfo) {
                return self::pr_filter_product_tag($poFileInfo);
            }
        );
        /** @var SplFileInfo $oFile */
        foreach ($oIter as $oFile) {
            $sPath = $oFile->getPathname();
            cDebug::write("found $sPath");
            cDebug::error("stop");
        }
    }

    static function migrate_product_tags() {
        cDebug::enter();
        cDebug::write("migrating product Tags");

        //update the state of the migration
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_PRODUCT_TAGS);

        //get the list
        $aList = cSpaceTags::get_top_sol_index();

        //iterate through the list
        foreach ($aList as $iSol => $iCount)
            if ($iSol > cMigrateObjdata::$LastSol) {
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

                cMigrateObjdata::set_last_sol($iSol);
                cDebug::write("done  sol $iSol");
            }

        //mop up tag files
        self::mop_up_product_tags();

        //next migration
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateTags::migrate_tag_names();

        cDebug::leave();
    }


    //***************************************************************
    static function migrate_tag_names() {
        cDebug::enter();

        //update the state of the migration
        cDebug::write("migrating Tag names");
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_TAG_NAMES);

        //
        $aTags = cSpaceTags::get_top_tag_names();

        foreach ($aTags as $sTag => $sCount) {
            if ($sTag === "") continue;
            cDebug::write("Tag is $sTag");
            cSpaceTags::get_tag_name_index($sTag);
        }

        //next migration
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateGigas::migrate_gigas();

        cDebug::leave();
    }
}

//##########################################################################
class cAdminfunctions {
    //************************************************************
    static function pr_ihigh_filter(SplFileInfo $poFile) {
        if ($poFile->isDir()) return true;      //allows recursion
        $sFileName = $poFile->getFileName();
        return ($sFileName === "[iHighlite].txt");
    }

    static function delete_ihighlite_files() {
        cDebug::enter();

        //find all files named "[iHighlite].txt"
        $sFolder = realpath(cObjStore::$rootFolder);
        cDebug::extra_debug("looking in $sFolder");

        //************************************************************
        $oIter = cCommonFiles::get_directory_iterator(
            $sFolder,
            function (SplFileInfo $po) {
                return self::pr_ihigh_filter($po);
            }
        );

        /** @var SplFileInfo $oFile */
        $oFile = null;
        cDebug::extra_debug("starting directory walk");
        foreach ($oIter as $oFile) {
            $sPath = $oFile->getpathname();
            cDebug::write("deleting $sPath");
            @unlink($sPath);
        }

        cDebug::leave();
    }
}
