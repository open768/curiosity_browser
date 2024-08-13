<?php


class cAdminfunctions {
    //************************************************************
    static function pr_ihigh_filter(SplFileInfo $poFile) {
        if ($poFile->isDir()) return true;      //allows recursion
        $sFileName = $poFile->getFileName();
        return ($sFileName === "[iHighlite].txt");
    }

    //************************************************************
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
                return self::pr_ihigh_filter($po);
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

    /**
     * adds to index comments from files on disk
     * 
     * @return never 
     */
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
