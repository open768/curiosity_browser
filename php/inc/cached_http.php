<?php
require_once("inc/cache.php");
require_once("inc/http.php");
require_once("inc/debug.php");

// TODO use a different cache mechanism that doesnt store everything in one file
// it uses md5 hashing to work out the filename

class cCachedHttp{
	const CACHE_EXPIRY = 3600;
	private static $oCache = null;

	//*****************************************************************************
	private static function getCache(){
		if (! self::$oCache) {
			self::$oCache = new Cache();
			self::$oCache->eraseExpired();
		}
		return self::$oCache;
	}
	
	//*****************************************************************************
	public static function getCachedJson($psURL){
		
		// create cache object and erase anything expired
		$oCache = self::getCache();
		
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