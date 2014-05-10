<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
class cHttp{
	const LARGE_URL_DIR = "../[Largeurls]";
	public static $progress_len = 0;
	public static $progress_count = 0;
	
	//*****************************************************************************
	public static function getJson($psURL){
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
			throw new Exception("ERROR URL was: $psUrl <p>");
		}else
			curl_close($oCurl);
			
		return  $response;
	}
	
	//*****************************************************************************
	public static function fetch_large_url($psUrl, $psFilename, $pbOverwrite)
	{
		$oCurl = curl_init();	
		$sPath = self::LARGE_URL_DIR."/".$psFilename;
		
		//check the folder is there
		if (!is_dir( self::LARGE_URL_DIR)){
			cDebug::write("making cache dir ".self::LARGE_URL_DIR);
			mkdir(self::LARGE_URL_DIR, 0700, true);
		}
		
		//check whether the file exists
		if (!$pbOverwrite &&file_exists($sPath)){
			cDebug::write("file exists $sPath");
			return $sPath;
		}
		
		//ok get the file
		cDebug::write("getting url: $psUrl ");
		self::$progress_len = 0;
		self::$progress_count = 0;
		
		$fHandle = fopen($sPath, 'w');
		curl_setopt($oCurl, CURLOPT_URL, $psUrl);
		curl_setopt($oCurl, CURLOPT_FAILONERROR, 1);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 0);
		curl_setopt($oCurl, CURLOPT_PROGRESSFUNCTION, '__progress_callback');
		curl_setopt($oCurl, CURLOPT_NOPROGRESS, false); // needed to make progress function work

		curl_setopt($oCurl, CURLOPT_FILE, $fHandle);
		$iErr = 0;
		set_time_limit(600);
		$response = curl_exec($oCurl);
		$iErr = curl_errno($oCurl);
		if ($iErr!=0 ) 	print curl_error($oCurl)."<p>";
		curl_close($oCurl);
		fclose($fHandle);
		cDebug::write("ok got $psUrl ");

		if ($iErr !=0){
			unlink($sPath);
			throw new Exception("ERROR URL was: $psUrl <p>");
		}

		
		return $sPath;
	}
}

function __progress_callback($resource, $dl_size, $dl, $ul_size, $ul){
	
	cHttp::$progress_count++;
	if (cHttp::$progress_count < 20) return;
	cHttp::$progress_count  = 0;
	
	cHttp::$progress_len++;
	if (cHttp::$progress_len > 120){ 
		cHttp::$progress_len = 0; 
		echo "<br>";
	}
	echo "*";
	ob_flush();
	flush();
}
?>