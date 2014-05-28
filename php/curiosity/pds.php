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
require_once("$root/php/curiosity/pdsindexer.php");
require_once("$root/php/inc/static.php");
require_once("$root/php/pds/lbl.php");
require_once("$root/php/pds/pdsreader.php");


//##########################################################################
class cCuriosityPDS{
	const OBJDATA_TOP_FOLDER = "[pds]";
	const PDS_MAP_FILENAME="[pds].map";
	const max_released = 449;
	const LBL_CACHE = 12628000; //a long time
	
	const PICNO_REGEX = "/^(\d{4})(\D{2})(\d{6})(\d{3})(\d{2})(\d{5})(\D)(.)(\d)_(\D+)/";
	const SHORT_REGEX = "/^(\d{4})(\D{2})(\d{4})(\d{3})(\d{3})(\D)(\d)_(\D+)/";
	const PICNO_FORMAT = "%04d%s%06d%03d%0d2%s.%d_%s";
	const PDS_SUFFIX = "PDS";


	//*****************************************************************************
	//* see http://pds-imaging.jpl.nasa.gov/data/msl/MSLMST_0005/DOCUMENT/MSL_MMM_EDR_RDR_DPSIS.PDF pg23 PICNO
	public static function explode_product($psProduct){
		$aResult = null;
		if (preg_match(self::SHORT_REGEX, $psProduct, $aMatches)){	
			$aResult = [
				"sol"=>(int)$aMatches[1],
				"instrument"=>$aMatches[2],
				"seqid" => (int) $aMatches[3],
				"seq line" => (int)$aMatches[4],
				"CDPID" => (int)$aMatches[5],
				"product type" => $aMatches[6],
				"gop counter" => (int) $aMatches[7],
				"processing code" => $aMatches[8]
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
	private static function get_MSL_regex($psSearch){
		$aExplode = self::explode_product($psProduct);
		##TBD;
	}
	
	//**********************************************************************
	private static function pr__get_pds_regex($psProduct){
		//split the MSL product apart	
		$aMSLProduct = self::explode_product($psProduct);
		cDebug::vardump($aMSLProduct);

		$PICNO_FORMAT = "/%04d%2s%06d%03d%s%s%02d_%s/";
		$sPDSProduct = sprintf(	$PICNO_FORMAT, 
			$aMSLProduct["sol"],
			$aMSLProduct["instrument"] , 
			$aMSLProduct["seqid"] ,
			$aMSLProduct["seq line"],
			"\d{7}",
			$aMSLProduct["product type"] , 
			$aMSLProduct["gop counter"] , 
			$aMSLProduct["processing code"] 
		);
		
		cDebug::write("PDS: $sPDSProduct");
		return $sPDSProduct;
	}
	
	//**********************************************************************
	private static function pr__get_objstore_Folder($psSol, $psInstrument){
		$sFolder = self::OBJDATA_TOP_FOLDER."/$psSol/$psInstrument";
		cDebug::write("PDS folder: $sFolder");
		return $sFolder;
	}
	
	//**********************************************************************
	public static function get_pds_data($psSol, $psInstrument){
		$sFolder = self::pr__get_objstore_Folder($psSol,$psInstrument);
		return cObjStore::get_file(OBJDATA_REALM, $sFolder, cIndexes::get_filename(cIndexes::INSTR_PREFIX, self::PDS_SUFFIX));
	}
	
	//**********************************************************************
	public static function search_pds($psSol, $psInstument, $psProduct){
		
		cDebug::write("looking for $psSol, $psInstument, $psProduct");
		
		//---- convert to PDS format ------------------
		$sPDSRegex = self::pr__get_pds_regex($psProduct);
		
		//-----retrive PDS stuff ----------------
		$aData = self::get_pds_data($psSol, $psInstument );
		if ($aData === null){
			cDebug::write("no pds data found");
			return null;
		}	
			
		//debug
		$oMatch = null;
		$sProducts = "<br>";
		foreach ($aData as $sKey=>$oData){
			$sProducts.="$sKey<br>";
			if ( preg_match($sPDSRegex, $sKey)){
				cDebug::write("got a match with $sKey");
				$oMatch=$oData;
				break;
			}
		}
		
		cDebug::write("no matches found with $sKey");
		cDebug::write("<pre>$sProducts</pre>");
		return $oMatch;
	}
	
	//**********************************************************************
	public function map_MSL_Instrument($psInstrument){
		$aMapping = [ 
			"ML"=>"MST",
			"MR"=>"MST",
			"MH"=>"MHL",
			"MD"=>"MRD"
		];
		return $aMapping[$psInstrument];
	}
	
	//**********************************************************************
	public function get_pds_product($psUrl){
		$oData = cPDS_Reader::fetch_lbl($psUrl);
		//extract what we want from the file
		
		//delete the PDS file - we dont need all of it
		return $oData;
	}
}
?>