<?php
require_once("inc/objstore.php");
class cComments{
	const COMMENT_FILENAME = "[comment].txt";
	
	//********************************************************************
	static function get($psRealm, $psFolder){
		$aTags = cObjStore::get_file($psRealm, $psFolder, self::COMMENT_FILENAME);
		return $aTags;
	}

	//********************************************************************
	static function set($psRealm, $psFolder, $psComment, $psUser){
	
		$psComment = strip_tags($psComment);

		//get the file from the object store
		$aData = cObjStore::get_file($psRealm, $psFolder, self::COMMENT_FILENAME);
		if (!$aData) $aData=[];

		$aData[] = ["c"=>$psComment, "u"=>$psUser];
		
		//put the file back
		cObjStore::put_file($psRealm, $psFolder, self::COMMENT_FILENAME, $aData);
		
		return $aData;
	}
	//
}
?>