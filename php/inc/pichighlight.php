<?php
require_once("$root/php/inc/objstore.php");
require_once("$root/php/inc/indexes.php");
require_once("$root/php/inc/http.php");
require_once("$root/php/inc/hash.php");
require_once("$root/php/curiosity/curiosity.php");

class cImageHighlight{
	const INDEX_SUFFIX = "Highlite";
	const IMGHIGH_FILENAME = "[imgbox].txt";
	const MOSAIC_COUNT_FILENAME = "[moscount].txt";
	const THUMBS_FILENAME = "[thumbs].txt";
	const THUMBS_FOLDER = "images/highs/";
	const MOSAIC_FOLDER = "images/mosaics";
	const CROP_WIDTH = 120;
	const CROP_HEIGHT = 120;
	const BORDER_WIDTH = 5;
	const THUMB_QUALITY = 90;
	const MOSAIC_WIDTH = 8;
	
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
		//$oMSLImg = imagecreatefromjpeg($sImageUrl);
		$oMSLImg = cHttp::fetch_image($sImageUrl);
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
	// this function should be multithreaded when the software becomes a #product# #TBD#
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
				//figure out where stuff should go 
				$sThumbfile = self::THUMBS_FOLDER."$psSol/$psInstrument/$psProduct/$i.jpg";
				$sReal = "$root/$sThumbfile";

				// key that identifies the thumbnail uses coordinates
				$oItem = $aHighs["d"][$i];
				$sKey = $psProduct . $oItem["t"] . $oItem["l"];

				//check if the array entry exists and the thumbnail exists
				if (array_key_exists($sKey, $aThumbs))
					if (file_exists($sReal))continue;	

				//---------------split this out---------------------
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
				self::pr_perform_crop($oMSLImg, $iX, $iY, $psSol, $psInstrument, $psProduct, $sThumbfile);
				
				//update the structure
				$aThumbs[$sKey] = $sThumbfile;
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
	
	//**********************************************************************
	static function get_sol_highlighted_products( $psSol)	{
		return 	cIndexes::get_sol_data( $psSol, self::INDEX_SUFFIX);
	}
	
	//**********************************************************************
	static function get_all_highlights($psSol){
		//get which products have highlights
		cDebug::write("getting highlights for sol $psSol");
		$aData = self::get_sol_highlighted_products($psSol);
		if ($aData == null){
			cDebug::write("no highlights for sol $psSol");
			return null;
		}
		
		//get all the highlights
		foreach ($aData as $sInstrument=>$aProducts){
			foreach ($aProducts as $sProduct=>$iCount){
				$oHighlites = self::get( $psSol, $sInstrument, $sProduct);
				$aData[$sInstrument][$sProduct] = $oHighlites["d"];
			}
		}	
		return $aData;
	}
	
	//**********************************************************************
	static private function pr_count_highlights($paData){
		$iCount = 0;
		
		if ($paData == null) 	return 0;
		
		foreach ($paData as $sInstr=>$aInstrData)
			foreach ($aInstrData as $sProduct=>$aProdData)
				$iCount += count($aProdData);
		return $iCount;
	}
	
	//######################################################################
	//# MOSAIC functions
	//######################################################################
	static private function pr_get_mosaic_count($psSol){
		$iCount = cObjStore::get_file( "$psSol", self::MOSAIC_COUNT_FILENAME);
		if ($iCount == null) $iCount = 0;
		return $iCount;
	}
	//**********************************************************************
	static private function pr_put_mosaic_count($psSol, $piCount){
		cObjStore::put_file( "$psSol", self::MOSAIC_COUNT_FILENAME, $piCount);
	}
	
	//**********************************************************************
	static private function pr_generate_mosaic($psSol,$paData)
	{	
		global $root;
		$aImgList = [];
		
		//first make sure all the thumbnails are actually there
		foreach ($paData as $sInstr=>$aInstrData){
			cDebug::write("processing thumbs for $sInstr");
			foreach ($aInstrData as $sProd=>$sProdData){
				$aData = self::get_thumbs($psSol, $sInstr, $sProd);
				foreach ($aData["u"] as $sPath)
					$aImgList[] = $sPath;
			}
		}
		
		//the folder has to be there 
		$sFolder = $root."/".self::MOSAIC_FOLDER;
		if (!file_exists($sFolder)){
			cDebug::write("creating folder: $sFolder");
			mkdir($sFolder, 0755, true); //folder needs to readable by apache
		}
		
		//now combine the highlights into a single mosaic
		$iCount = count($aImgList);
		cDebug::write("combining $iCount thumbnails");
		$iRows = ceil ( $iCount / self::MOSAIC_WIDTH);
		cDebug::write("into a Mosaic with size ".self::MOSAIC_WIDTH." x $iRows");
		$iWidth = self::BORDER_WIDTH + self::MOSAIC_WIDTH * (self::CROP_WIDTH + self::BORDER_WIDTH);
		$iHeight = self::BORDER_WIDTH + $iRows * (self::CROP_HEIGHT + self::BORDER_WIDTH);
		
		$oDest = imagecreatetruecolor($iWidth, $iHeight);
		
		$iRow = 0;
		$iCol = 0;
		$iX = self::BORDER_WIDTH;
		$iY = self::BORDER_WIDTH;
		
		for ($i=0; $i<$iCount; $i++){
			//load the original image
			$sThumbFilename = $root."/".$aImgList[$i];
			$oThumbImg = imagecreatefromjpeg($sThumbFilename);

			//copy it into the mosaic
			//cDebug::write("copying image into $iX, $iY");
			imagecopy($oDest, $oThumbImg, $iX, $iY, 0,0,  self::CROP_WIDTH, self::CROP_HEIGHT);

			//next
			imagedestroy($oThumbImg);
			$iCol++;
			$iX += (self::BORDER_WIDTH + self::CROP_WIDTH);
			if( $iCol >= self::MOSAIC_WIDTH){
				$iRow++;
				$iCol = 0;
				$iX = self::BORDER_WIDTH;
				$iY += (self::BORDER_WIDTH + self::CROP_HEIGHT);
			}
		}
		
		//write out the results
		$sImageFile = self::MOSAIC_FOLDER."/$psSol.jpg";
		$sReal = "$root/$sImageFile";
		imagejpeg($oDest, $sReal, self::THUMB_QUALITY );
		imagedestroy($oDest);

		return $sImageFile;
	}
	
	//**********************************************************************
	static function get_sol_high_mosaic( $psSol){
		$oData = self::get_all_highlights($psSol);
		$iCount = self::pr_count_highlights($oData);
		cDebug::write("there were $iCount highlights");
		if ($iCount == 0){
			cDebug::write("no highlights to create a mosaic from");
			return null;
		}
		
		//------------------------------------------------------------------
		//does the count match what is stored - in that case the mosaic is allready
		$iStoredCount = self::pr_get_mosaic_count($psSol);
		if ($iStoredCount != $iCount){
			cDebug::write("but only $iStoredCount were previously known");
			//generate the mosaic
			$sMosaic = self::pr_generate_mosaic($psSol,$oData);
			
			//write out the count 
			self::pr_put_mosaic_count($psSol, $iCount);
		}		
		
		return self::MOSAIC_FOLDER."/$psSol.jpg";
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