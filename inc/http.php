<?php
class cHttp{
	
	//*****************************************************************************
	public static function getJson($psURL){
		//----------fetch the sol details
		$response = self::fetch_url($psURL);
		$oResponse = json_decode($response);
		
		return $oResponse;
	}
	
	//*****************************************************************************
	public static function fetch_url($psUrl){
		$oCurl = curl_init();	
		curl_setopt($oCurl, CURLOPT_URL, $psUrl);
		curl_setopt($oCurl, CURLOPT_FAILONERROR, 1);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1);
		$response = curl_exec($oCurl);
		$iErr = curl_errno($oCurl);
		if ($iErr!=0 ) {
			print curl_error($oCurl)."<p>";
			curl_close($oCurl);
			die ("ERROR URL was: $url <p>");
		}
		
		return  $response;
	}
}
?>