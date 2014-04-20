<?php
require_once("inc/objstore.php");


class cIndexes{
	//********************************************************************
	static function get_top_sol_data($psRealm, $psFile){
		return cObjStore::get_file($psRealm, "", $psFile);
	}
	
	//********************************************************************
	static function get_sol_data($psRealm, $psSol, $psFile){
		return cObjStore::get_file($psRealm, $psSol, $psFile);
	}
	
	//********************************************************************
	static function get_instr_data($psRealm, $psSol, $psInstrument, $psFile){
		return cObjStore::get_file($psRealm, "$psSol/$psInstrument", $psFile);
	}
	
	//********************************************************************
	static function get_solcount($psRealm, $psSol, $psFile){
		$iCount = 0;
		$aData = self::get_sol_data($psRealm, $psSol, $psFile);
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
	static function update_indexes($psRealm, $psSol, $psInstrument, $psProduct, $poData, $psTopFile, $psSolFile, $psInstrFile){
		self::update_instr_index($psRealm, $psSol, $psInstrument, $psProduct, $poData, $psInstrFile);
		self::update_sol_index($psRealm, $psSol, $psInstrument, $psProduct, $psSolFile);
		self::update_top_sol_index($psRealm, $psSol, $psTopFile);		
	}
	
	//********************************************************************
	static function update_top_sol_index($psRealm, $psSol, $psFile){
		$aData = cObjStore::get_file($psRealm, "", $psFile);
		if (!$aData) $aData=[];
		if ( !array_key_exists( $psSol, $aData)){
			$aData[$psSol] = 1;
			cDebug::write("updating top sol index for sol $psSol");
			cObjStore::put_file($psRealm, "", $psFile, $aData);
		}
	}
		
	//********************************************************************
	static function update_sol_index($psRealm, $psSol, $psInstrument, $psProduct, $psFile){
		$aData = cObjStore::get_file($psRealm, $psSol, $psFile);
		if (!$aData) $aData=[];
		if (!array_key_exists( $psInstrument, $aData)) $aData[$psInstrument] = [];
		$aData[$psInstrument][$psProduct] = 1;
		cObjStore::put_file($psRealm, $psSol, $psFile, $aData);
	}
		
	//********************************************************************
	static function update_instr_index($psRealm, $psSol, $psInstrument, $psProduct, $poData, $psFile ){
		$sFolder="$psSol/$psInstrument";
		$aData = cObjStore::get_file($psRealm, $sFolder, $psFile);
		if (!$aData) $aData=[];
		$aData[$psProduct] = $poData;
		cObjStore::put_file($psRealm, $sFolder, $psFile, $aData);
	}
}
?>