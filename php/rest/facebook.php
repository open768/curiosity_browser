<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2015 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	$root=realpath("../..");
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/auth.php");
	require_once("$root/php/inc/common.php");
	require_once("$root/php/inc/header.php");
	require_once("$root/php/inc/secret.php");
	require_once("$root/php/inc/hash.php");
	require_once("$root/php/inc/facebook.php");
	
	//load facebook classes
	require_once("$root/php/facebook/autoload.php");
	use Facebook\FacebookSession;
	use Facebook\FacebookRequest;
	use Facebook\GraphUser;	
	
	cDebug::check_GET_or_POST();
	
	//***************************************************
	//check inputs
	$sUserID=cHeader::get("user");
	if (!$sUserID) cDebug::error("user parameter missing");
	cDebug::write("userID: $sUserID");
				
	$sToken=cHeader::get("token");
	if (!$sToken) cDebug::error("token parameter missing");
	cDebug::write("access token: $sToken");
	
	//***************************************************
	$sUser = null;
	

	$sOperation = cHeader::get("o");
	switch($sOperation){
		case "getuser":
			if (session_status() == PHP_SESSION_NONE) session_start();
			
			$sUser = cFacebook::getStoredUser($sUserID);
			
			//finally get user details from facebook
			if (!$sUser){
				cDebug::write("user not known getting  from Facebook");
				$sUser = cFacebook::getUserIDDetails($sUserID,$sToken );
			}
			break;
		default:
			cDebug::error("unrecognised operation $sOperation");
	}
	
	//***************************************************
	//output the 
	cCommon::write_json($sUser);
?>