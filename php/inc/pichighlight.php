<?php
require_once("inc/objstore.php");


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
	
	//********************************************************************
	static function get_top_sol_data($psRealm){
		return cObjStore::get_file($psRealm, "", self::TOP_SOL_HIGH_FILE);
	}
	
	//********************************************************************
	static function get_sol_data($psRealm, $psSol){
		return cObjStore::get_file($psRealm, $psSol, self::SOL_HIGH_FILE);
	}
	
	//********************************************************************
	static function get_instr_data($psRealm, $psSol, $psInstrument){
		return cObjStore::get_file($psRealm, "$psSol/$psInstrument", self::INSTR_HIGH_FILE);
	}
	
	//********************************************************************
	static function get_solcount($psRealm, $psSol){
		$iCount = 0;
		$aData = self::get_sol_data($psRealm, $psSol);
		if ($aData){
			foreach ( $aData as $sInstr=>$aInstrData){
				foreach ($aInstrData as $sProduct)
					$iCount++;
			}
		}
			
		return $iCount;
	}

	//######################################################################
	//# UPDATE functions
	//######################################################################
	static function set($psRealm, $psSol, $psInstrument, $psProduct, $psTop, $psLeft, $psUser){
		//get the file from the object store to get the latest version
		$sFolder = "$psSol/$psInstrument/$psProduct";
		$aData = ["t"=>$psTop, "l"=>$psLeft, "u"=>$psUser];
		cObjStore::push_to_array($psRealm, $sFolder, self::IMGHIGH_FILENAME, $aData);
		
		self::update_instr_index($psRealm, $psSol, $psInstrument, $psProduct);
		self::update_sol_index($psRealm, $psSol, $psInstrument, $psProduct);
		self::update_top_sol_index($psRealm, $psSol);
		return "ok";
	}
	
	//********************************************************************
	static function update_top_sol_index($psRealm, $psSol){
		$aData = cObjStore::get_file($psRealm, "", self::TOP_SOL_HIGH_FILE);
		if (!$aData) $aData=[];
		if ( !array_key_exists( $psSol, $aData)){
			$aData[$psSol] = 1;
			cDebug::write("updating top sol index for sol $psSol");
			cObjStore::put_file($psRealm, "", self::TOP_SOL_HIGH_FILE, $aData);
		}
	}
		
	//********************************************************************
	static function update_sol_index($psRealm, $psSol, $psInstrument, $psProduct){
		$aData = cObjStore::get_file($psRealm, $psSol, self::SOL_HIGH_FILE);
		if (!$aData) $aData=[];
		if (!array_key_exists( $psInstrument, $aData)) $aData[$psInstrument] = [];
		$aData[$psInstrument][$psProduct] = 1;
		cObjStore::put_file($psRealm, $psSol, self::SOL_HIGH_FILE, $aData);
	}
		
	//********************************************************************
	static function update_instr_index($psRealm, $psSol, $psInstrument, $psProduct ){
		$sFolder="$psSol/$psInstrument";
		$aData = cObjStore::get_file($psRealm, $sFolder, self::INSTR_HIGH_FILE);
		if (!$aData) $aData=[];
		$aData[$psProduct] = 1;
		cObjStore::put_file($psRealm, $sFolder, self::INSTR_HIGH_FILE, $aData);
	}
	
	//######################################################################
	//# ADMIN reindex - will only ever need to do this the once!
	//######################################################################
	static function reindex($psRealm){
		$aData = [];
		
		//find the highlight files
		$toppath = cObjStore::$rootFolder."/$psRealm";
		$aSols = scandir($toppath);
		foreach ($aSols as $sSol)
			if (preg_match("/\d+/", $sSol)){
				$solPath = "$toppath/$sSol";
				$aInstrs = scandir($solPath);
				foreach ($aInstrs as $sInstr)
					if (! preg_match("/[\[\.]/", $sInstr)){
						$instrPath = "$solPath/$sInstr";
						$aProducts = scandir($instrPath);
						foreach ($aProducts as $sProduct)
							if (! preg_match("/[\[\.]/", $sProduct)){
								$prodPath = "$instrPath/$sProduct";
								$aFiles = scandir($prodPath);
								foreach ($aFiles as $sFile)
									if ( $sFile === self::IMGHIGH_FILENAME){
										if (!array_key_exists ($sSol, $aData)) $aData[$sSol] = [];
										if (!array_key_exists ($sInstr, $aData[$sSol])) $aData[$sSol][$sInstr] = [];
										$aData[$sSol][$sInstr][$sProduct] = 1;
									}
							}
					}
			}
			
		//write out the  index files
		$aTopSols = [];
		foreach ($aData as  $sSol=>$aSolData)	{
			$aTopSols[$sSol] = 1;
			foreach ($aSolData as $sInstr=>$aInstrData)
				cObjStore::put_file($psRealm, "$sSol/$sInstr", self::INSTR_HIGH_FILE, $aInstrData);				
			cObjStore::put_file($psRealm, $sSol, self::SOL_HIGH_FILE, $aSolData);				
		}
		cObjStore::put_file($psRealm, "", self::TOP_SOL_HIGH_FILE, $aTopSols);
	}
}
?>