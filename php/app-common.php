<?php
	//**********************************************************************************
	$root=realpath($home);
	$AppJS = "$home/js";
	$AppJSWidgets = "$AppJS/widgets";
	$jsinc = "$home/../jsinc";			//check this works
	$jsExtra = "$jsinc/extra";
	$phpinc = "$root/../phpinc";		//have to set phpinc here to pull in header.php
	$spaceinc = "$phpinc/space";
	//**********************************************************************************
	
    /** @global cDebug */
	require_once "$phpinc/ckinc/header.php";	//this starts the session
	require_once("$phpinc/ckinc/debug.php");
	
	//check for extensions
	if (!extension_loaded("curl"))
		cDebug::error("curl extension is not loaded - check ".php_ini_loaded_file());
	if (!extension_loaded("sqlite3")) 
		cDebug::error("sqlite3 extension is not loaded - check ".php_ini_loaded_file());
	
	//check if debugging is needed
	cDebug::check_GET_or_POST();

	//requests without https get redirected
	if (!cDebug::is_cli())
		if ($_SERVER["REQUEST_SCHEME"] !== "https"){
			cDebug::extra_debug("request scheme is not https");
			$https_port = "";
			if (cDebug::is_localhost())$https_port = ":8443";
			
			$newURL="https://".$_SERVER["SERVER_NAME"].$https_port.$_SERVER["REQUEST_URI"];
			cHeader::redirect($newURL);
			exit();
		}else{
			cDebug::extra_debug("request scheme is https");		
		}	
	
	//includes
	require_once "$root/php/secret.php";

	require_once "$phpinc/ckinc/common.php";
	require_once "$phpinc/ckinc/auth.php" ;
	require_once "$spaceinc/curiosity/curiosity.php" ;
	require_once "$spaceinc/curiosity/static.php" ;



	cDebug::extra_debug("finished common.php");		
?>