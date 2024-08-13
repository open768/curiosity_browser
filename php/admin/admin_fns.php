<?php


class cAdminfunctions {
    static function pr_del_ihigh_check(SplFileInfo $poFile) {
        if ($poFile->isDir()) return true;      //allows recursion
        $sFileName = $poFile->getFileName();
        return ($sFileName === "[iHighlite].txt");
    }

    static function delete_ihighlite_files() {
        cDebug::enter();
        cPageOutput::prevent_buffering();

        //find all files named "[iHighlite].txt"
        $sFolder = realpath(cObjStore::$rootFolder);
        cDebug::extra_debug("looking in $sFolder");

        //************************************************************
        $oIter = cCommonFiles::get_directory_iterator(
            $sFolder,
            function (SplFileInfo $po) {
                return self::pr_del_ihigh_check($po);
            }
        );

        /** @var  SplFileInfo */
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
    static function indexComments() {
        cDebug::enter();
        //scan the objdata directory for comments files to determine the SOL and instrument
        $sFolder = realpath(cObjStore::$rootFolder);
        cDebug::write("scanning  folder {$sFolder} for comments files");

        //
        cDebug::error("not implemented");
        cDebug::leave();
    }
}
