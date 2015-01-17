<?php
require_once("$root/php/curiosity/curiosity.php");
require_once("$root/php/inc/pichighlight.php");
require_once("$root/php/inc/debug.php");
require_once("$root/php/inc/common.php");
require_once("$root/php/facebook/autoload.php");
use Facebook\FacebookSession;
use Facebook\FacebookRequest;
use Facebook\GraphUser;	
	
//###########################################################################
//#
//###########################################################################
class cFacebookTags{
//*******************************************************************
	public static function make_fb_detail_tags(){
		cDebug::check_GET_or_POST();

		$sSol = $_GET["s"] ;
		$sInstrument = $_GET["i"];	
		$sProduct = $_GET["p"];
		
		cDebug::write("getting product details for $sSol, $sInstrument, $sProduct");
		$oInstrumentData = cCuriosity::getProductDetails($sSol, $sInstrument, $sProduct);	
		cDebug::vardump($oInstrumentData);
		?>
		<html><head>
			<title>Curiosity Browser Detail </title>
			<meta property="og:title" content="Curiosity Browser Detail" />
			<meta property="og:image" content="<?=$oInstrumentData["d"]["i"]?>" />
			<meta property="og:description" content="for sol:<?=$sSol?>, instrument:<?=$sInstrument?>, product:<?=$sProduct?>. Data courtesy MSSS/MSL/NASA/JPL-Caltech." />
			<meta property="og:url" content="http://www.mars-browser.co.uk<?=$_SERVER["REQUEST_URI"]?>" />
		</head></html>
		<?php
	}
	
	//*******************************************************************
	public static function make_fb_sol_high_tags(){
		cDebug::check_GET_or_POST();

		$sSol = $_GET["s"] ;
		
		cDebug::write("getting highlight details for $sSol");
		$sFilename  = cImageHighlight::get_sol_high_mosaic($sSol);	
		cDebug::write("<img src='$sFilename'>");
		?>
		<html><head>
			<title>Curiosity Browser Highlights</title>
			<meta property="og:title" content="Curiosity Browser - Highlights" />
			<meta property="og:image" content="<?=$sFilename?>" />
			<meta property="og:description" content="Highlights for sol:<?=$sSol?>, Image Data courtesy MSSS/MSL/NASA/JPL-Caltech." />
			<meta property="og:url" content="http://www.mars-browser.co.uk<?=$_SERVER["REQUEST_URI"]?>" />
		</head></html>
		<?php
	}
}

//###########################################################################
//#
//###########################################################################
class cFacebook{
	const FB_USER_FOLDER = "[facebook]";
	
	//*******************************************************************
	public static function is_facebook(){
		//force on query string
		if (isset($_GET["fb"])) return true;
		
		//user agent is like facebookexternalhit/1.1
		return preg_match("/facebook/", strtolower ($_SERVER['HTTP_USER_AGENT']));
	}
	
	
	//*******************************************************************
	private static function pr_setSessionUser($poGraphObject){
		$sFirstName = $poGraphObject->getProperty("first_name");
		$sLastName = $poGraphObject->getProperty("last_name");
		$sUser = "$sFirstName $sLastName";
		$_SESSION["fbuser"] = $sUser;
		return $sUser;
	}
	
	//*******************************************************************
	public static function getSessionUser(){
		//get the user from the session
		if (isset($_SESSION["fbuser"]))			
			return $_SESSION["fbuser"];
		else
			return null;
	}
	
	//*******************************************************************
	public static function getStoredUser($psUserID){
	
		$sUser = self::getSessionUser();
				
		//is this user details stored?
		if (!$sUser){
			cDebug::write("username not in session, checking if known");
		
			
			$oGraphObject = cObjStore::get_file(self::FB_USER_FOLDER, $psUserID);
			if ($oGraphObject){
				cDebug::write("found stored user");
				//$aNames = $oGraphObject->getPropertyNames();
				$sUser = self::pr_setSessionUser($oGraphObject);
			}
		}
		
		return $sUser;
	}
	
	//*******************************************************************
	private static function pr_storeUserDetails($psUserID, $poData){
		//store the details
		cObjStore::put_file(self::FB_USER_FOLDER,$psUserID, $poData);
		
		//add to list of FB users (using hash to obfuscate for security)
		$sAllUsersFile = "AllFBusers".cSecret::FB_SECRET;
		$aFBUsers = cHash::get($sAllUsersFile);
		if (!$aFBUsers) $aFBUsers = [];
		$aFBUsers[$psUserID] = 1;
		cHash::put($sAllUsersFile, $aFBUsers, true);
	}
	
	//*******************************************************************
	public static function getUserIDDetails($psUserID, $psToken){
		//initialise facebook
		if (cHeader::is_localhost()){
			$fbAppID = cSecret::FB_DEV_APP;
			$fbAppSecret = cSecret::FB_DEV_SECRET;
			cDebug::write("using development credentials for localhost");
		}else{
			$fbAppID = cSecret::FB_APP;
			$fbAppSecret = cSecret::FB_SECRET;
		}
		FacebookSession::setDefaultApplication($fbAppID, $fbAppSecret);
		cDebug::write("FBAPP: $fbAppID");
				
		$oSession = new FacebookSession($psToken);
		try {
			$oSession->validate();
		} catch (Exception $ex) {
			cDebug::error("failed FB session: ". $ex->getMessage());
		}
		cDebug::write("FB session OK");
		
		//get the details of the user from facebook 
		$oFBRequest = new FacebookRequest( $oSession, 'GET', '/me');
		$oFBResponse = $oFBRequest->execute();
		$oGraphObject = $oFBResponse->getGraphObject();
		//cDebug::vardump($oGraphObject);
		
		//remember this user
		$sUser = self::pr_setSessionUser($oGraphObject);
		self::pr_storeUserDetails( $psUserID, $oGraphObject);
		
		return $sUser;
	}
}
?>