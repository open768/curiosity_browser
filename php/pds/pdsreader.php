<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$root/php/inc/debug.php");
require_once("$root/php/inc/http.php");
require_once("$root/php/inc/objstore.php");
require_once("$root/php/inc/gz.php");
require_once("$root/php/static/static.php");
require_once("$root/php/inc/common.php");
require_once("$root/php/inc/hash.php");
require_once("$root/php/pds/lbl.php");


class cPDS_Reader{
	public static $force_delete = false;
	public static $columns_object_name = "INDEX_TABLE";
	
	//**********************************************************************
	public static function fetch_volume_lbl( $psBaseUrl, $psVolume, $psIndex){
		$sLBLUrl = $psBaseUrl."/$psVolume/INDEX/$psIndex.LBL";
		$sOutFile = "$psVolume.LBL";
		
		cDebug::write("fetching volume LBL $sLBLUrl");
		$sFile = cHttp::large_url_path($sOutFile);
		if (!file_exists("$sFile.gz")){
			cDebug::write("$sFile.gz doesnt exist" );
			
			$sLBLFile = cHttp::fetch_large_url($sLBLUrl, $sOutFile, false);
			cDebug::write("fetched to $sLBLFile" );
			
			cDebug::write("compressing $sLBLFile");
			cGzip::compress_file($sLBLFile);
			cDebug::write("output filename is $sLBLFile");
		}
		
		//------------------------------------------------------------------
		//parse the lbl file
		return self::parse_LBL("$sFile.gz");
	}
	
	//**********************************************************************
	public static function fetch_lbl( $psUrl){
		global $root;
		//create a unique hash for the 
		cHash::$CACHE_EXPIRY = cHash::FOREVER;		//cache forever
		//cHash::$show_filenames = true;

		$sHashUrl = cHash::hash($psUrl);
		$sHashLBL = cHash::hash("PDSOBJ-$psUrl");
		
		if (self::$force_delete){
			cDebug::write("deleting cached file for $psUrl");
			cHash::delete_hash($sHashLBL);
			self::$force_delete = false;
		}

		
		if (!cHash::exists($sHashLBL)){
			//--- fetch the raw LBL file
			$sFolder = cHash::make_hash_folder($sHashUrl);
			$sUrlFilename = cHash::getPath($sHashUrl);
			cHttp::fetch_to_file($psUrl, $sUrlFilename, false);
			
			//---parse into a LBL obj
			cDebug::write("Parsing http");
			$oLBL = new cPDS_LBL();
			$oLBL->parseFile($sUrlFilename);
			
			//--- store LBL obj
			cHash::put_obj($sHashLBL, $oLBL);
			
			//--- delete url hash
			unlink($sUrlFilename);
		}else{
			cDebug::write("file exists on disk $sHashLBL");
			$oLBL = cHash::get_obj($sHashLBL);
		}
		//$oLBL->__dump();
		return $oLBL;
	}
	
	
	//**********************************************************************
	public static function parse_LBL( $psFilename){
		$oLBL = new cPDS_LBL();
		$oLBL->parseFile($psFilename);
		cDebug::write("parse file OK");
		return $oLBL;
	}
	
	//**********************************************************************
	public static function fetch_tab( $psUrl, $psOutFile){
		$sFile = cHttp::large_url_path($psOutFile);
		if (!file_exists("$sFile.gz")){
			$sFile = cHttp::fetch_large_url($psUrl, $psOutFile, false);
			cGzip::compress_file($sFile);
		}else
			cDebug::write("file exists on disk $sFile.gz");

		return "$sFile.gz";
	}
	
	//**********************************************************************
	public static function parse_TAB( $poLBL, $psTabFile, $aColNames){

		//bolster available memory - TODO chunk the TAB into files and return the file count
		ini_set("memory_limit","1G");
		
		// get the columns to be used for indexing
		$aCols = self::pr__get_tab_columns($poLBL, $aColNames);
		//cDebug::vardump($aCols);
		
		//open the tab file
		$aOut = [];
		$iCount = 0;
		$fHandle = gzopen($psTabFile, 'rb');
		while(!gzeof($fHandle)){
			$sLine = gzgets($fHandle);
			if (trim($sLine) == "") continue;
			$aLine = self::pr__extract_tab_line($sLine, $aCols);
			$aOut[] = $aLine;
			$iCount ++;
		}
		gzclose($fHandle);
		
		cDebug::write("Processed $iCount lines");
		//cDebug::vardump($aOut);

		return $aOut;
	}
	
	//######################################################################
	//# PRIVATES
	//######################################################################
	private static function pr__get_tab_columns($poLBL, $paColNames){
		$aResult = [];
		//get the column names of interest
		$oINDEXLBL = $poLBL->get(self::$columns_object_name);
		if (!$oINDEXLBL){
			//cDebug::write("column names:");
			$poLBL->__dump();
			cDebug::error("couldnt find column ". self::$columns_object_name);
			return;
		}
		
		//$oINDEXLBL->dump_array("COLUMN", "NAME");
		$aCols = $oINDEXLBL->get("COLUMN");
		
		foreach ($paColNames as $sName){
			foreach ($aCols as $oCol)
				if ($oCol->get("NAME") === $sName){
					$aResult[$sName] = $oCol;
					continue;
				}
		}
		return $aResult;
	}
	
	//**********************************************************************
	private static function pr__extract_tab_line($psLine, $paCols){
		$aOut = [];
		foreach ($paCols as $sName=>$oColLBL){
			$iStart = $oColLBL->get("START_BYTE");
			$iCount = $oColLBL->get("BYTES");
			
			$sExtract = substr($psLine, $iStart-1, $iCount);
			$aOut[$sName] = trim($sExtract);
		}
		return $aOut;
	}
}
?>