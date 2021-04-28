<?php
	//start the session first ask questions later
	$phpinc = realpath("$root/../phpinc");		//have to set phpinc here- even though it will get overwritten by header.php
	require_once "$phpinc/ckinc/header.php";	//this starts the session
	
	//includes
	require_once "$phpinc/ckinc/secret.php";
	require_once "$phpinc/ckinc/common.php";
	require_once "$phpinc/ckinc/auth.php" ;
	require_once "$spaceinc/curiosity/curiosity.php" ;
	require_once "$spaceinc/curiosity/static.php" ;
	
	//check if debugging is needed
	require_once("$phpinc/ckinc/debug.php");
	cDebug::check_GET_or_POST();


	
	//requests without www get redirected to http
	if (!cHeader::is_localhost()){
		if ( strpos($_SERVER["HTTP_HOST"],'www') === false){
			$newURL = "http://www.".$_SERVER["HTTP_HOST"].$_SERVER["REQUEST_URI"];
			cHeader::redirect($newURL);
			end;
		}
		
		//requests without https get redirected to https
	}
	

?>