<?php
	//panorama data form the marvellous work of Nev Thompson http://www.gigapan.com/profiles/pencilnev
	
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/objstore.php");

	class cPencilNev{
		const NEVILLE_FILENAME = "[nevgig].txt";
		const TOP_NEVILLE_FILENAME = "[topnevgig].txt";
		
		//***********************************************************************************************
		public static function get_top_gigas(){
			return cObjStore::get_file("", self::TOP_NEVILLE_FILENAME);
		}
		
		//***********************************************************************************************
		public static function get_sol_gigas( $psSol){
			return cObjStore::get_file($psSol, self::NEVILLE_FILENAME);
		}
		
		//***********************************************************************************************
		public static function index_gigapans( $paData){
			$aData = [];
			$aTop = [];
			$iMatched = 0;
			
			//build up the list
			foreach ($paData as $aItem){
				$sDescr = $aItem["D"];
				if (stristr($sDescr , "msl") === FALSE) continue;
				$aMatches = [];
				if (preg_match("/\D+(\d+)/", $sDescr, $aMatches)){
					$sSol = $aMatches[1];
					if (!array_key_exists ($sSol, $aData))	$aData[$sSol] = [];
					$aData[$sSol][] = $aItem; 
					$aTop[$sSol] = 1;
					$iMatched ++;
				}else
					cDebug::write("skipping:$sDescr");
			}
			ksort($aData);
			if ($iMatched == 0)	cDebug::error("** nothing matched");
			//output the files
			foreach ($aData as $sSol=>$aItems)
				cObjStore::put_file($sSol, self::NEVILLE_FILENAME, $aItems);
			cObjStore::put_file("", self::TOP_NEVILLE_FILENAME, $aTop);
				
			cDebug::write("Completed indexing of neville gigapans");
		}
		
		//***********************************************************************************************
		public static function get_gigas( $psSol){
			return cObjStore::get_file($psSol, self::NEVILLE_FILENAME);
		}
	}

?>