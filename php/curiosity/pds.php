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
require_once("$root/php/inc/objstore.php");
require_once("$root/php/curiosity/json.php");
require_once("$root/php/curiosity/instrument.php");
require_once("$root/php/curiosity/static.php");
require_once("$root/php/curiosity/lbl.php");


//##########################################################################
class cCuriosityPDS{
	const PDS_URL = "http://pds-imaging.jpl.nasa.gov/data/msl";
	const OBJDATA_TOP_FOLDER = "[PDS]";
	const PDS_MAP_FILENAME="[pds].map";
	const max_released = 449;
	const LBL_CACHE = 12628000; //a long time
	
	const PICNO_REGEX = "/^(\d{4})(\D{2})(\d{6})(\d{3})(\d{2})(\d{5})(\D)(.)(\d)_(\D+)/";
	const SHORT_REGEX = "/^(\d{4})(\D{2})(\d{4})(\d+)(\D)(\d)_(\D+)/";

	//*****************************************************************************
	//* see http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0005/DOCUMENT/MSL_MMM_EDR_RDR_DPSIS.PDF pg23 PICNO
	public static function explode_product($psProduct){
		$aResult = null;
		if (preg_match(self::SHORT_REGEX, $psProduct, $aMatches)){	
			$aResult = [
				"sol"=>(int)$aMatches[1],
				"instrument"=>$aMatches[2],
				"sequence" => (int) $aMatches[3],
				"product type" => $aMatches[5],
				"gop counter" => (int) $aMatches[6],
				"processing code" => $aMatches[7]
			];
		}elseif (preg_match(self::PICNO_REGEX, $psProduct, $aMatches)){
			$aResult = [
				"sol"=>(int)$aMatches[1],
				"instrument"=>$aMatches[2],
				"seqid" => (int) $aMatches[3],
				"seq line" => (int) $aMatches[3],
				"CDPID" => (int) $aMatches[6],
				"product type" => $aMatches[7],
				"gop counter" => $aMatches[8],
				"version" => (int) $aMatches[9],
				"processing code" => $aMatches[10],
			];
		}else{
			cDebug::error("not a valid MSL product: '$psProduct'");
		}
		return $aResult;
	}
	
	//**********************************************************************
	public static function convert_Msl_product($psProduct){
		//split the MSL product apart	
		$aMSLProduct = self::explode_product($psProduct);
		cDebug::vardump($aMSLProduct);

		//get the utc (whichis nearly common with the PDS catalog
		$oData = cCuriosity::search_product($psProduct);
		$utc = $oData["d"]->utc;
		cDebug::write("utc: ".$utc);
		
		//find the PDS product
		return self::pr_search_product($aMSLProduct, $utc);
	}
	
	//**********************************************************************
	//cannot search through the PDS label files on the fly, there could be thousands
	//so there has to be a separate indexing process that creates objdata
	//this function should look through that data to find the matching product
	//**********************************************************************
	private static function pr_get_objstore_Folder($psSol, $psInstrument){
		$sFolder = self::OBJDATA_TOP_FOLDER."/$psSol/$psInstrument";
		cDebug::write("PDS folder: $sFolder");
		return $sFolder;
	}
	
	//**********************************************************************
	private static function pr_search_product($poProduct, $psUTC){
		//convert the instrument to PDS instrument
		$sInstrument = self::map_MSL_Instrument($poProduct["instrument"]);
		
		//find the objstore data
		$sFolder = self::pr_get_objstore_Folder($poProduct["sol"],$sInstrument);
		$aMapping = cObjStore::get_file(OBJDATA_REALM, $sFolder, self::PDS_MAP_FILENAME);
		if (!$aMapping){
			cDebug::write("No mappings found - have you run the admin indexer?");
			return null;
		}
		
		$pID = (int) $poProduct;
		//go through objstore data matching the product identifier and the closest utc
		throw new Exception("to be done");
	}
	
	//**********************************************************************
	public static function run_indexer($psVolume){
		//-------------------------------------------------------------------------------
		//get the LBL file to understand how to parse the file 
		// eg http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0003/INDEX/EDRINDEX.LBL
		$sLBLUrl = self::PDS_URL."/$psVolume/INDEX/EDRINDEX.LBL";
		$sOutFile = "$psVolume.LBL";
		try{
			$sLBLFile = cHttp::fetch_large_url($sLBLUrl, $sOutFile, false);
		}catch(Exception $e){
			cDebug::write("$e<p>didnt work - bad volume name?");
			cDebug::write("for real volumes check  <a target='new' href='".self::PDS_URL."'>Here</a>");
			return null;
		}
		
		//-------------------------------------------------------------------------------
		//parse the lbl file
		$oLBL = new cPDS_LBL();
		$oLBL->parseFile($sLBLFile);
		cDebug::write("parse file OK");
		
		//-------------------------------------------------------------------------------
		//get the TAB file
		$sTBLFileName = $oLBL->get("^INDEX_TABLE");
		cDebug::write("TAB fie is $sTBLFileName");
		cDebug::write("fetching TAB file");
		$sTABUrl = self::PDS_URL."/$psVolume/INDEX/$sTBLFileName";
		$sOutFile = "$psVolume.TAB";
		try{
			$sTABFile = cHttp::fetch_large_url($sTABUrl, $sOutFile, false);
		}catch(Exception $e){
			cDebug::write("$e<p>TAB file doesnt Exist?");
			return null;
		}
		
		//-------------------------------------------------------------------------------
		// work through the TAB file
		cDebug::error("to be done");
		
		
		//get and cache file eg http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0003/INDEX/EDRINDEX.TAB - its a comma separated fixed field length file can be many MB
		//-- $sTABUrl = self::PDS_URL."/$psVolume/INDEX/EDRINDEX.TAB";
		
		//step through a lineat a time extracting the SOL, Instrument , Product ID , Time, product name
		//on every new sol start a new Objstore file
		//at the end of each sol and the run flush out the objstore
	}
	
	
	//**********************************************************************
	public function map_MSL_Instrument($psInstrument){
		$aMapping = [ 
			"ML"=>"MST",
			"MR"=>"MST",
			"MH"=>"MHL",
			"MD"=>"MRD",
		];
		return $aMapping[$psInstrument];
	}
}
?>