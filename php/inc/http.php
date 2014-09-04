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
	const LARGE_URL_DIR = "[cache]/[Largeurls]";
	public static $progress_len = 0;
	public static $progress_count = 0;
	public static $show_progress = false;
	
	//*****************************************************************************
	public static function getXML($psURL){
		cDebug::write("Getting XML from: $psURL");
		$sXML = cCachedHttp::getCachedUrl($psURL);
		cDebug::write("converting string to XML: ");
		$oXML = simplexml_load_string($sXML);
		cDebug::write("finished conversion");
		return $oXML;
	}

	//*****************************************************************************
	public static function getJson($psURL){
		$response = self::fetch_url($psURL);
		$oResponse = json_decode($response);
		
		return $oResponse;
	}
	
	//*****************************************************************************
	public static function fetch_image($psUrl){
		$oCurl = curl_init();	
		curl_setopt($oCurl, CURLOPT_URL, $psUrl);
		curl_setopt($oCurl, CURLOPT_FAILONERROR, 1);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($oCurl, CURLOPT_BINARYTRANSFER, 1); 
		
		if (self::$show_progress)
			curl_setopt($oCurl, CURLOPT_PROGRESSFUNCTION, '__progress_callback');
			
		if (CURL_USE_PROXY){
			curl_setopt($oCurl, CURLOPT_PROXY, CURL_PROXY);
			curl_setopt($oCurl, CURLOPT_PROXYPORT, CURL_PROXYPORT );
		}
		
		if (self::$show_progress){
			curl_setopt($oCurl, CURLOPT_NOPROGRESS, false); // needed to make progress function work
			self::$show_progress = false;
		}
		
		$response = curl_exec($oCurl);
		$iErr = curl_errno($oCurl);
		if ($iErr!=0 ) {
			print curl_error($oCurl)."<p>";
			curl_close($oCurl);
			throw new Exception("ERROR URL was: $psUrl <p>");
		}else
			curl_close($oCurl);
		
		$oImage = imagecreatefromstring($response);
	
		return  $oImage;
	}
	
	//*****************************************************************************
	public static function fetch_url($psUrl){
		$oCurl = curl_init();	
		curl_setopt($oCurl, CURLOPT_URL, $psUrl);
		curl_setopt($oCurl, CURLOPT_FAILONERROR, 1);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 1);

		if (self::$show_progress)
			curl_setopt($oCurl, CURLOPT_PROGRESSFUNCTION, '__progress_callback');
		
		//use gzip compression to save bandwidth
		curl_setopt($oCurl, CURLOPT_ENCODING, 'gzip'); 
		
		if (CURL_USE_PROXY){
			curl_setopt($oCurl, CURLOPT_PROXY, CURL_PROXY);
			curl_setopt($oCurl, CURLOPT_PROXYPORT, CURL_PROXYPORT );
		}

		if (self::$show_progress){
			curl_setopt($oCurl, CURLOPT_NOPROGRESS, false); // needed to make progress function work
			self::$show_progress = false;
		}
		
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
	public static function fetch_to_file($psUrl, $psPath, $pbOverwrite=false, $piTimeOut=60){
		//check whether the file exists
		if (!$pbOverwrite &&file_exists($psPath)){
			cDebug::write("file exists $psPath");
			return $psPath;
		}
		
		//ok get the file
		cDebug::write("getting url: $psUrl ");
		self::$progress_len = 0;
		self::$progress_count = 0;
		
		$fHandle = fopen($psPath, 'w');
		$oCurl = curl_init();	
		curl_setopt($oCurl, CURLOPT_URL, $psUrl);
		curl_setopt($oCurl, CURLOPT_FAILONERROR, 1);
		curl_setopt($oCurl, CURLOPT_RETURNTRANSFER, 0);
		if (self::$show_progress)
			curl_setopt($oCurl, CURLOPT_PROGRESSFUNCTION, '__progress_callback');
			
		if (CURL_USE_PROXY){
			curl_setopt($oCurl, CURLOPT_PROXY, CURL_PROXY);
			curl_setopt($oCurl, CURLOPT_PROXYPORT, CURL_PROXYPORT );
		}
		if (self::$show_progress){
			curl_setopt($oCurl, CURLOPT_NOPROGRESS, false); // needed to make progress function work
			self::$show_progress = false;
		}

		curl_setopt($oCurl, CURLOPT_FILE, $fHandle);
		$iErr = 0;
		set_time_limit($piTimeOut);
		$response = curl_exec($oCurl);
		$iErr = curl_errno($oCurl);
		if ($iErr!=0 ) 	print curl_error($oCurl)."<p>";
		curl_close($oCurl);
		fclose($fHandle);
		cDebug::write("ok got $psUrl ");

		if ($iErr != 0){
			unlink($psPath);
			throw new Exception("ERROR URL was: $psUrl <p>");
		}

		return $psPath;
	}
	
	//*****************************************************************************
	public static function large_url_path($psFilename){
		global $root;
		
		$sDir = "$root/".self::LARGE_URL_DIR;
		return "$sDir/$psFilename";
	}
	
	//*****************************************************************************
	public static function fetch_large_url($psUrl, $psFilename, $pbOverwrite=false)
	{
		global $root;
		
		//check the folder is there
		$sDir = "$root/".self::LARGE_URL_DIR;
		if (!is_dir( $sDir)){
			cDebug::write("making cache dir $sDir");
			mkdir($sDir, 0700, true);
		}
		
		$sPath = self::large_url_path($psFilename);
		self::$show_progress = true;
		return self::fetch_to_file($psUrl, $sPath, $pbOverwrite, 600);
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