<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$root/php/inc/cached_http.php");
require_once("$root/php/inc/objstore.php");


//##########################################################################
class cCuriosityLocations{
	const LOCATIONS_XML = "http://mars.jpl.nasa.gov/msl-raw-images/locations.xml";
	const LOCATIONS_CACHE = 3600;	//1 hour
	const TOP_FOLDER = "[locations]";
	const DRIVES_FOLDER = "drives";
	const SITES_FOLDER = "sites";
	const SOLS_FOLDER = "sols";
	const DRIVE_INDEX_FILE = "[dindex].txt";
	const SITES_INDEX_FILE = "[sindex].txt";

	//*****************************************************************************
	public static function parseLocations(){
		$bFirst = true;
		$iCount = 0;
		
		// get the XML file
		cCachedHttp::$CACHE_EXPIRY=self::LOCATIONS_CACHE;
		$oXML = cHttp::getXML(self::LOCATIONS_XML);
		
		// create the data structure of SOLs versus locations
		$aDrives = [];
		$aSites = [];
		$aSols = [];
		$aSitesIndex = [];
		$aDrivesIndex = [];
		
		cDebug::write("parsing");
		foreach ($oXML->children() as $oItem){
			$iCount++;
			$iSite = (int) $oItem->site;
			$iStartSol = (int) $oItem->startSol;
			$iEndSol = (int) $oItem->endSol;
			$iDrive = (int) $oItem->drive;
			$aItem = cCommon::serialise($oItem);
			
			if ($bFirst){
				cDebug::vardump($aItem);
				$bFirst = false;
			}
			
			for ($iSol=$iStartSol; $iSol<=$iEndSol; $iSol++){
				$sSol = strval($iSol);
				
				if (!array_key_exists ($iDrive, $aDrives)) $aDrives[$iDrive] = [];
				if (!array_key_exists ($iSite, $aSites)) $aSites[$iSite] = [];
				if (!array_key_exists ($sSol, $aSols)) $aSols[$sSol] = [];
				
				$aDrives[$iDrive][] = $aItem;
				$aSites[$iSite][] = $aItem;
				$aSitesIndex[$iSite] =1;
				$aDrivesIndex[$iDrive] =1;

				$aSols[$sSol][] = $aItem;
			}
		}
		cDebug::write("done parsing $iCount entries");
		
		// write out the index files
		cDebug::write("writing index files");
		ksort($aDrivesIndex);
		cObjStore::put_file( self::TOP_FOLDER, self::DRIVE_INDEX_FILE, $aDrivesIndex);		
		ksort($aSitesIndex);
		cObjStore::put_file( self::TOP_FOLDER, self::SITES_INDEX_FILE, $aSitesIndex);		
		
		// write out the drive files
		cDebug::write("writing drive files");
		ksort($aDrives);
		$sFolder = self::TOP_FOLDER."/".self::DRIVES_FOLDER;
		foreach ($aDrives as $iDrive=>$aItems)
			cObjStore::put_file( $sFolder, strval($iDrive), $aItems);		
		
		// write out the sites files
		cDebug::write("writing sites files");
		ksort($aSites);
		$sFolder = self::TOP_FOLDER."/".self::SITES_FOLDER;
		foreach ($aSites as $iSite=>$aItems)
			cObjStore::put_file( $sFolder, strval($iSite) , $aItems);		
		
		//write out the sol files
		cDebug::write("writing sol files");
		ksort($aSols);
		$sFolder = self::TOP_FOLDER."/".self::SOLS_FOLDER;
		foreach ($aSols as $sSol=>$aItems)
			cObjStore::put_file( $sFolder , $sSol, $aItems);		
			
		cDebug::write("Done");
	}
	
	//***********************************************************************
	public static function getSiteIndex(){
		return cObjStore::get_file( self::TOP_FOLDER, self::SITES_INDEX_FILE);		
	}
	//***********************************************************************
	public static function getSite($psSite){
		return cObjStore::get_file( self::TOP_FOLDER."/".self::SITES_FOLDER, $psSite);		
	}
}
?>