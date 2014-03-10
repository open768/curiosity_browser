<?php
require_once("inc/objstore.php");

class cTags{
	static $topTagFile = "[top].txt";
	static $tagFilename = "[tag].txt";
	static $tagFolder = "[tags]";
	
	//********************************************************************
	static function get_tag_names($psRealm, $psFolder){
		$aTags = cObjStore::get_file($psRealm, $psFolder, self::$tagFilename);
		if (!$aTags) $aTags=[];
		
		$aKeys = [];
		foreach ($aTags as $sKey=>$oValue)
			array_push($aKeys, $sKey);
			
		return $aKeys;
	}

	//********************************************************************
	static function set_tag($psRealm, $psFolder, $psTag, $psUser){
	
		$psTag = preg_replace("/[^A-Za-z0-9]/", '', $psTag);

		//get the file from the object store
		$aData = cObjStore::get_file($psRealm, $psFolder, self::$tagFilename);
		if (!$aData) $aData=[];
		
		//update the structure (array of arrays)
		if (!array_key_exists($psTag, $aData)){
			cDebug::write("creating tag entry: $psTag");
			$aData[$psTag] = [];
		}
		
		if (!array_key_exists($psUser, $aData[$psTag])){
			cDebug::write("adding user $psUser to tags : $psTag");
			$aData[$psTag][$psUser] = 1;
		}else{
			cDebug::write("user has already reported this tag : $psTag");
			return;
		}
		
		//put the file back
		cObjStore::put_file($psRealm, $psFolder, self::$tagFilename, $aData);
		
		//now update the index
		self::update_top_index($psRealm, $psTag);
		
		//and update the specific tag details for the image
		self::update_tag_index($psRealm, $psTag, $psFolder);
	}
	
	//********************************************************************
	static function get_top_tags($psRealm){
		return 	cObjStore::get_file($psRealm, "", self::$topTagFile);
	}
	
	//********************************************************************
	static function get_tag_index($psRealm, $psTag){
		$filename = $psTag.".txt";

		return cObjStore::get_file($psRealm, self::$tagFolder, $filename);
	}
	
	//********************************************************************
	static function update_tag_index($psRealm, $psTag, $psValue){
		cDebug::write("updating index for tag:$psTag - folder:$psValue");
		$filename = $psTag.".txt";

		// get the existing details
		$aData = cObjStore::get_file($psRealm, self::$tagFolder, $filename);
		if (!$aData) $aData=[];
		
		//update the count
		$aData[] = $psValue;
		cDebug::vardump($aData);
		
		//write out the data
		cObjStore::put_file($psRealm, self::$tagFolder, $filename, $aData);
	}
	
	//********************************************************************
	static function update_top_index($psRealm, $psTag){
		cDebug::write("updating index for tag : $psTag");

		// get the existing tags
		$aData = cObjStore::get_file($psRealm, "", self::$topTagFile);
		if (!$aData) $aData=[];
		
		//update the count
		$count =0;
		if (array_key_exists($psTag, $aData)) $count = $aData[$psTag];
		$count++;
		$aData[$psTag] = $count;
		cDebug::vardump($aData);
		
		//write out the data
		cObjStore::put_file($psRealm, "", self::$topTagFile, $aData);
	}
	//
}
?>