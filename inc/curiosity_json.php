<?php
require_once("inc/cached_http.php");

class cCuriosity{
	const SOL_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/images_sol";
	const FEED_URL = "http://mars.jpl.nasa.gov/msl-raw-images/image/image_manifest.json";

	//*****************************************************************************
	public static function getSolData($psSol){
		$url=cCuriosity::SOL_URL."${psSol}.json";
		cDebug::write("Getting sol data from: ".$url);
		return cCachedHttp::getCachedJson($url);
	}
	
	//*****************************************************************************
	public static function getManifest(){
		return cCachedHttp::getCachedJson(self::FEED_URL);
	}

	//*****************************************************************************
	public static function build_SolData($poJson){
		$aImages = $poJson->images;
		//---build a list of data
		$aInstruments = array();
		foreach ($aImages as $oItem){
			$sInstrument = $oItem->instrument;
			$sDate = $oItem->utc;
			$sUrls = $oItem->urlList;
			if ($oItem->sampleType !== "thumbnail"){
				if (!array_key_exists($sInstrument, $aInstruments))
					$aInstruments[$sInstrument] = new cInstrument($sInstrument);
				$oData = $aInstruments[$sInstrument];
				$oData->add($sInstrument, $sDate, $sUrls );
			}
		}
		return $aInstruments;
	}

}
?>