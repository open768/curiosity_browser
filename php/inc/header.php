<?php
require_once("$root/php/inc/debug.php");

class cHeader{
	//*******************************************************************
	public static function redirect_if_referred(){
		if (isset($_SERVER['HTTP_REFERER'])){
			$sUrl = $_SERVER['HTTP_REFERER'];
			$aRef = parse_url($sUrl);
			
			$sPath = basename($aRef["path"]);
			$sThis = pathinfo(basename($_SERVER['PHP_SELF']))["filename"];
			
			if ($sPath === "$sThis.html"){
				$sRedir = "$sThis.php?". $aRef["query"];
				$_SERVER['HTTP_REFERER'] = null;
				header("Location: $sRedir");
				exit;
			}
		}
	}
	
	//*******************************************************************
	public static function is_localhost(){
		$aList = array(
			'127.0.0.1',
			'::1'
		);

		$sServer = $_SERVER['REMOTE_ADDR'];
		$bLocal = in_array($sServer, $aList);
		cDebug::write("Server: '$sServer', local: $bLocal");
		return $bLocal;
	}
}
?>