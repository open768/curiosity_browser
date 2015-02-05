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
	
	//*******************************************************************
	public static function get($psKey){
		if (isset( $_GET[$psKey]))
			return ($_GET[$psKey]);
			
		if (isset( $_POST[$psKey]))
			return ($_POST[$psKey]);
			
		cDebug::write("key:$psKey not found in GET or POST");
		return null;
	}
	
	//*******************************************************************
	public static function start_session(){
		if (session_status() == PHP_SESSION_NONE) 	
			if (!headers_sent())	//this is vitally important - any header work must preceed any html being sent
				session_start();
	}
}
?>