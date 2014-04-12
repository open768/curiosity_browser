<?php
require_once("inc/objstore.php");


class cImageHighlight{
	const IMGHIGH_FILENAME = "[imgbox].txt";
	const RECENT_TAG = "IMG";
	
	//********************************************************************
	static function get($psRealm, $psSol, $psInstrument, $psProduct){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = cObjStore::get_file($psRealm, $sFolder, self::IMGHIGH_FILENAME);
		return $aData;
	}

	//********************************************************************
	static function set($psRealm, $psSol, $psInstrument, $psProduct, $psTop, $psLeft, $psUser){
		//get the file from the object store to get the latest version
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = ["t"=>$psTop, "l"=>$psLeft, "u"=>$psUser];
		cObjStore::push_to_array($psRealm, $sFolder, self::IMGHIGH_FILENAME, $aData);
		return "ok";
	}
}
?>