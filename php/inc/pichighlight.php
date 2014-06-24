<?php
require_once("$root/php/inc/objstore.php");
require_once("$root/php/inc/indexes.php");
require_once("$root/php/inc/http.php");
require_once("$root/php/inc/hash.php");
require_once("$root/php/curiosity/json.php");

class cImageHighlight{
	const INDEX_SUFFIX = "Highlite";
	const IMGHIGH_FILENAME = "[imgbox].txt";
	const THUMBS_FILENAME = "[thumbs].txt";
	const THUMBS_FOLDER = "images/highs/";
	const CROP_WIDTH = 120;
	const CROP_HEIGHT = 120;
	const THUMB_QUALITY = 80;
	
	//######################################################################
	//# GETTERS functions
	//######################################################################
	static function get($psRealm, $psSol, $psInstrument, $psProduct){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = cObjStore::get_file($psRealm, $sFolder, self::IMGHIGH_FILENAME);
		$aOut = ["s"=>$psSol, "i"=>$psInstrument, "p"=>$psProduct , "d"=>$aData];
		return $aOut;
	}
	
	//**********************************************************************
	static function get_thumbs($psRealm, $psSol, $psInstrument, $psProduct){
		global $root;
		
		$bUpdated = false;
		$oMSLImg = null;
		
		
		//get existing thumbnail details  
		$sPathHash = cHash::hash("$psSol/$psInstrument/$psProduct/".self::THUMBS_FILENAME);
		$aThumbs = cHash::get_obj($sPathHash);
		if ($aThumbs == null)	$aThumbs = [];

		//get the highlights for the selected product
		$aHighs = self::get($psRealm, $psSol, $psInstrument, $psProduct);
		if ($aHighs["d"]){
			
			//work through each checking if the thumbnail is present
			for( $i=0 ; $i < count($aHighs["d"]); $i++){
				$oItem = $aHighs["d"][$i];
				$sKey = $psProduct . $oItem["t"] . $oItem["l"];
				if (array_key_exists($sKey, $aThumbs))  
					cDebug::write("Key exists : $sKey");
				else{
					cDebug::write("missing Key is $sKey");
					cDebug::vardump($oItem);
					
					if (! $oMSLImg){
						//get the original image once 
						$oInstrumentData = cCuriosity::getProductDetails($psSol, $psInstrument, $psProduct);
						$sImageUrl = $oInstrumentData["d"]["i"];
						
						//get the  image
						cDebug::write("fetching image from $sImageUrl");
						$oMSLImg = imagecreatefromjpeg($sImageUrl);
					}
					
					//perform the crop on the image
					$oDest = imagecreatetruecolor(self::CROP_WIDTH, self::CROP_HEIGHT);
					preg_match("/^(\d*)/",$oItem["l"], $aMatches);
					$iX = $aMatches[0];
					if ($iX < 0) $iX=0;
					preg_match("/^(\d*)/",$oItem["t"], $aMatches);
					$iY = $aMatches[0];
					if ($iY < 0) $iY=0;
					cDebug::write("cropping to $iX, $iY");
					imagecopy($oDest, $oMSLImg, 0,0, $iX, $iY, self::CROP_WIDTH, self::CROP_HEIGHT);
					
					//write out the file
					$sThumbFolder = self::THUMBS_FOLDER."$psSol/$psInstrument/$psProduct";
					$sThumbFile = $sThumbFolder ."/$i.jpg";
					$sRealFolder = "$root/$sThumbFolder";
					$sRealFile = "$sRealFolder/$i.jpg";
					if (!file_exists($sRealFolder)){
						cDebug::write("creating folder: $sRealFolder");
						mkdir($sRealFolder, 0755, true); //folder needs to readable by apache
					}
					cDebug::write("writing jpeg to $sRealFile");
					imagejpeg($oDest, $sRealFile, self::THUMB_QUALITY );
					imagedestroy($oDest);
					
					//update the structure
					$aThumbs[$sKey] = $sThumbFile;
					$bUpdated = true;
				}
			}
		
			//update the objstore if necessary
			if ($bUpdated)
				cHash::put_obj($sPathHash, $aThumbs, true);
				
			//we dont want to hang onto the original jpeg
			if ($oMSLImg){
				cDebug::write("destroying image");
				imagedestroy($oMSLImg);
			}
			
		}
		
		//return the data
		$aData = ["s"=>$psSol, "i"=>$psInstrument, "p"=>$psProduct, "u"=>array_values($aThumbs)];
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
		cIndexes::reindex($psRealm, 1, self::INDEX_SUFFIX , self::IMGHIGH_FILENAME);
	}
	
	static function kill_highlites($psRealm, $psSol, $psInstr, $psProduct, $psWhich){
		$sFolder="$psSol/$psInstr/$psProduct";
		cObjStore::kill_file($psRealm, $sFolder, self::IMGHIGH_FILENAME);
		cDebug::write("now reindex the image highlihgts");
	}

	
}
?>