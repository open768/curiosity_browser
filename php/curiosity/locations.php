<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 -2015

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$phpinc/ckinc/cached_http.php");
require_once("$phpinc/ckinc/objstore.php");


//##########################################################################
class cCuriosityLocations{
	const LOCATIONS_XML = "http://mars.jpl.nasa.gov/msl-raw-images/locations.xml";
	const LOCATIONS_CACHE = 3600;	//1 hour
	const TOP_FOLDER = "[locations]";
	const DRIVES_FOLDER = "drives";
	const SITES_FOLDER = "sites";
	const SOLS_FOLDER = "sols";
	const BOUNDS_INDEX_FILE="[bounds]";
	const DRIVE_INDEX_FILE = "[dindex].txt";
	const SITES_INDEX_FILE = "[sindex].txt";

	//*****************************************************************************
	public static function parseLocations(){
		$bFirst = true;
		$iCount = 0;
		
		// get the XML file
		$oCache = new cCachedHttp();
		$oCache->$show_progress = true;
		$oXML = $oCache->getXML(self::LOCATIONS_XML);
		
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
		$sFolder = self::TOP_FOLDER."/".self::DRIVES_FOLDER;
		self::pr__WriteFiles($sFolder, $aDrives);
		
		// write out the sites files
		cDebug::write("writing sites files");
		$sFolder = self::TOP_FOLDER."/".self::SITES_FOLDER;
		self::pr__WriteFiles($sFolder, $aSites);

		// write out the sol files
		cDebug::write("writing sol files");
		$sFolder = self::TOP_FOLDER."/".self::SOLS_FOLDER;
		self::pr__WriteFiles($sFolder, $aSols, false);
		
		cDebug::write("Done");
	}
	
	//***********************************************************************
	public static function getSiteIndex(){
		return cObjStore::get_file( self::TOP_FOLDER, self::SITES_INDEX_FILE);		
	}
	//***********************************************************************
	public static function getAllSiteBounds(){
		return cObjStore::get_file( self::TOP_FOLDER."/".self::SITES_FOLDER, self::BOUNDS_INDEX_FILE);
	}
	
	//***********************************************************************
	public static function getSite($piSite){
		return cObjStore::get_file( self::TOP_FOLDER."/".self::SITES_FOLDER, $piSite);		
	}
	//***********************************************************************
	public static function getSiteBounds($psSite){
		$piSite = (int) $psSite;
		$aIndex = cObjStore::get_file( self::TOP_FOLDER."/".self::SITES_FOLDER, self::BOUNDS_INDEX_FILE);
		return $aIndex[$piSite];
	}

	//***********************************************************************
	public static function getSol($psSol){
		return cObjStore::get_file( self::TOP_FOLDER."/".self::SOLS_FOLDER, $psSol);		
	}
	
	//***********************************************************************
	public static function getSolBounds($psSol){
		$aIndex =cObjStore::get_file( self::TOP_FOLDER."/".self::SOLS_FOLDER, self::BOUNDS_INDEX_FILE);		
		return $aIndex[$psSol];
	}
	
	//***********************************************************************
	public static function getDrive($psDrive){
		return cObjStore::get_file( self::TOP_FOLDER."/".self::DRIVES_FOLDER, $psDrive);		
	}
	
	//***********************************************************************
	public static function getDriveBounds($psDrive){
		$piDrive = (int) $psDrive;
		$aIndex = cObjStore::get_file( self::TOP_FOLDER."/".self::DRIVES_FOLDER, self::BOUNDS_INDEX_FILE);
		return $aIndex[$piDrive];
	}
	
	//***********************************************************************
	private static function pr__GetBoundingBox($paItems){
		$bFirst=true;
		
		foreach ($paItems as $aItem){
			$fLat = (float) $aItem["lat"];
			$fLong = (float) $aItem["lon"];
			if ($bFirst){
				$bFirst	=false;
				$fLat1= $fLat; 
				$fLat2 = $fLat;
				$fLong1= $fLong; 
				$fLong2= $fLong;
			}else{
				if ($fLat < $fLat1) 
					$fLat1 = $fLat;
				elseif ($fLat > $fLat2) 
					$fLat2 = $fLat;

				if ($fLong < $fLong1) 
					$fLong1 = $fLong;
				elseif ($fLong > $fLong2) 
					$fLong2 = $fLong;
			}
		}
		
		return ["lat1"=>$fLat1, "long1"=>$fLong1, "lat2"=>$fLat2, "long2"=>$fLong2];
	}

	//***********************************************************************
	private static function pr__WriteFiles( $psFolder, $paData, $pbStrval=true){
		$aBoundIndex= [];
		ksort($paData);
		foreach ($paData as $sKey=>$aItems){
			if ($pbStrval) $sKey = strval($sKey);
			$aBounds = self::pr__GetBoundingBox($aItems);
			$aBoundIndex[$sKey] = $aBounds;
			cObjStore::put_file( $psFolder, strval($sKey), $aItems);		
			usleep(1000); // be nice to the server sleep for a 1/1000s
		}
		cObjStore::put_file( $psFolder, self::BOUNDS_INDEX_FILE, $aBoundIndex);		
	}
	
}
?>