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
require_once("$root/php/inc/static.php");


class cPDS_Reader{
	//**********************************************************************
	public static function fetch_lbl( $psUrl, $psOutFile){
		cDebug::write("fetching $psUrl");
		$sLBLFile = cHttp::fetch_large_url($psUrl, $psOutFile, false);
		cDebug::write("output filename is $sLBLFile");
		
		//------------------------------------------------------------------
		//parse the lbl file
		$oLBL = new cPDS_LBL();
		$oLBL->parseFile($sLBLFile);
		cDebug::write("parse file OK");
		
		return $oLBL;
	}
	
	//**********************************************************************
	public static function fetch_tab( $psUrl, $psOutFile){
		return cHttp::fetch_large_url($psUrl, $psOutFile, false);
	}
	
	//**********************************************************************
	public static function parse_TAB( $poLBL, $psTabFile, $aColNames){
		// get the columns to be used for indexing
		$aCols = self::pr__get_tab_columns($poLBL, $aColNames);
		//cDebug::vardump($aCols);
		
		//open the tab file
		$aOut = [];
		$iCount = 0;
		$fHandle = fopen($psTabFile, 'r');
		while(!feof($fHandle)){
			$sLine = fgets($fHandle);
			if (trim($sLine) == "") continue;
			$aLine = self::pr__extract_tab_line($sLine, $aCols);
			$aOut[] = $aLine;
			$iCount ++;
		}
		fclose($fHandle);
		
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
		$oINDEXLBL = $poLBL->get("INDEX_TABLE");
		//cDebug::write("column names:");
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