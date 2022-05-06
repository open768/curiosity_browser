<?php
	$root=realpath($home);
	$jsinc = "$home/../jsinc";
	$js = "$home/js";
	$widgets = "$js/widgets";
	$jsExtra = "$jsinc/extra";
	$phpinc = "$root/../phpinc";		//have to set phpinc here to pull in header.php
	$spaceinc = "$phpinc/space";
	
	require_once "$phpinc/ckinc/header.php";	//this starts the session
	
	
	//check if debugging is needed
	require_once("$phpinc/ckinc/debug.php");
	cDebug::check_GET_or_POST();

	//requests without https get redirected
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