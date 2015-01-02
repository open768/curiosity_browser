<?php
$root=realpath("./");
require_once("$root/php/curiosity/curiosity.php");
require_once("$root/php/inc/pichighlight.php");
require_once("$root/php/inc/debug.php");
require_once("$root/php/inc/common.php");

class cFacebook{
	
	//*******************************************************************
	public static function is_facebook(){
		//force on query string
		if (isset($_GET["fb"])) return true;
		
		//user agent is like facebookexternalhit/1.1
		return preg_match("/facebook/", strtolower ($_SERVER['HTTP_USER_AGENT']));
	}
	
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
?>