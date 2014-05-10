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
require_once("$root/php/inc/indexes.php");
require_once("$root/php/curiosity/json.php");
require_once("$root/php/curiosity/instrument.php");
require_once("$root/php/inc/static.php");
require_once("$root/php/pds/lbl.php");
require_once("$root/php/pds/pdsreader.php");


//##########################################################################
class cCuriosityPDS{
	const PDS_URL = "http://pds-imaging.jpl.nasa.gov/data/msl";
	const OBJDATA_TOP_FOLDER = "[PDS]";
	const PDS_MAP_FILENAME="[pds].map";
	const max_released = 449;
	const LBL_CACHE = 12628000; //a long time
	
	const PICNO_REGEX = "/^(\d{4})(\D{2})(\d{6})(\d{3})(\d{2})(\d{5})(\D)(.)(\d)_(\D+)/";
	const SHORT_REGEX = "/^(\d{4})(\D{2})(\d{4})(\d+)(\D)(\d)_(\D+)/";
	private static $PDS_COL_NAMES = ["PATH_NAME", "FILE_NAME", "MSL:INPUT_PRODUCT_ID", "INSTRUMENT_ID", "PLANET_DAY_NUMBER", "PRODUCT_ID"];
	const PDS_SUFFIX = "PDS";


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
	public static function index_everything($psRealm){
		for ($i=1; $i<6;$i++){
			if ($i>1)	self::run_indexer($psRealm, "MSLMHL_000$i", "EDRINDEX");
			self::run_indexer($psRealm, "MSLMRD_000$i", "EDRINDEX");
			self::run_indexer($psRealm, "MSLMST_000$i", "EDRINDEX");
		}
		
		self::run_indexer($psRealm, "MSLNAV_0XXX", "INDEX");
		self::run_indexer($psRealm, "MSLNAV_1XXX", "INDEX");
		self::run_indexer($psRealm, "MSLHAZ_0XXX", "INDEX");
		self::run_indexer($psRealm, "MSLHAZ_1XXX", "INDEX");
		self::run_indexer($psRealm, "MSLHAZ_1XXX", "INDEX");
		
		//mosaics are different!
		//self::run_indexer($psRealm, "MSLMOS_1XXX", "INDEX");
	}
	
	//**********************************************************************
	public static function run_indexer($psRealm, $psVolume, $psIndex){
		//-------------------------------------------------------------------------------
		//get the LBL file to understand how to parse the file 
		// eg http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0003/INDEX/EDRINDEX.LBL
		$sLBLUrl = self::PDS_URL."/$psVolume/INDEX/$psIndex.LBL";
		$sOutFile = "$psVolume.LBL";
		$oLBL = cPDS_Reader::fetch_lbl($sLBLUrl, $sOutFile);
		
		//-------------------------------------------------------------------------------
		//get the TAB file
		$sTBLFileName = $oLBL->get("^INDEX_TABLE");
		$sTABUrl = self::PDS_URL."/$psVolume/INDEX/$sTBLFileName";
		$sOutFile = "$psVolume.TAB";
		$sTABFile = cPDS_Reader::fetch_tab($sTABUrl, $sOutFile);
		
		//-------------------------------------------------------------------------------
		//find out where the product files are:
		$aData = cPDS_Reader::parse_TAB($oLBL, $sTABFile, self::$PDS_COL_NAMES);
		self::create_index_files($psRealm, self::PDS_URL."/$psVolume/", $aData, false);
		
		cDebug::write("Done OK");
	}
	
	//**********************************************************************
	private static function create_index_files($psRealm, $psUrlPrefix, $paTabData, $pbReplace){
		$aData = [];
		
		//build the index
		foreach ($paTabData as $aLine){
			$sSol = $aLine["PLANET_DAY_NUMBER"];
			$sInstr = $aLine["INSTRUMENT_ID"];
			$sMSL_product = $aLine["INSTRUMENT_ID"];
			$sPDS_product = $aLine["PRODUCT_ID"];
			$sUrl = $psUrlPrefix.$aLine["PATH_NAME"].$aLine["FILE_NAME"];
			
			if (!array_key_exists ($sSol, $aData)) $aData[$sSol] = [];
			if (!array_key_exists ($sInstr, $aData[$sSol])) $aData[$sSol][$sInstr] = [];
			$aData[$sSol][$sInstr][$sMSL_product] = $sUrl;
		}
		
		//write out the files
		foreach ($aData as  $sSol=>$aSolData)	{
			foreach ($aSolData as $sInstr=>$aInstrData)
				cObjStore::put_file($psRealm, "[pds]/$sSol/$sInstr", cIndexes::get_filename(cIndexes::INSTR_PREFIX, self::PDS_SUFFIX), $aInstrData);				
		}
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