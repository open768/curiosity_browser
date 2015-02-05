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
require_once "$root/php/inc/header.php";

class cAuth{
	const ROLES_FOLDER = "[roles]";
	
	//**********************************************************
	public static function get_user(){
		cHeader::start_session();
		cDebug::write("getting user from facebook");		//twitter TBD
		$sUser = cFacebook::getSessionUser();
		cDebug::write("user is $sUser");
		return $sUser;
	}
	
	public static function get_user_id(){
		cHeader::start_session();
		$sUserID = cFacebook::getSessionUserID();
		cDebug::write("user ID is $sUserID");
		return $sUserID;
	}
		
	public static function add_to_role($psUserID, $psRole){
		$aRoleDetails = cObjStore::get_file(self::ROLES_FOLDER, $psRole);
		if (!$aRoleDetails) $aRoleDetails = [];
		if (! array_key_exists( $psUserID, $aRoleDetails)){
			cDebug::write("Adding $psUserID to role $psRole");
			$aRoleDetails[$psUserID] = true;
			cObjStore::put_file(self::ROLES_FOLDER, $psRole,$aRoleDetails );
		}
	}
	
	public static function is_role( $psRole){
		global $root;
		
		//check whether this role is in the list of roles that the user has.
		$sUserID = self::get_user_id();
		if ($sUserID == null){
			cDebug::write("no user ID found in session");
			return false;
		}

		$aRoleDetails = cObjStore::get_file(self::ROLES_FOLDER, $psRole);
		if (!$aRoleDetails){
			cDebug::write("role '$psRole' is not known");
			return false;
		}
		
		$bResult = array_key_exists($sUserID, $aRoleDetails );
		cDebug::write("user '$sUserID' role '$psRole' result '$bResult'");
		return $bResult;
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