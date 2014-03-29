<?php
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% OBJSTORE - simplistic store objects without a database!
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class cObjStore{
	static $rootFolder = "../objdata";
	
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
	static function get_file($psRealm, $psFolder, $psFile){
		$aData = null;

		cDebug::write("looking for file:$psFile in folder:$psFolder in realm:$psRealm");
		$folder = self::pr_get_folder_name($psRealm, $psFolder);
		if (!is_dir($folder)){
			cDebug::write("no obstore data at all in folder: $psFolder");
			return $aData;
		}
		
		$file = "$folder/$psFile";
		cDebug::write("File: $file");
		if (file_exists($file)){
			$sText = file_get_contents($file);
			$aData = unserialize($sText);
		}
		
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
		$file = "$folder/$psFile";
		cDebug::write("writing to: $file");
		
		$sText = serialize($poData);
		file_put_contents($file, $sText, LOCK_EX);
	}
}
?>