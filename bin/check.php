<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 -2015

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/	

	$home="..";
	$sCommonFile = "$home/php/common.php";
	if (!is_file($sCommonFile)){
		print "common file not found $sCommonFile - edit \$home variable in ".__FILE__;
		exit(1);
	}

	//-------------------------------------------------------------------
	$bErr = false;
	try{
		require_once($sCommonFile);
	}
	catch (Exception $e){
		$sMsg = $e->getMessage();
		print "Oops there was an Error: $sMsg\n\n";
		$bErr = true;
	}
	if (!$bErr)
		print "no immediate problems with $sCommonFile\n";

	//-------------------------------------------------------------------
	$sIniFile = php_ini_loaded_file();
	//check for extensions
	if (!extension_loaded("curl"))
		print "curl extension is not loaded - check ".$sIniFile."\n";
	else
		print "curl extension is loaded \n";

	if (!extension_loaded("sqlite3")) 
		print "sqlite3 extension is not loaded\n\t- check ".$sIniFile."\n";
	else
		print "sqlite3 extension is loaded \n";
	
	//-------------------------------------------------------------------
	//check for existance of phpinc
	if (is_dir($phpinc))
		print "\$phpinc found $phpinc\n";
	else{
		print "couldnt find \$phpinc: $phpinc\n";
		//lets find it
	}

	//-------------------------------------------------------------------
	//check for existance of jsinc
	$sDir = __DIR__."/".$jsinc;
	if (!is_dir($sDir))
		print "couldnt find \$jsinc: $sDir \n\t- check $sCommonFile\n";
	else
		print "\$jsinc found $sDir\n";

?>