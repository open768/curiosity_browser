<?php
require_once("$root/php/inc/objstore.php");
require_once("$root/php/inc/indexes.php");

class cImageHighlight{
	const INDEX_SUFFIX = "Highlite";
	const IMGHIGH_FILENAME = "[imgbox].txt";
	
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
		cObjStore::push_to_array($psRealm, $sFolder, self::IMGHIGH_FILENAME, $aData); //store highlight
		cIndexes::update_indexes($psRealm, $psSol, $psInstrument, $psProduct, 1, self::INDEX_SUFFIX);
		return "ok";
	}
	
	//######################################################################
	//# ADMIN functions
	//######################################################################
	static function reindex($psRealm){
		cIndexes::reindex($psRealm, 1, self::INDEX_SUFFIX );
	}
	
	static function kill_highlites($psRealm, $psSol, $psInstr, $psProduct, $psWhich){
		$sFolder="$psSol/$psInstr/$psProduct";
		cObjStore::kill_file($psRealm, $sFolder, self::IMGHIGH_FILENAME);
		cDebug::write("now reindex the image highlihgts");
	}

	
}
?>