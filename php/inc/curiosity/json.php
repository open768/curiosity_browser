<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("inc/cached_http.php");
require_once("inc/curiosity/instrument.php");
require_once("inc/curiosity/pds.php");


//##########################################################################
class cCuriosity{
	const SOL_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/images_sol";
	const FEED_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json";
	const SOL_CACHE = 604800;	//1 week
	const MANIFEST_CACHE = 3600;	//1 hour

	private static $Instruments, $instrument_map;
	
	
	//*****************************************************************************
	public static function search_product($psSearch){
		//split parts into variables using regular expressions
		//locate the product, make sure its not a thumbnail
		$oData = null;
		
		$aExploded = cCuriosityPDS::explode_product($psSearch);
		if ($aExploded != null){
			$sSol= $aExploded["sol"];
			cDebug::write("$psSearch is for sol '$sSol'");
			$oSolData = self::getAllSolData($sSol);
			if ($oSolData){
				$aImages = $oSolData->images;
				
				foreach ($aImages as $oItem)
					if ($oItem->itemName === $psSearch){
						cDebug::write("found it");
						$oData = ["s"=>$sSol, "d"=>$oItem];
						break;
					}
			}
		}
		
		//return the product data
		return $oData;
	}
	
	//*****************************************************************************
	public static function getNoThumbnails($psSol){
		$aData = [];
		
		$oSolData =  self::getAllSolData($psSol);
		$aImages = $oSolData->images;
		foreach ($aImages as $oItem)
			if ($oItem->sampleType !== "thumbnail")
				$aData[] = $oItem;
		return $aData;
	}
	
	//*****************************************************************************
	public static function getAllSolData($psSol){
		$url=self::SOL_URL."${psSol}.json";
		cDebug::write("Getting sol data from: ".$url);
		cCachedHttp::$CACHE_EXPIRY=self::SOL_CACHE;
		cCachedHttp::setCacheFile($psSol);
		return cCachedHttp::getCachedJson($url);
	}
	
	//*****************************************************************************
	public static function getSolData($psSol, $psInstrument){
		$oJson = self::getAllSolData($psSol);
		//cDebug::vardump($oJson);
		$oInstrument = new cInstrument($psInstrument);
		
		$aImages = $oJson->images;
		
		//---build a list of data
		foreach ($aImages as $oItem){
			$sInstrument = $oItem->instrument;
			if ($sInstrument === $psInstrument)
				$oInstrument->add($oItem);
		}
		//cDebug::vardump($oInstrument);
		return $oInstrument;

	}
	
	//*****************************************************************************
	public static function getManifest(){
		cDebug::write("Getting sol manifest from: ".self::FEED_URL);
		cCachedHttp::setCacheFile("manifest");
		cCachedHttp::$CACHE_EXPIRY=self::MANIFEST_CACHE;
		return cCachedHttp::getCachedJson(self::FEED_URL);
	}
	
	//*****************************************************************************
	public static function getSolInstrumentList($piSol){
		$aResults = [];
		
		cDebug::write("Getting instrument list for sol ".$piSol);
		$oData = self::getAllSolData($piSol);
		//cDebug::vardump($oData);
		$aImages = $oData->images;
		
		foreach ($aImages as $oItem)
			if ($oItem->sampleType !== "thumbnail")
				if (!in_array($oItem->instrument, $aResults))
					array_push($aResults, $oItem->instrument);
		
		return $aResults;
	}

	//*****************************************************************************
	public static function getProductDetails($psSol, $psInstrument, $psProduct){
		
		//check if the instrument might be an abbreviation
		$sInstr = cInstrument::getInstrumentName($psInstrument);
		
		//get the data
		$oInstrumentData = self::getSolData($psSol, $sInstr);
		$aImages=$oInstrumentData->data;
		$oDetails =null;
		
		cDebug::write("looking for $psProduct");
		$iCount = count($aImages);
		for ($i=0; $i<$iCount ; $i++){
			$aItem = $aImages[$i];
			if ($aItem["p"] === $psProduct){
				$oDetails = $aItem;
				cDebug::write("found $psProduct");
				break;
			}
		}
		
		//raise an exception if nothing found
		if (!$oDetails){
			cDebug::write("Nothing found!! for $psProduct");
			cDebug::vardump($oInstrumentData);
		}
			
		//return the result
		return [ "s"=>$psSol, "i"=>$sInstr, "p"=>$psProduct, "d"=>$oDetails, "max"=>$iCount, "item"=>$i+1];
	}

}
?>