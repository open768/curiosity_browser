<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$phpinc/ckinc/cached_http.php");
require_once("$phpinc/ckinc/mission.php");
require_once("$root/php/curiosity/instrument.php");
require_once("$root/php/curiosity/pds.php");


//##########################################################################
class cCuriosity implements iMission{
	const SOL_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/images_sol";
	const FEED_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json";
	const SOL_CACHE = 604800;	//1 week
	const ALL_INSTRUMENTS = "All";
	const MANIFEST_CACHE = 3600;	//1 hour
	const LOCAL_THUMB_FOLDER = "images/thumbs";
	const THUMBNAIL_QUALITY = 90;
	const THUMBNAIL_HEIGHT = 120;

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
		if ($psInstrument == self::ALL_INSTRUMENTS){
			$oThumbs = self::getAllSolThumbs($psSol);
			return self::pr_match_thumbs($psSol, null, $oThumbs);
		}else{
			$oThumbs = self::getSolThumbs($psSol, $psInstrument);
			return self::pr_match_thumbs($psSol, $psInstrument, $oThumbs);
		}
	}
		
	
	private static function pr_match_thumbs($psSol, $psInstrument, $poThumbs){
		$aTData = $poThumbs->data;
		$iTCount = count($aTData);
		if ($iTCount == 0){
			cDebug::write("no thumbnails found");
		}else{
			// read the img files for the products
			cDebug::write("Found $iTCount thumbnails: ");
			$oImg = self::getSolData($psSol, $psInstrument);
			$aIData = $oImg->data;
			$iICount = count($aIData);
			
			// create a list of product Ids
			$aIProducts = [];
			foreach ($aIData as $oIItem){
				$sProduct = $oIItem["p"];
				$aIProducts[$sProduct] = 1;
			}
			$aIProductKeys = array_keys($aIProducts);
			cDebug::write("product IDs found:");
			cDebug::vardump($aIProductKeys);
			
			//try to match up thumbmnails to full products or delete
			for ($i=$iTCount-1; $i>=0 ;$i--){
				$aTItem = $aTData[$i];
				$sTProduct = $aTItem["p"];
				
				//should really check the type of product for the next bit - but ho-hum heres a *BODGE*
				$sIProduct = str_replace("I1_D", "E1_D", $sTProduct);

				if (array_key_exists($sIProduct, $aIProducts)){
					cDebug::write("product found for $sIProduct");
					$aTItem["p"] = $sIProduct;
					$aTData[$i] = $aTItem;
					continue;
				}
				
				$sRegex = str_replace("EDR_T", "EDR_.", $sTProduct);
				$aKeys = array_keys($aIProducts);
				$aMatches = preg_grep("/".$sRegex."/", $aKeys);
				if ( $aMatches ){
					$sMatch = array_values($aMatches)[0];;
					$aTItem["p"] = $sMatch;
					$aTData[$i] = $aTItem;
					continue;
				}
				
				//if all else fails: NB this'll only work for mastcam or mahli - otherwise you get a big fat exception
				cDebug::write("product not found for $sIProduct");
				try{
				$aParts = cCuriosityPDS::explode_productID($sTProduct);
				}
				catch (Exception $e){					continue;				}
				
				
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
			
			if (count($aTData) == 0){
				cDebug::write("no thumbnails matched");
				cDebug::vardump($aIProducts);
			}
				
			//TBD
			//store the final version of the data			
			$aValues = array_values($aTData);
			$poThumbs->data = $aValues;
		}
		
		return ["s"=>$psSol, "i"=>$psInstrument, "d"=>$poThumbs];
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
		cDebug::write("Getting all sol data from: ".$sUrl);
		$oCache = new cCachedHttp();
		$oCache->CACHE_EXPIRY=self::SOL_CACHE;
		return $oCache->getCachedJson($sUrl);
	}
	
	//*****************************************************************************
	public static function clearSolDataCache($psSol){
		cDebug::write("clearing sol cache : ".$psSol);
		$oCache = new cCachedHttp();
		$sUrl=self::SOL_URL."${psSol}.json";
		$oCache->deleteCachedURL($sUrl);
	}
	
	//*****************************************************************************
	public static function getAllSolThumbs($psSol){
		return self::getSolData($psSol, null,true);
	}
	
	//*****************************************************************************
	public static function getSolThumbs($psSol, $psInstrument){
		return self::getSolData($psSol, $psInstrument,true);
	}
	
	//*****************************************************************************
	public static function getSolData($psSol, $psInstrument=null, $pbThumbs=false){
		$oJson = self::getAllSolData($psSol);
		$oInstrument = new cInstrument($psInstrument);
		
		$aImages = $oJson->images;
		
		//---build a list of data
		foreach ($aImages as $oItem){
			$sInstrument = $oItem->instrument;
			if (( !$psInstrument) || ($sInstrument === $psInstrument))
				$oInstrument->add($oItem, $pbThumbs);
		}
		return $oInstrument;
	}
	
	//*****************************************************************************
	private static function pr_getManifest(){
		cDebug::write("Getting sol manifest from: ".self::FEED_URL);
		$oCache = new cCachedHttp();
		$oCache->CACHE_EXPIRY=self::MANIFEST_CACHE;
		return $oCache->getCachedJson(self::FEED_URL);
	}
	
	//*****************************************************************************
	public static function getSolList(){
		//get the manifest
		$oManifest = self::pr_getManifest();
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
	public static function getLocalThumbnail($psSol, $psInstrument, $psProduct){
		global $root;
		$sRelative = self::LOCAL_THUMB_FOLDER."/$psSol/$psInstrument/$psProduct.jpg";
		$sPath = "$root/$sRelative";
		
		if (!file_exists($sPath)){
			
			$oDetails = self::getProductDetails($psSol, $psInstrument, $psProduct);
			if ($oDetails["d"]){
				$sImgUrl = $oDetails["d"]["i"];
				
				//----------------------------------------------------------------------
				cDebug::write("fetching $sImgUrl");
				$oHttp = new cHttp();
				$oMSLImg = $oHttp->fetch_image($sImgUrl);	
				cDebug::write("got image");
				cDebug::write("<img src='$sImgUrl'>");
				$iWidth = imagesx($oMSLImg);
				$iHeight = imagesy($oMSLImg);
				$iNewWidth = $iWidth * self::THUMBNAIL_HEIGHT / $iHeight;

				//----------------------------------------------------------------------
				cDebug::write("new Width is $iNewWidth .. resizing");
				$oThumb = imagecreatetruecolor($iNewWidth, self::THUMBNAIL_HEIGHT);
				imagecopyresampled($oThumb, $oMSLImg, 0, 0, 0, 0, $iNewWidth, self::THUMBNAIL_HEIGHT, $iWidth, $iHeight);		
				$sFolder = dirname($sPath);
				if (!file_exists($sFolder)){
					cDebug::write("creating folder: $sFolder");
					mkdir($sFolder, 0755, true); //folder needs to readable by apache
				}
				imagejpeg($oThumb, $sPath, self::THUMBNAIL_QUALITY );
				
				//----------------------------------------------------------------------
				imagedestroy($oMSLImg);
				imagedestroy($oThumb);
			}
			else
				$sRelative = null; //no image found
		}
		
		cDebug::write("<img src='../../$sRelative'>");
		$oDetails = [ "s"=>$psSol, "i"=>$psInstrument, "p"=>$psProduct, "u"=>$sRelative];
		return $oDetails;
	}

	//*****************************************************************************
	private static function pr__GetInstrumentImageDetails( $paInstrumentImages, $psProduct){
		$oDetails =null;

		cDebug::write("looking for $psProduct");
		$iCount = count($paInstrumentImages);
		for ($i=0; $i<$iCount ; $i++){
			$aItem = $paInstrumentImages[$i];
			if ($aItem["p"] === $psProduct){
				$oDetails = $aItem;
				cDebug::write("found $psProduct");
				break;
			}
		}
		//if nothing found

		if ($oDetails == null )	
			return null;
		else
			return 	["d"=>$oDetails, "max"=>$iCount, "item"=>$i+1];
	}
	
	//*****************************************************************************
	public static function getProductDetails($psSol, $psInstrument, $psProduct){
		
		//check if the instrument might be an abbreviation
		$sInstr = cInstrument::getInstrumentName($psInstrument);
		$aOutput = ["s"=>$psSol, "i"=>$sInstr, "p"=>$psProduct, "d"=>null, "max"=>null, "item"=>null, "migrate"=>null];
;
		//get the data
		$oInstrumentData = self::getSolData($psSol, $sInstr);
		$aInstrumentImages=$oInstrumentData->data;
		$oDetails = self::pr__GetInstrumentImageDetails($aInstrumentImages, $psProduct);
		
		
		//if nothing found look for similar products
		if ($oDetails === null){
			cDebug::write("Nothing found!! for $psProduct");
			$oPDSData = cCuriosityPDS::search_pds($psSol, $psInstrument, $psProduct);
			if ($oPDSData == null){
				cDebug::write("drawn a complete blank!");
			}else{
				cDebug::vardump($oPDSData );
				$aOutput["migrate"] = $oPDSData["p"];
				//start the migration
			}
		}else{
			$aOutput["d"] = $oDetails["d"];
			$aOutput["max"] = $oDetails["max"];
			$aOutput["item"] = $oDetails["item"];
		}

		
			
		//return the result
		return $aOutput;
	}
}
?>