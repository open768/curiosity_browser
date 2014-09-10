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
	private static function pr_get_folder_path( $psFolder){
		$sOut = self::$rootFolder."/".OBJDATA_REALM;
		if ($psFolder) $sOut.= "/$psFolder";
		return $sOut;
	}
	
	//#####################################################################
	//# PUBLIC
	//#####################################################################
	static function kill_file( $psFolder, $psFile){
		$num_args = func_num_args();
		if ($num_args != 2) cDebug::error("kill_file: incorrect number of arguments - expected 2 got $num_args ");

		$folder = self::pr_get_folder_path( $psFolder);
		$file = "$folder/$psFile";
		if (file_exists($file)){
			unlink($file);
			cDebug::write("deleted file $file");
		}
	}
	
	//********************************************************************
	static function get_file( $psFolder, $psFile){
		$aData = null;
		
		$num_args = func_num_args();
		if ($num_args != 2) cDebug::error("get_file: incorrect number of arguments - expected 2 got $num_args ");
		
		//cDebug::write("looking for file:$psFile in folder:$psFolder");
		$sFolder = self::pr_get_folder_path( $psFolder);
		if (!is_dir($sFolder)){
			cDebug::write("no objstore data at all in folder: $psFolder");
			return $aData;
		}
		
		$sFile = "$sFolder/$psFile";
		//cDebug::write("File: $sFile");
		if (file_exists($sFile))
			$aData = cGzip::readObj($sFile);
		
		return $aData;
	}
	
	//********************************************************************
	static function put_file( $psFolder, $psFile, $poData){
			
		$num_args = func_num_args();
		if ($num_args != 3) cDebug::error("put_file: incorrect number of arguments - expected 3 got $num_args ");
		
		//check that the folder exists
		$folder = self::pr_get_folder_path( $psFolder);
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
	static function push_to_array( $psFolder, $psFile, $poData){
		//always get the latest file
		$aData = self::get_file( $psFolder, $psFile);
		//update the data
		if (!$aData) $aData=[];
		$aData[] = $poData;
		//put the data back
		self::put_file( $psFolder, $psFile, $aData);
		
		return $aData;
	}
}
?>