<?php
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% OBJSTORE - simplistic store objects without a database!
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

class cGzip{
	const BUFFER = 512;
	
	public static function readObj($psFile){
		$aLines = gzfile($psFile);
		$sSerialised = implode("",$aLines);
		$sSerialised  = stripslashes($sSerialised);
		$oData = unserialize($sSerialised);
		
		return $oData;
	}
	
	//********************************************************************
	public static function writeObj($psFile, $poData){
		$sSerial = serialize($poData);
		$sSerial = addslashes($sSerial);
		$fp = gzopen($psFile, "wb");
		gzwrite($fp, $sSerial);
		gzclose($fp);
	}
	
	//********************************************************************
	public static function isGzipped($psFilename){
		
		$finfo = new finfo(FILEINFO_MIME_TYPE);
		echo $finfo->file($psFilename);
		
		cDebug::error("debug");
		finfo_close($finfo);
	}
	
	//********************************************************************
	public static function compress_file($psInFile, $psOutFile = null){	
		if ($psOutFile == null)	$psOutFile = "$psInFile.gz";
		if (file_exists($psOutFile)) return;
		
		//write the gzip file chunks at a time
		$fp_in = fopen($psInFile,"r");
		$fp_out = gzopen($psOutFile, "wb");
		while (!feof($fp_in)) 
			gzwrite($fp_out, fread($fp_in, 1024 * self::BUFFER)); 
		fclose($fp_in); 
		gzclose($fp_out);
		
		//delete original with compressed
		unlink ($psInFile);
	}

}

?>
