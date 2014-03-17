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

//##########################################################################
class cInstrument{
	public $instrument;
	public $data;
	public $product;
	
	function __construct($psInstrument) {
		$this->instrument = $psInstrument;
		$this->data = array();
	}
	
	public function add($poCuriosityData){
		//dont add thumbnail products
		if ($poCuriosityData->sampleType !== "thumbnail")
		{
			//cDebug::vardump($poCuriosityData);
			$aData = [
				"du"=>$poCuriosityData->utc, 
				"dm"=>$poCuriosityData->lmst, 
				"i"=>$poCuriosityData->urlList, 
				"p"=>$poCuriosityData->itemName, 
				"data"=>$poCuriosityData
			];
			if (array_key_exists("pdsLabelUrl", $poCuriosityData))
				$aData["l"] = $poCuriosityData->pdsLabelUrl;
			else
				$aData["l"] = "UNK";

			
			array_push(	$this->data, $aData);
		}
	}
}

//##########################################################################
class cCuriosity{
	const SOL_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/images_sol";
	const FEED_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json";

	private static $Instruments, $instrument_map;
	
	//*****************************************************************************
	public static function search_product($psSearch){
		//split parts into variables using regular expressions
		//locate the product, make sure its not a thumbnail
		$oData = null;
		
		if (preg_match("/^[0]*(\d+)\w+\d+/", $psSearch, $matches)){
			$sSol= $matches[1];
			cDebug::write("$psSearch is for sol $sSol");
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
	public static function getInstrumentList(){
		if (! self::$Instruments){
			// build instrument list
			self::$Instruments = [ 
				["name"=>"CHEMCAM_RMI",	"colour"=>"red",	"abbr"=>"CC",	"caption"=>"Chemistry "],
				["name"=>"FHAZ_LEFT_A",	"colour"=>"green",	"abbr"=>"FLa",	"caption"=>"Left Front Hazard Avoidance (A)"],
				["name"=>"FHAZ_RIGHT_A","colour"=>"steelblue",	"abbr"=>"FRa",	"caption"=>"Right Front Hazard Avoidance (A)"],
				["name"=>"FHAZ_LEFT_B",	"colour"=>"lime",	"abbr"=>"FLb",	"caption"=>"Left Front Hazard Avoidance (B)"],
				["name"=>"FHAZ_RIGHT_B","colour"=>"blue",	"abbr"=>"FRb",	"caption"=>"Right Front Hazard Avoidance (B)"],
				["name"=>"MAST_LEFT",	"colour"=>"white",	"abbr"=>"ML",	"caption"=>"MastCam Left"],
				["name"=>"MAST_RIGHT",	"colour"=>"yellow",	"abbr"=>"MR",	"caption"=>"MastCam Right"],
				["name"=>"MAHLI",		"colour"=>"cyan",	"abbr"=>"HL",	"caption"=>"Mars Hand Lens Imager"],
				["name"=>"MARDI",		"colour"=>"magenta","abbr"=>"DI",	"caption"=>"Mars Descent Imager"],
				["name"=>"NAV_LEFT_A",	"colour"=>"tomato",	"abbr"=>"NLa",	"caption"=>"Left Navigation (A)"],
				["name"=>"NAV_RIGHT_A",	"colour"=>"gray",	"abbr"=>"NRa",	"caption"=>"Right Navigation (A)"],
				["name"=>"NAV_LEFT_B",	"colour"=>"orange",	"abbr"=>"NLb",	"caption"=>"Left Navigation (B)"],
				["name"=>"NAV_RIGHT_B",	"colour"=>"black",	"abbr"=>"NRb",	"caption"=>"Right Navigation (B)"],
				["name"=>"RHAZ_LEFT_A",	"colour"=>"pink",	"abbr"=>"RLa",	"caption"=>"Left Rear Hazard Avoidance (A)"],
				["name"=>"RHAZ_RIGHT_A","colour"=>"purple",	"abbr"=>"RRa",	"caption"=>"Right Rear Hazard Avoidance (A)"],
				["name"=>"RHAZ_LEFT_B",	"colour"=>"fuschia",	"abbr"=>"RLb",	"caption"=>"Left Rear Hazard Avoidance (B)"],
				["name"=>"RHAZ_RIGHT_B","colour"=>"indigo",	"abbr"=>"RRb",	"caption"=>"Right Rear Hazard Avoidance (B)"]
			];
			// build associative array
			self::$instrument_map = [];
			foreach (self::$Instruments as $oInstr){
				self::$instrument_map[$oInstr["name"]] = $oInstr;
				self::$instrument_map[$oInstr["abbr"]] = $oInstr;
			}
			
		}
		return self::$Instruments;
	}
	
	//*****************************************************************************
	public static function getInstrumentAbbr($psInstr){
		self::getInstrumentList();
		return self::$instrument_map[$psInstr]["abbr"];
	}


	//*****************************************************************************
	public static function getProductDetails($psSol, $psInstrument, $psProduct){
		
		//cehck if the instrument might be an abbreviation
		self::getInstrumentList();
		$sInstr = self::$instrument_map[$psInstrument]["name"];
		
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
			
		//return the result
		return [ "s"=>$psSol, "i"=>$sInstr, "p"=>$psProduct, "d"=>$oDetails, "max"=>$iCount, "item"=>$i+1];
	}

}
?>