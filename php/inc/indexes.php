<?php
require_once("$root/php/inc/objstore.php");


class cIndexes{
	const TOP_PREFIX = "t";
	const SOL_PREFIX = "s";
	const INSTR_PREFIX = "i";
	
	public static function get_filename( $psPrefix, $psSuffix){
		return "[${psPrefix}${psSuffix}].txt";
	}
	
	//********************************************************************
	static function get_top_sol_data( $psSuffix){
		$sFile = self::get_filename(self::TOP_PREFIX, $psSuffix);
		return cObjStore::get_file( "", $sFile);
	}
	
	//********************************************************************
	static function get_sol_data( $psSol, $psSuffix){
		$sFile = self::get_filename(self::SOL_PREFIX, $psSuffix);
		return cObjStore::get_file( $psSol, $sFile);
	}
	
	//********************************************************************
	static function get_instr_data( $psSol, $psInstrument, $psFile){
		$sFile = self::get_filename(self::INSTR_PREFIX, $psSuffix);
		return cObjStore::get_file( "$psSol/$psInstrument", $sFile);
	}
	
	//********************************************************************
	static function get_solcount( $psSol, $psFile){
		$iCount = 0;
		$aData = self::get_sol_data( $psSol, $psFile);
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
	static function update_indexes( $psSol, $psInstrument, $psProduct, $poData, $psSuffix){
		self::update_instr_index( $psSol, $psInstrument, $psProduct, $poData, $psSuffix);
		self::update_sol_index( $psSol, $psInstrument, $psProduct, $psSuffix);
		self::update_top_sol_index( $psSol, $psSuffix);		
	}
	
	//********************************************************************
	static function update_top_sol_index( $psSol, $psSuffix){
		$sFile = self::get_filename(self::TOP_PREFIX, $psSuffix);
		$aData = cObjStore::get_file( "", $sFile);
		if (!$aData) $aData=[];
		if ( !array_key_exists( $psSol, $aData)){
			$aData[$psSol] = 1;
			cDebug::write("updating top sol index for sol $psSol");
			cObjStore::put_file( "", $sFile, $aData);
		}
	}
		
	//********************************************************************
	static function update_sol_index( $psSol, $psInstrument, $psProduct, $psSuffix){
		$sFile = self::get_filename(self::SOL_PREFIX, $psSuffix);
		$aData = cObjStore::get_file( $psSol, $sFile);
		if (!$aData) $aData=[];
		if (!array_key_exists( $psInstrument, $aData)) $aData[$psInstrument] = [];
		$aData[$psInstrument][$psProduct] = 1;
		cObjStore::put_file( $psSol, $sFile, $aData);
	}
		
	//********************************************************************
	static function update_instr_index( $psSol, $psInstrument, $psProduct, $poData, $psSuffix ){
		$sFile = self::get_filename(self::INSTR_PREFIX, $psSuffix);
		$sFolder="$psSol/$psInstrument";
		$aData = cObjStore::get_file( $sFolder, $sFile);
		if (!$aData) $aData=[];
		$aData[$psProduct] = $poData;
		cObjStore::put_file( $sFolder, $sFile, $aData);
	}

	//######################################################################
	//# reindex functions
	//######################################################################
	static function reindex( $poInstrData, $psSuffix, $psProdFile){
		$aData = [];

		$toppath = cObjStore::$rootFolder."/".OBJDATA_REALM;
		
		//find the highlight files - tried to do this cleverly, but was more lines of code - so brute force it is
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
									if ( $sFile === $psProdFile){
										if (!array_key_exists ($sSol, $aData)) $aData[$sSol] = [];
										if (!array_key_exists ($sInstr, $aData[$sSol])) $aData[$sSol][$sInstr] = [];
										$aData[$sSol][$sInstr][$sProduct] = $poInstrData;
									}
							}
					}
			}
			
		self::write_index_files( $aData,$psSuffix);
	}
	
	//***********************************************************************************************************
	public static function write_index_files($paData, $psSuffix){
		$aTopSols = [];
		foreach ($paData as  $sSol=>$aSolData)	{
			$aTopSols[$sSol] = 1;
			foreach ($aSolData as $sInstr=>$aInstrData)
				cObjStore::put_file( "$sSol/$sInstr", self::get_filename(self::INSTR_PREFIX, $psSuffix), $aInstrData);				
			cObjStore::put_file( $sSol, self::get_filename(self::SOL_PREFIX, $psSuffix), $aSolData);				
		}
		cObjStore::put_file( "", self::get_filename(self::TOP_PREFIX, $psSuffix), $aTopSols);
	}
}
?>