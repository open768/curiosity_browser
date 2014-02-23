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
			array_push(	$this->data, [
				"du"=>$poCuriosityData->utc, 
				"dm"=>$poCuriosityData->lmst, 
				"i"=>$poCuriosityData->urlList, 
				"p"=>$poCuriosityData->itemName, 
				"l"=>$poCuriosityData->pdsLabelUrl
			]);
	}
}

//##########################################################################
class cCuriosity{
	const SOL_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/images_sol";
	const FEED_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json";
	private static $Instruments, $instrument_map;
	
	//*****************************************************************************
	public  static function getAllSolData($psSol){
		$url=cCuriosity::SOL_URL."${psSol}.json";
		cDebug::write("Getting sol data from: ".$url);
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
		cDebug::write("Getting sol manifest  from: ".self::FEED_URL);
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
			if  (!in_array($oItem->instrument, $aResults))
				array_push($aResults, $oItem->instrument);
		
		return $aResults;
	}
	
	//*****************************************************************************
	public static function getInstrumentList(){
		if (! self::$Instruments){
			// build instrument list
			self::$Instruments = [ 
				["name"=>"CHEMCAM_RMI",	"colour"=>"red",	"abbr"=>"CC",	"caption"=>"Chemistry Camera"],
				["name"=>"FHAZ_LEFT_B",	"colour"=>"green",	"abbr"=>"FL",	"caption"=>"Left Front Hazard Avoidance Camera"],
				["name"=>"FHAZ_RIGHT_B","colour"=>"blue",	"abbr"=>"FR",	"caption"=>"Right Front Hazard Avoidance Camera"],
				["name"=>"MAST_LEFT",	"colour"=>"white",	"abbr"=>"ML",	"caption"=>"MastCam Left"],
				["name"=>"MAST_RIGHT",	"colour"=>"yellow",	"abbr"=>"MR",	"caption"=>"MastCam Right"],
				["name"=>"MAHLI",		"colour"=>"cyan",	"abbr"=>"HL",	"caption"=>"Mars Hand Lens Imager"],
				["name"=>"MARDI",		"colour"=>"magenta","abbr"=>"DI",	"caption"=>"Mars Descent Imager"],
				["name"=>"NAV_LEFT_B",	"colour"=>"orange",	"abbr"=>"NL",	"caption"=>"Left Navigation Camera"],
				["name"=>"NAV_RIGHT_B",	"colour"=>"black",	"abbr"=>"NR",	"caption"=>"Right Navigation Camera"],
				["name"=>"RHAZ_LEFT_B",	"colour"=>"pink",	"abbr"=>"RL",	"caption"=>"Left Rear Hazard Avoidance Camera"],
				["name"=>"RHAZ_RIGHT_B","colour"=>"purple",	"abbr"=>"RR",	"caption"=>"Right Rear Hazard Avoidance Camera"]
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
		$oInstrumentData = cCuriosity::getSolData($psSol, $sInstr);
		$aImages=$oInstrumentData->data;
		$oDetails =null;
		
		cDebug::write("looking for $psProduct");
		foreach ($aImages as $aItem)
			if ($aItem["p"] === $psProduct){
				$oDetails = $aItem;
				break;
			}else
				cDebug::write("not ".$aItem["p"]);
		
		return [ "s"=>$psSol, "i"=>$sInstr, "p"=>$psProduct, "d"=>$oDetails];
	}

}
?>