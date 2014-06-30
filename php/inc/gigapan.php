<?php
	//http://api.gigapan.org/beta/gigapans/page/1/per_page/100/username/pencilnev/most_recent.json
	// to get details on a gigagpan - use the api http://www.gigapan.com/gigapans/[number].json
	// to go to a gigapan http://www.gigapan.com/gigapans/157774
	
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/cached_http.php");

	class cGigapan{
		const USER_EXPR = "http://api.gigapan.org/beta/gigapans/page/%d/per_page/100/username/%s/most_recent.json";
		
		//***********************************************************************************************
		public static function get_gigapans($psUser, $piPage){
			
			//get the json data
			$sUrl = sprintf(self::USER_EXPR , $piPage, $psUser);
			$oJson = cCachedHttp::getCachedJson($sUrl);
			
			//extract the name and the gigagpan IDs
			$aItems = $oJson->items;
			$aGigapans = [];		
			foreach ($aItems as $aItemData){
				
				$sId = $aItemData[0];
				$oGData = $aItemData[1];
				$sCaption= $oGData->name;
				
				$aGigapans[] = [ "I" => $sId, "D" => $sCaption ];
			}
			
			//extract the name and the gigagpan IDs
			$aData = [
				"d" => $aGigapans,
				"i" =>	[
					"a" => $oJson->available,
					"p" => $oJson->page,
					"c" => $oJson->count,
					"pp" => $oJson->per_page,
				]
			];
			
			
			return $aData;
		}
	}

?>