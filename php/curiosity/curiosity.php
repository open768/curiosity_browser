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
require_once("$root/php/curiosity/instrument.php");
require_once("$root/php/curiosity/pds.php");


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
		
		$aExploded = cCuriosityPDS::explode_productID($psSearch);
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
	public static function getThumbnails($psSol, $psInstrument){
		
		//get the thumbnails and the non thumbnails
		$oThumbs = self::getSolData($psSol, $psInstrument, true);
		$aTData = $oThumbs->data;
		$iTCount = count($aTData);
		if ($iTCount == 0){
			cDebug::write("no thumbnails found");
		}else{
			// read the img files
			cDebug::write("Found $iTCount thumbnails: ");
			$oImg = self::getSolData($psSol, $psInstrument, false);
			$aIData = $oImg->data;
			$iICount = count($aIData);
			
			// index by the product ID
			$aIProducts = [];
			foreach ($aIData as $oIItem)
				$aIProducts[$oIItem["p"]] = 1;
			$aIProductKeys = array_keys($aIProducts);
			
			//try to match them up or delete
			for ($i=$iTCount-1; $i>=0 ;$i--){
				$aTItem = $aTData[$i];
				$sTProduct = $aTItem["p"];
				$sIProduct = str_replace("I1_D", "E1_D", $sTProduct);
				if (array_key_exists($sIProduct, $aIProducts)){
					$aTItem["p"] = $sIProduct;
					$aTData[$i] = $aTItem;
				}else{
					$aParts = cCuriosityPDS::explode_productID($sTProduct);
					$sPartial = sprintf( "/%04d%s%06d%03d/", $aParts["sol"],	$aParts["instrument"] , $aParts["seqid"] ,$aParts["seq line"], $aParts["CDPID"]);
					$aMatches = preg_grep($sPartial,$aIProductKeys);
					if (count($aMatches) > 0 ){
						$aValues = array_values($aMatches);
						cDebug::write("thumbnail $sTProduct matches ".$aValues[0]);
						$aTItem["p"] = $aValues[0];
						$aTData[$i] = $aTItem;
					}else{
						cDebug::write("Thumbnail didnt match $sPartial");
						unset($aTData[$i]);
					}
				}
			}
			
			if (count($aTData) == 0){
				cDebug::write("no thumbnails matched");
				cDebug::vardump($aIProducts);
			}
				
			//TBD
			//store the final version of the data			
			$aValues = array_values($aTData);
			$oThumbs->data = $aValues;
		}
		
		return ["s"=>$psSol, "i"=>$psInstrument, "d"=>$oThumbs];
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
		$sUrl=self::SOL_URL."${psSol}.json";
		cDebug::write("Getting sol data from: ".$sUrl);
		cCachedHttp::$CACHE_EXPIRY=self::SOL_CACHE;
		return cCachedHttp::getCachedJson($sUrl);
	}
	
	//*****************************************************************************
	public static function clearSolDataCache($psSol){
		cDebug::write("clearing sol cache : ".$psSol);
		$sUrl=self::SOL_URL."${psSol}.json";
		cCachedHttp::deleteCachedURL($sUrl);
	}
	
	//*****************************************************************************
	public static function getSolData($psSol, $psInstrument, $pbThumbs=false){
		$oJson = self::getAllSolData($psSol);
		$oInstrument = new cInstrument($psInstrument);
		
		$aImages = $oJson->images;
		
		//---build a list of data
		foreach ($aImages as $oItem){
			$sInstrument = $oItem->instrument;
			if ($sInstrument === $psInstrument)
				$oInstrument->add($oItem, $pbThumbs);
		}
		return $oInstrument;
	}
	
	//*****************************************************************************
	public static function getManifest(){
		cDebug::write("Getting sol manifest from: ".self::FEED_URL);
		cCachedHttp::$CACHE_EXPIRY=self::MANIFEST_CACHE;
		return cCachedHttp::getCachedJson(self::FEED_URL);
	}
	
	//*****************************************************************************
	public static function getSolList(){
		//get the manifest
		$oManifest = self::getManifest();
		$aSols = $oManifest->sols;
		$aData = [];
		
		//extract sols - should be cached ideally!
		foreach ($aSols as $oSol){
			$iSol = $oSol->sol;
			$sDate = $oSol->last_updated;
			array_push( $aData, ["sol"=>$iSol, "date"=>$sDate]);
		}
		
		return $aData;
	}
	
	//*****************************************************************************
	public static function nextSol($piSol, $piIncrement){
		$aSols = self::getSolList();
		$iCount = count($aSols);
		
		for ($i = 0; $i<$iCount; $i++)
			if ($aSols[$i]["sol"] == $piSol){
				$i2 = $i + $piIncrement;
				if (($i2>=0) && ($i2<$iCount))
					return $aSols[$i2]["sol"];
			}
		
		return null;
	}
	
	//*****************************************************************************
	public static function getSolInstrumentList($piSol){
		$aResults = [];
		
		cDebug::write("Getting instrument list for sol ".$piSol);
		$oData = self::getAllSolData($piSol);
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
		}
			
		//return the result
		return [ "s"=>$psSol, "i"=>$sInstr, "p"=>$psProduct, "d"=>$oDetails, "max"=>$iCount, "item"=>$i+1];
	}
}
?>