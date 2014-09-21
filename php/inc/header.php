<?php
class cHeader{
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
}
?>