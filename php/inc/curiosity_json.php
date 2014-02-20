<?php
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
	private static $Instruments;
	
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
		if (! self::$Instruments)
			self::$Instruments = [ 
				["name"=>"CHEMCAM_RMI","caption"=>"Chemistry Camera"],
				["name"=>"FHAZ_LEFT_B","caption"=>"Left Front Hazard Avoidance Camera"],
				["name"=>"FHAZ_RIGHT_B","caption"=>"Right Front Hazard Avoidance Camera"],
				["name"=>"MAST_LEFT","caption"=>"MastCam Left"],
				["name"=>"MAST_RIGHT","caption"=>"MastCam Right"],
				["name"=>"MAHLI","caption"=>"Mars Hand Lens Imager"],
				["name"=>"MARDI","caption"=>"Mars Descent Imager"],
				["name"=>"NAV_LEFT_B","caption"=>"Left Navigation Camera"],
				["name"=>"NAV_RIGHT_B","caption"=>"Right Navigation Camera"],
				["name"=>"RHAZ_LEFT_B","caption"=>"Left Rear Hazard Avoidance Camera"],
				["name"=>"RHAZ_RIGHT_B","caption"=>"Right Rear Hazard Avoidance Camera"]
			];
		return self::$Instruments;
	}
	
	//*****************************************************************************
	public static function getProductDetails($psSol, $psInstrument, $psProduct){
		
		$oInstrumentData = cCuriosity::getSolData($psSol, $psInstrument);
		$aImages=$oInstrumentData->data;
		$oDetails =null;
		
		foreach ($aImages as $aItem)
			if ($aItem["p"] === $psProduct){
				$oDetails = $aItem;
				break;
			}
		
		return $oDetails;
	}

}
?>