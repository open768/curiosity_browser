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
    static function migrate_mosaics() {
        cDebug::enter();
        cDebug::write("migrating mosaics");

        //******************************************************
        $fnFilter = function (SplFileInfo $poFile) {
            if ($poFile->isDir()) return true;      //allows recursion
            $sFileName = $poFile->getFileName();
            return ($sFileName === cSpaceImageMosaic::MOSAIC_COUNT_FILENAME);
        };
        //update the state of the migration
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_MOSAIC);
        $oIter = cCommonFiles::get_directory_iterator(cObjStore::get_folder_path(), $fnFilter);
        /** @var SplFileInfo $oFile */
        foreach ($oIter as  $oFile) {
            $sPath = $oFile->getPath();
            $oParentInfo = $oFile->getPathInfo();
            $sSol = $oParentInfo->getBasename();
            cDebug::write("found file: $sPath");
            cSpaceImageMosaic::get_mosaic_sol_highlight_count($sSol);
        }

        //next step
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_FACEBOOK);
        cDebug::leave();
    }

    //************************************************************
    static function delete_old_ihighlite_files() {
        cDebug::enter();

        $fnFilter = function (SplFileInfo $poFile) {
            if ($poFile->isDir()) return true;      //allows recursion
            $sFileName = $poFile->getFileName();
            return ($sFileName === "[iHighlite].txt");
        };

        $oIter = cCommonFiles::get_directory_iterator(cObjStore::get_folder_path(), $fnFilter);

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

    //************************************************************
    static function mopup_imgbox_files() {
        cDebug::enter();

        $fnFilter = function (SplFileInfo $poFile) {
            if ($poFile->isDir()) return true;      //allows recursion
            $sFileName = $poFile->getFileName();
            return ($sFileName === cSpaceImageHighlight::IMGHIGH_FILENAME);
        };

        $oIter = cCommonFiles::get_directory_iterator(cObjStore::get_folder_path(), $fnFilter);

        cDebug::extra_debug("starting directory walk");
        /** @var SplFileInfo $oFile */
        foreach ($oIter as $oFile) {
            $oParent = $oFile->getPathInfo();
            $sProduct = $oParent->getBasename();
            $oParent = $oParent->getPathInfo();
            $sInstr = $oParent->getBasename();
            $oParent = $oParent->getPathInfo();
            $sSol = $oParent->getBasename();

            cDebug::write("s:$sSol i:$sInstr p:$sProduct");
            //cSpaceImageHighlight::get_sol_highlighted_products();
            cSpaceImageHighlight::get($sSol, $sInstr, $sProduct);
            cSpaceIndex::update_indexes($sSol, $sInstr, $sProduct, 1, cSpaceIndex::HILITE_SUFFIX);
        }

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
    static function indexComments() {
        cDebug::enter();

        $fnFilter = function (SplFileInfo $poFile) {
            if ($poFile->isDir()) return true;      //allows recursion
            $sFileName = $poFile->getFileName();
            return ($sFileName === cSpaceComments::COMMENT_FILENAME);
        };

        $oIter = cCommonFiles::get_directory_iterator(cObjStore::get_folder_path(), $fnFilter);
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
class cMigrateFacebook {
    static function mopup_FB() {
        cDebug::enter();
        cDebug::write("mopping up facebook");
        //******************************************************
        $fnFilter =  function (SplFileInfo $poFile) {
            if ($poFile->isDir()) return true;      //allows recursion
            $sFileName = $poFile->getFileName();
            return (is_numeric($sFileName));
        };

        $sFolder = cObjStore::get_folder_path(cFacebook_ServerSide::FB_USER_FOLDER);
        $oIter = cCommonFiles::get_directory_iterator($sFolder, $fnFilter);
        /** @var SplFileInfo $oFile */
        foreach ($oIter as $oFile) {
            $sUserID = $oFile->getBasename();
            cDebug::write("found file $sUserID");
            $oUser = cFacebook_ServerSide::get_userDetails($sUserID);
            cFacebook_ServerSide::add_to_index($sUserID);
        }


        cDebug::leave();
    }

    //******************************************************
    static function migrate_FB() {
        cDebug::enter();
        cDebug::write("migrating facebook");

        //-------------------------------------------------------
        $aUsers = cFacebook_ServerSide::get_index();
        if ($aUsers) {
            foreach ($aUsers as $sUserId => $iCount) {
                cDebug::write("FB user: $sUserId");
                cFacebook_ServerSide::get_userDetails($sUserId);
            }
        }

        //-------------------------------------------------------
        self::mopup_FB();

        //-------------------------------------------------------
        //next step
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateObjdata::set_phase(cMigrateObjdata::PHASE_COMPLETE);
        cDebug::leave();
    }
}

//##########################################################################
class cMigrateTags {

    //******************************************************
    static function mopup_soltag_files() {
        cDebug::enter();
        //******************************************************
        $fnFilter =  function (SplFileInfo $poFile) {
            if ($poFile->isDir()) return true;      //allows recursion
            $sFileName = $poFile->getFileName();
            return ($sFileName === cSpaceTags::SOL_TAG_FILE);
        };

        $oIter = cCommonFiles::get_directory_iterator(cObjStore::get_folder_path(), $fnFilter);
        /** @var SplFileInfo $oFile */
        foreach ($oIter as $oFile) {
            $oParent = $oFile->getPathInfo();
            $sProduct = $oParent->getBasename();

            $oParent = $oParent->getPathInfo();
            $sInstr = $oParent->getBasename();

            $oParent = $oParent->getPathInfo();
            $sSol = $oParent->getBasename();

            cDebug::write("found s:$sSol i:$sInstr p:$sProduct");
            /*
            $aTags = cSpaceTags::get_product_tags($sSol, $sInstr, $sProduct);
            foreach ($aTags as $sTag => $iCount) {
                cSpaceTags::update_instr_index($sSol, $sInstr, $sProduct, $sTag);
            }
                */
        }
        cDebug::leave();
    }
    //******************************************************
    static function mopup_product_tags() {
        cDebug::enter();
        //******************************************************
        $fnFilter =  function (SplFileInfo $poFile) {
            if ($poFile->isDir()) return true;      //allows recursion
            $sFileName = $poFile->getFileName();
            return ($sFileName === cSpaceTags::PRODUCT_TAG_FILE);
        };

        $oIter = cCommonFiles::get_directory_iterator(cObjStore::get_folder_path(), $fnFilter);
        /** @var SplFileInfo $oFile */
        foreach ($oIter as $oFile) {
            $oParent = $oFile->getPathInfo();
            $sProduct = $oParent->getBasename();

            $oParent = $oParent->getPathInfo();
            $sInstr = $oParent->getBasename();

            $oParent = $oParent->getPathInfo();
            $sSol = $oParent->getBasename();

            cDebug::write("found s:$sSol i:$sInstr p:$sProduct");
            $aTags = cSpaceTags::get_product_tags($sSol, $sInstr, $sProduct);
            foreach ($aTags as $sTag => $iCount) {
                cSpaceTags::update_instr_index($sSol, $sInstr, $sProduct, $sTag);
            }
        }
        cDebug::leave();
    }

    //******************************************************
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
        self::mopup_product_tags();
        self::mopup_soltag_files();

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
        $aTags = cSpaceTagNames::get_top_tag_names();

        foreach ($aTags as $sTag => $sCount) {
            if ($sTag === "") continue;
            cDebug::write("Tag is $sTag");
            cSpaceTagNames::get_tag_name_index($sTag);
        }

        //next migration
        cMigrateObjdata::set_last_sol(cMigrateObjdata::BEFORE_MIGRATION_SOL);
        cMigrateGigas::migrate_gigas();

        cDebug::leave();
    }
}
