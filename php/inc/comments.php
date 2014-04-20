<?php
require_once("inc/objstore.php");
class cComments{
	const COMMENT_FILENAME = "[comment].txt";
	
	//********************************************************************
	static function get($psRealm, $psSol, $psInstrument, $psProduct){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aTags = cObjStore::get_file($psRealm, $sFolder, self::COMMENT_FILENAME);
		return $aTags;
	}

	//********************************************************************
	static function set($psRealm, $psSol, $psInstrument, $psProduct, $psComment, $psUser){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$psComment = strip_tags($psComment);

		$aData = ["c"=>$psComment, "u"=>$psUser];
		$aData = cObjStore::push_to_array($psRealm, $sFolder, self::COMMENT_FILENAME, $aData);
		
		// update SOL
		// update SOL/Instrument
		// update recent
		return $aData;
	}
	//
}
?>