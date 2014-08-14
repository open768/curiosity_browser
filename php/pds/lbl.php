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
		$bInComment = false;
		$bInBrackets = false;
		$sStringName = null;
		$sStringValue = null;
		$sBracketName = null;
		$sBracketValue = null;
		
		while(!gzeof($pfHandle)){
			//--- process a line at a time
			$line = gzgets($pfHandle);
			$line = trim($line);
			if ($line == "") 	continue;  //empty line
			//cDebug::write("<font color=blue>line: $line</font>");
			
			if ($bInString){
				//-- was inside a string - check whether string has ended
				$sStringValue .=  "\n$line";
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
			}elseif ( $bInComment){
				if (substr($line,-2) === "*/")
					$bInComment = false;
			}elseif ( $bInBrackets){
				$sBracketValue .= $line;
				if (substr($line,-1) === ")"){
					$sBracketValue = substr($sBracketValue, 1, strlen($sBracketValue)-2);
					$aData = str_getcsv ($sBracketValue);
					$this->set($sBracketName, $aData);
					$bInBrackets = false;
				}
			}else{
				//-- not  inside a string - split line into keys and values
				$aVar = explode("=", $line);
				
				$sKey = trim($aVar[0]);
				//cDebug::write("Key is '$sKey'");
				
				// look for end object
				if ($sKey === "END_OBJECT" || $sKey === "END_GROUP")
					break;

				//ignore blank data
				if (count($aVar) != 2) continue;
				$sValue = trim($aVar[1]);
				if ($sValue == "") continue;
				
				
				//-- look for specific keywords
				if ($sValue[0] == '"'){
					//-- starting a string
					if (substr($sValue,-1) == '"'){
						// if the first and last characters are quotes
						$sValue = substr($sValue, 1, strlen($sValue)-2);
						$this->set($sKey, $sValue);
					}else{
						//cDebug::write("in string");
						$bInString = true;
						$sStringName = $sKey;
						$sStringValue = $sValue;
					}
				}elseif ($sValue[0] == '('){
					//-- starting a bracket
					if (substr($sValue,-1) == ')'){
						// if the first and last characters are quotes
						$sValue = substr($sValue, 1, strlen($sValue)-2);
						$aData = str_getcsv ($sValue);
						$this->set($sKey, $aData);
					}else{
						$bInBrackets = true;
						$sBracketName = $sKey;
						$sBracketValue = $sValue;
					}
				}elseif ($sKey === "OBJECT" || $sKey === "GROUP"){
					//cDebug::write("Object ". $sValue);
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
		if ($psName == ""){
			cDebug::write("attempt to write empty key");
			return;
		}
		
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
		if (array_key_exists($psName, $this->aData))
			return $this->aData[$psName];
		else
			return null;
	}
	
	protected function pr__do_dump_write($psKey, $poValue, $psPrefix){
		$sType = gettype($poValue);
		switch($sType){
			case "string": 
				echo "$psPrefix$psKey : $poValue\n"; 
				break;
			case "object":
				$sClass = get_class($poValue);
				echo "\n$psPrefix<font color=red>$psKey</font> :\n"; 
				$poValue->pr__do_dump("\t$psPrefix");
				break;
			case "array":
				echo "$psPrefix$psKey :\n"; 
				for ($i=0; $i<count($poValue); $i++)
					$this->pr__do_dump_write("[$i]", $poValue[$i], "\t$psPrefix");
				break;
			default:
				echo "$psPrefix$psKey : [$sType]\n"; 
		}
	}
	//*****************************************
	protected function pr__do_dump( $psPrefix){	
		foreach ($this->aData as $sKey=>$oValue)
			$this->pr__do_dump_write($sKey, $oValue, $psPrefix);
		echo "\n";
	}
	//*****************************************
	function __dump( $psPrefix=""){
		echo "<hr><pre>";
			$this->pr__do_dump($psPrefix);
		echo "</pre><hr>";
	}
	
	//*****************************************
	public function __toString(){
        return 'LBL Object';
    }
	
	//*****************************************
	public function parseFile($psFile){
		//open the file for read only
		cDebug::write("Parsing LBL: $psFile");
		$fHandle = gzopen($psFile, 'rb');
		$this->parseFileHandle($fHandle);
		gzclose($fHandle);
		
	}
}
?>