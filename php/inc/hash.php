<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$root/php/inc/debug.php");
require_once("$root/php/inc/gz.php");

class cHash{
	const HASH_FOLDER = "[cache]/[hash]";
	const FOREVER = -1;
	public static $CACHE_EXPIRY = 3600;  //(seconds)
	public static $show_filenames = false;
	
	
	//************************************************************************
	public static function hash($psUrl){
		//unique md5 - impossible that the reverse hash is the same as hash
		return  md5($psUrl).md5(strrev($psUrl));
	}
	
	//************************************************************************
	public static function delete_hash($psHash){
		if (self::exists($psHash)){
			$sFile = self::getPath($psHash);
			cDebug::write("deleting hash $psHash");
			unlink($sFile);
		}
	}
	
	//************************************************************************
	public static function get_folder($psHash){
		global $root;
		
		$d1=substr($psHash,0,2);
		$d2=substr($psHash,2,2);
		return "$root/".self::HASH_FOLDER."/$d1/$d2";
	}
	
	//************************************************************************
	public static function exists($psHash){
		$sFile = self::getPath($psHash);
		$bExists = file_exists($sFile);
		cDebug::write("hash: $bExists - $psHash");
		
		// check the expiry date on the file - if its too old zap it
		if ($bExists && (self::$CACHE_EXPIRY <> self::FOREVER)){
			$iDiff = time() - filemtime($sFile) - self::$CACHE_EXPIRY;
			if ($iDiff > 0){
				cDebug::write("hash file expired $psHash - $iDiff seconds ago");
				unlink($sFile);
				$bExists = false;
			}
		}
		
		return $bExists;
	}
	
	//************************************************************************
	public static function getPath($psHash){
		$sFolder = self::get_folder($psHash);
		$sFile = "$sFolder/$psHash";
		if 	(self::$show_filenames) cDebug::write("hash_file: $sFile");

		return $sFile;
	}
	
	//************************************************************************
	public static function make_hash_folder( $psHash){
		$sFolder = self::get_folder($psHash);
		if (!is_dir($sFolder)){
			cDebug::write("making folder: for hash $psHash");
			mkdir($sFolder, 0700, true);
		}
		return $sFolder;
	}
	
	//************************************************************************
	public static function put_obj( $psHash, $poObj, $pbOverwrite=false){
		$sFile = self::getPath($psHash);
		if (!$pbOverwrite && self::exists($psHash))
			cDebug::error("hash exists: $psHash");
		else{
			self::make_hash_folder($psHash);
			cGzip::writeObj($sFile, $poObj);
		}
	}

	//************************************************************************
	public static function get_obj( $psHash){
		$oReponse = null;
		if (self::exists($psHash)){
			cDebug::write("exists in cache");
			$sFile = cHash::getPath($psHash);
			$oResponse = cGzip::readObj($sFile);
		}else
			cDebug::write("doesnt exist in cache");
		
		return $oResponse;
	}
}
