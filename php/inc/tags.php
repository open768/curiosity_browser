<?php
require_once("inc/objstore.php");
require_once("inc/debug.php");


class cTags{
	const TOP_TAG_FILE = "[top].txt";
	const TAG_FILENAME = "[tag].txt";
	const TAG_FOLDER = "[tags]";
	const RECENT_TAG = "TAG";
	
	//********************************************************************
	static function get_tag_names($psRealm, $psSol, $psInstrument, $psProduct){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aTags = cObjStore::get_file($psRealm, $sFolder, self::TAG_FILENAME);
		if (!$aTags) $aTags=[];
		
		$aKeys = [];
		foreach ($aTags as $sKey=>$oValue)
			array_push($aKeys, $sKey);
			
		return $aKeys;
	}

	//********************************************************************
	static function set_tag($psRealm, $psSol, $psInstrument, $psProduct , $psTag, $psUser){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$psTag = preg_replace("/[^A-Za-z0-9.]/", '', $psTag);

		//get the file from the object store
		$aData = cObjStore::get_file($psRealm, $sFolder, self::TAG_FILENAME);
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
		cObjStore::put_file($psRealm, $sFolder, self::TAG_FILENAME, $aData);

		//now update the index
		self::update_top_index($psRealm, $psTag);
		
		//and update the specific tag details for the image
		self::update_tag_index($psRealm, $psTag, $sFolder);
	}
	
	//********************************************************************
	static function get_top_tags($psRealm){
		return 	cObjStore::get_file($psRealm, "", self::TOP_TAG_FILE);
	}
	
	//********************************************************************
	static function get_tag_index($psRealm, $psTag){
		$filename = $psTag.".txt";

		$aTags = cObjStore::get_file($psRealm, self::TAG_FOLDER, $filename);
		sort($aTags);
		return $aTags;
	}
	
	//********************************************************************
	static function update_tag_index($psRealm, $psTag, $psValue){
		$filename = $psTag.".txt";
		cObjStore::push_to_array($psRealm, self::TAG_FOLDER, $filename, $psValue);
	}
	
	//********************************************************************
	static function update_top_index($psRealm, $psTag){
		cDebug::write("updating index for tag : $psTag");

		// get the existing tags
		$aData = cObjStore::get_file($psRealm, "", self::TOP_TAG_FILE);
		if (!$aData) $aData=[];
		
		//update the count
		$count =0;
		if (array_key_exists($psTag, $aData)) $count = $aData[$psTag];
		$count++;
		$aData[$psTag] = $count;
		cDebug::vardump($aData);
		
		//write out the data
		cObjStore::put_file($psRealm, "", self::TOP_TAG_FILE, $aData);
	}
	
	//********************************************************************
	static function kill_tag($psRealm, $psTag){
		cDebug::write("in kill_tag");

		//remove entry from top tag file 
		$aData = cObjStore::get_file($psRealm, "", self::TOP_TAG_FILE);
		if (array_key_exists($psTag, $aData)) {
			unset($aData[$psTag]);
			cObjStore::put_file($psRealm, "", self::TOP_TAG_FILE, $aData);
		}else{
			cDebug::write("tag not found");
			return;
		}

		//remove tag index file 
		$filename = $psTag.".txt";
		$aTags = cObjStore::get_file($psRealm, self::TAG_FOLDER, $filename);
		if ($aTags != null){
			cObjStore::kill_file($psRealm, self::TAG_FOLDER, $filename);
		}else{
			cDebug::write("tagindex not found");
			return;
		}
		
		//remolve individual tags
		foreach ($aTags as $sFolder)
			cObjStore::kill_file($psRealm, $sFolder, self::TAG_FILENAME);
	
		cDebug::write("ok");
	}
}
?>