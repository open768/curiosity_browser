<?php
require_once("inc/objstore.php");


class cImageHighlight{
	const IMGHIGH_FILENAME = "[imgbox].txt";
	
	//********************************************************************
	static function get($psRealm, $psFolder){
		$aData = cObjStore::get_file($psRealm, $psFolder, self::IMGHIGH_FILENAME);
		return $aData;
	}

	//********************************************************************
	static function set($psRealm, $psFolder, $psTop, $psLeft){
	
		//get the file from the object store to get the latest version
		$aData = cObjStore::get_file($psRealm, $psFolder, self::IMGHIGH_FILENAME);
		if (!$aData) $aData=[];
		
		$aData[] = ["t"=>$psTop, "l"=>$psLeft];
		
		//put the file back
		cObjStore::put_file($psRealm, $psFolder, self::IMGHIGH_FILENAME, $aData);
		
		return "ok";
	}
}
?>