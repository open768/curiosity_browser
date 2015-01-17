<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
require_once "$root/php/inc/facebook.php";

class cAuth{
	//**********************************************************
	public static function get_user(){
		if (session_status() == PHP_SESSION_NONE) session_start();
		cDebug::write("getting user from facebook");		//twitter TBD
		return cFacebook::getSessionUser();
	}
	
	public static function must_get_user(){
		$sUser = self::get_user();
		if (!$sUser){ 
			cDebug::vardump($_SESSION);
			cDebug::error("user not logged in");
		}else{
			cDebug::write("user is $sUser");
			return $sUser;
		}
	}
	
}
?>