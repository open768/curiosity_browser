<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$root/php/inc/http.php");
require_once("$root/php/inc/debug.php");
require_once("$root/php/inc/hash.php");

class cCachedHttp{
	public static $CACHE_EXPIRY = 3600;  //(seconds)
	private static $oCache = null;
	private static $sCacheFile = null;
	public static $fileHashing = true;


	//*****************************************************************************
	public static function deleteCachedURL($psURL){
		$sHash = cHash::hash($psURL);
		cHash::delete_hash($sHash);
	}
	
	//*****************************************************************************
	public static function getCachedUrl($psURL){	
		return self::pr_do_get($psURL, false);
	}

	//*****************************************************************************
	public static function getCachedJson($psURL){	
		return self::pr_do_get($psURL, true);
	}
	
	//*****************************************************************************
	public static function pr_do_get($psURL, $pbJson){

		$sHash = cHash::hash($psURL);
		cHash::$CACHE_EXPIRY = self::$CACHE_EXPIRY;
		$oResponse = null;
		
		if (cHash::exists($sHash)){
			cDebug::extra_debug("cached");
			$oResponse = cHash::get_obj($sHash);
		}else{
			cDebug::extra_debug("not cached");
			if ($pbJson)
				$oResponse = cHttp::getJson($psURL);
			else
				$oResponse = cHttp::fetch_url($psURL);
				
			if ($oResponse) 
				cHash::put_obj($sHash, $oResponse, true);
		}
		
		return $oResponse;
	}

}
?>