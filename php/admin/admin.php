<?php

function del_ihigh_check(SplFileInfo $poFile) {
    if ($poFile->isDir()) return true;      //allows recursion
    $sFileName = $poFile->getFileName();
    return ($sFileName === "[iHighlite].txt");
}

class cAdminfunctions {
    static function delete_ihighlite_files() {
        cDebug::enter();
        cPageOutput::prevent_buffering();

        //find all files named "[iHighlite].txt"
        $sFolder = realpath(cObjStore::$rootFolder);
        cDebug::extra_debug("looking in $sFolder");

        $oDirIter = new RecursiveDirectoryIterator($sFolder, FilesystemIterator::SKIP_DOTS); //tree walks the directory
        $oFilterIter = new RecursiveCallbackFilterIterator(
            $oDirIter,
            function ($po) {
                return del_ihigh_check($po);
            }
        );

        $oIter = new RecursiveIteratorIterator($oFilterIter);
        /** @var  SplFileInfo */
        $oFile = null;
        foreach ($oIter as $oFile) {
            $sPath = $oFile->getpathname();
            cDebug::write("deleting $sPath");
            unlink($sPath);
        }

        cDebug::leave();
    }
}
