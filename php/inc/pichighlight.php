<?php
require_once("inc/objstore.php");
require_once("inc/indexes.php");

class cImageHighlight{
	const IMGHIGH_FILENAME = "[imgbox].txt";
	const SOL_HIGH_FILE = "[sHighlite].txt";
	const INSTR_HIGH_FILE = "[iHighlite].txt";
	const TOP_SOL_HIGH_FILE = "[tHighlite].txt";
	
	//######################################################################
	//# GETTERS functions
	//######################################################################
	static function get($psRealm, $psSol, $psInstrument, $psProduct){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = cObjStore::get_file($psRealm, $sFolder, self::IMGHIGH_FILENAME);
		return $aData;
	}
	
	//######################################################################
	//# UPDATE functions
	//######################################################################
	static function set($psRealm, $psSol, $psInstrument, $psProduct, $psTop, $psLeft, $psUser){
		//get the file from the object store to get the latest version
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = ["t"=>$psTop, "l"=>$psLeft, "u"=>$psUser];
		cObjStore::push_to_array($psRealm, $sFolder, self::IMGHIGH_FILENAME, $aData);
		cIndexes::update_indexes($psRealm, $psSol, $psInstrument, $psProduct, 1, self::TOP_SOL_HIGH_FILE, self::SOL_HIGH_FILE, self::INSTR_HIGH_FILE);
		return "ok";
	}
	
	static function reindex($psRealm){
		cIndexes::reindex($psRealm, 1, self::TOP_SOL_HIGH_FILE, self::SOL_HIGH_FILE, self::INSTR_HIGH_FILE, self::IMGHIGH_FILENAME );
	}
	
}
?>