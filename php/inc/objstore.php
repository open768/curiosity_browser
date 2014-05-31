<?php
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% OBJSTORE - simplistic store objects without a database!
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

require_once("$root/php/inc/gz.php");

cObjStore::$rootFolder= "$root/[objdata]";

class cObjStore{
	public static $rootFolder = "";
	
	//#####################################################################
	//# PRIVATES
	//#####################################################################
	private static function pr_get_folder_name($psRealm, $psFolder){
		$sOut = self::$rootFolder."/$psRealm";
		if ($psFolder) $sOut.= "/$psFolder";
		return $sOut;
	}
	
	//#####################################################################
	//# PUBLIC
	//#####################################################################
	static function kill_file($psRealm, $psFolder, $psFile){
		$folder = self::pr_get_folder_name($psRealm, $psFolder);
		$file = "$folder/$psFile";
		if (file_exists($file)){
			unlink($file);
			cDebug::write("deleted file $file");
		}
	}
	
	//********************************************************************
	static function get_file($psRealm, $psFolder, $psFile){
		$aData = null;

		cDebug::write("looking for file:$psFile in folder:$psFolder in realm:$psRealm");
		$sFolder = self::pr_get_folder_name($psRealm, $psFolder);
		if (!is_dir($sFolder)){
			cDebug::write("no objstore data at all in folder: $psFolder");
			return $aData;
		}
		
		$sFile = "$sFolder/$psFile";
		cDebug::write("File: $sFile");
		if (file_exists($sFile))
			$aData = cGzip::readObj($sFile);
		
		return $aData;
	}
	
	//********************************************************************
	static function put_file($psRealm, $psFolder, $psFile, $poData){
			
		//check that the folder exists
		$folder = self::pr_get_folder_name($psRealm, $psFolder);
		if (!file_exists($folder)){
			cDebug::write("creating folder: $folder");
			mkdir($folder, 0700, true);
		}
		
		//write out the file
		$sFile = "$folder/$psFile";
		cDebug::write("writing to: $sFile");
		
		cGzip::writeObj($sFile, $poData);
	}
	
	//********************************************************************
	static function push_to_array($psRealm, $psFolder, $psFile, $poData){
		//always get the latest file
		$aData = self::get_file($psRealm, $psFolder, $psFile);
		//update the data
		if (!$aData) $aData=[];
		$aData[] = $poData;
		//put the data back
		self::put_file($psRealm, $psFolder, $psFile, $aData);
		
		return $aData;
	}
}
?>