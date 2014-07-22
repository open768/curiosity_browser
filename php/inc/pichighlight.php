<?php
require_once("$root/php/inc/objstore.php");
require_once("$root/php/inc/indexes.php");
require_once("$root/php/inc/http.php");
require_once("$root/php/inc/hash.php");
require_once("$root/php/curiosity/curiosity.php");

class cImageHighlight{
	const INDEX_SUFFIX = "Highlite";
	const IMGHIGH_FILENAME = "[imgbox].txt";
	const THUMBS_FILENAME = "[thumbs].txt";
	const THUMBS_FOLDER = "images/highs/";
	const CROP_WIDTH = 120;
	const CROP_HEIGHT = 120;
	const THUMB_QUALITY = 90;
	
	//######################################################################
	//# GETTERS functions
	//######################################################################
	static function get( $psSol, $psInstrument, $psProduct){
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = cObjStore::get_file( $sFolder, self::IMGHIGH_FILENAME);
		$aOut = ["s"=>$psSol, "i"=>$psInstrument, "p"=>$psProduct , "d"=>$aData];
		return $aOut;
	}
	
	//**********************************************************************
	private static function pr_get_image($psSol, $psInstrument, $psProduct){
		//get the original image once 
		$oInstrumentData = cCuriosity::getProductDetails($psSol, $psInstrument, $psProduct);
		$sImageUrl = $oInstrumentData["d"]["i"];
		
		//get the  image
		cDebug::write("fetching image from $sImageUrl");
		$oMSLImg = imagecreatefromjpeg($sImageUrl);
		return $oMSLImg;
	}
	
	//**********************************************************************
	private static function pr_perform_crop($poImg, $piX, $piY, $psSol, $psInstrument, $psProduct, $psPath){
		global $root;
		cDebug::write("cropping to $piX, $piY");
		
		$oDest = imagecreatetruecolor(self::CROP_WIDTH, self::CROP_HEIGHT);
		imagecopy($oDest, $poImg, 0,0, $piX, $piY, self::CROP_WIDTH, self::CROP_HEIGHT);
		
		//write out the file
		$sFilename = "$root/$psPath";
		$sFolder = dirname($sFilename);
		if (!file_exists($sFolder)){
			cDebug::write("creating folder: $sFolder");
			mkdir($sFolder, 0755, true); //folder needs to readable by apache
		}
		
		cDebug::write("writing jpeg to $sFilename");
		imagejpeg($oDest, $sFilename, self::THUMB_QUALITY );
		imagedestroy($oDest);
	}
	
	//**********************************************************************
	static function get_thumbs( $psSol, $psInstrument, $psProduct){
		global $root;
		
		$bUpdated = false;
		$oMSLImg = null;
		
		
		//get existing thumbnail details  
		$sPathHash = cHash::hash("$psSol/$psInstrument/$psProduct/".self::THUMBS_FILENAME);
		$aThumbs = cHash::get_obj($sPathHash);
		if ($aThumbs == null)	$aThumbs = [];

		//get the highlights for the selected product
		$aHighs = self::get( $psSol, $psInstrument, $psProduct);
		if ($aHighs["d"]){
			
			//work through each checking if the thumbnail is present
			for( $i=0 ; $i < count($aHighs["d"]); $i++){
				$oItem = $aHighs["d"][$i];
				$sKey = $psProduct . $oItem["t"] . $oItem["l"];

				//figure out where stuff should go 
				$sRelative = self::THUMBS_FOLDER."$psSol/$psInstrument/$psProduct/$i.jpg";
				$sReal = "$root/$sRelative";
				

				//check if the array entry exists and the thumbnail exists
				if (array_key_exists($sKey, $aThumbs)){  
					cDebug::write("Key exists : $sKey");
					if (file_exists($sReal))continue;	
				}

				//if you got here something wasnt there - regenerate the thumbnail
				cDebug::write("creating thumbnail ");
				if (! $oMSLImg) $oMSLImg = self::pr_get_image($psSol, $psInstrument, $psProduct);
					
				//get the coordinates of the box
				preg_match("/^(\d*)/",$oItem["l"], $aMatches);
				$iX = $aMatches[0];
				if ($iX < 0) $iX=0;
				preg_match("/^(\d*)/",$oItem["t"], $aMatches);
				$iY = $aMatches[0];
				if ($iY < 0) $iY=0;

				//perform the crop
				self::pr_perform_crop($oMSLImg, $iX, $iY, $psSol, $psInstrument, $psProduct, $sRelative);
				
				//update the structure
				$aThumbs[$sKey] = $sRelative;
				$bUpdated = true;
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
	static function set( $psSol, $psInstrument, $psProduct, $psTop, $psLeft, $psUser){
		//get the file from the object store to get the latest version
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = ["t"=>$psTop, "l"=>$psLeft, "u"=>$psUser];
		cObjStore::push_to_array( $sFolder, self::IMGHIGH_FILENAME, $aData); //store highlight
		cIndexes::update_indexes( $psSol, $psInstrument, $psProduct, 1, self::INDEX_SUFFIX);
		return "ok";
	}
	
	//######################################################################
	//# ADMIN functions
	//######################################################################
	static function reindex(){
		cIndexes::reindex( 1, self::INDEX_SUFFIX , self::IMGHIGH_FILENAME);
	}
	
	static function kill_highlites( $psSol, $psInstr, $psProduct, $psWhich){
		$sFolder="$psSol/$psInstr/$psProduct";
		cObjStore::kill_file( $sFolder, self::IMGHIGH_FILENAME);
		cDebug::write("now reindex the image highlihgts");
	}

	
}
?>