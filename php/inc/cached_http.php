<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("inc/cache.php");
require_once("inc/http.php");
require_once("inc/debug.php");

// TODO use a different cache mechanism that doesnt store everything in one file

class cCachedHttp{
	const CACHE_EXPIRY = 3600;
	private static $oCache = null;
	private static $sCacheFile = null;
	public static $fileHashing = true;


	//*****************************************************************************
	public static function setCacheFile($psCacheFile){	
		self::$sCacheFile = $psCacheFile;	
		self::$fileHashing = false;
	}
	
	//*****************************************************************************
	private static function getCacheObj(){
		if (! self::$oCache) {
			$oCache = new Cache();
			if (self::$sCacheFile)
				$oCache->setCache(self::$sCacheFile);
			$oCache->_hash_filename = self::$fileHashing;
			
			$oCache->eraseExpired();
			self::$oCache = $oCache;
		}
		return self::$oCache;
	}
	
	//*****************************************************************************
	public static function getCachedJson($psURL){
		
		// create cache object and erase anything expired
		$oCache = self::getCacheObj();
		
		//get the curiosity data
		if ($oCache->isCached($psURL)){
			$sSerial = $oCache->retrieve($psURL);
			$oResponse = unserialize($sSerial);
			cDebug::write("cached");
		}else{
			
			//----------fetch the sol details
			$oResponse = cHttp::getJson($psURL);
			cDebug::write("no cached ");
			$sSerial = serialize($oResponse);
			$oCache->store($psURL, $sSerial, self::CACHE_EXPIRY);
		}
		
		return $oResponse;
	}

}
?>