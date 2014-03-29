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
	public static $Instruments, $instrument_map;

	//*************************************************************************
	function __construct($psInstrument) {
		$this->instrument = $psInstrument;
		$this->data = array();
	}
	
	//*************************************************************************
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
	public static function getInstrumentAbbr($psInstrument){
		self::getInstrumentList();
		return self::$instrument_map[$psInstrument]["abbr"];
	}
	
	//*****************************************************************************
	public static function getInstrumentName($psInstrument){
		self::getInstrumentList();
		return  self::$instrument_map[$psInstrument]["name"];
	}
}
