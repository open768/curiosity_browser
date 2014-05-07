<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$root/php/inc/debug.php");
require_once("$root/php/inc/cached_http.php");
$count =0;
	
class cPDS_LBL{
	protected $aData = [];
	public $sName = "TOP";

	//*****************************************
	public function parseFileHandle($pfHandle){
		$bInString = false;
		$sStringName = null;
		$sStringValue = null;
		
		while(!feof($pfHandle)){
			//--- process a line at a time
			$line = fgets($pfHandle);
			$line = trim($line);
			if ($line == "") 	continue;
			//cDebug::write("line: $line");
			
			if ($bInString){
				//-- was inside a string - check whether string has ended
				$sStringValue .=  " $line";
				$chLast = substr($line,-1);
				// at end of string  - set and clear buffers
				if ( $chLast === '"'){
					//cDebug::write("end of string");
					$sStringValue = substr($sStringValue, 1, strlen($sStringValue)-2);
					$this->set($sStringName, $sStringValue);
					$bInString = false;
					$sStringName = null;
					$sStringValue = null;
				}
			}else{
				//-- not  inside a string - split line into keys and values
				$aVar = explode("=", $line);
				if (count($aVar) != 2) continue;
				
				$sKey = trim($aVar[0]);
				$sValue = trim($aVar[1]);
				if ($sValue == "") continue;
				
				// look for end object
				if ($sKey === "END_OBJECT"){
					//cDebug::write("End Object ". $this->sName);
					break;
				}
				
				//-- look for specific keywords
				if ($sValue[0] == '"'){
					//-- starting a string
					if (substr($sValue,-1) == '"'){
						// if the first and last characters are quotes
						$sValue = substr($sValue, 1, strlen($sValue)-2);
						$this->set($sKey, $sValue);
					}else{
						$bInString = true;
						$sStringName = $sKey;
						$sStringValue = $sValue;
					}
				}elseif ($sKey === "OBJECT"){
					// process objects
					$oObj = new cPDS_LBL;
					$oObj->sName = $sValue;
					$oObj->parseFileHandle($pfHandle);
					$this->set($sValue, $oObj); 
				}else{
					//-- normal line
					$this->set($sKey, $sValue);
				}
			}
		}
	}
	
	//*****************************************
	function set($psName, $psValue){
		//if the key exists make it into an array
		if (array_key_exists($psName, $this->aData)){
			if (gettype($this->aData[$psName]) === "array"){
				$this->aData[$psName][]= $psValue;
			}else{
				$sOrig = $this->aData[$psName];
				$this->aData[$psName] = [$sOrig];
			}
		}else
			$this->aData[$psName]= $psValue;
	}
	
	//*****************************************
	function get($psName){
		//if the key exists make it into an array
		if (array_key_exists($psName, $this->aData))
			return $this->aData[$psName];
		else
			return null;
	}
	
	//*****************************************
	public function __toString(){
        return 'LBL Object';
    }
	
	//*****************************************
	public function parseFile($psfilename){
		//open the file for read only
		$fHandle = fopen($psfilename, 'r');
		try{
			$this->parseFileHandle($fHandle);
		}catch(Exception $e){}
		fclose($fHandle);
		
	}
}
?>