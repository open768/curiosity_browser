<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 -2015

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	$root=realpath("../..");
	require_once("$root/php/common.php");
	require_once("$phpinc/ckinc/pichighlight.php");
	require_once("$phpinc/ckinc/indexes.php");
	require_once("$phpinc/ckinc/common.php");
	
	cDebug::check_GET_or_POST();

	
	//***************************************************
	$sOperation = $_GET["o"] ;
	$oResult = null;
	
	switch($sOperation){
		case "add":
			$sUser = cAuth::must_get_user();
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$top= $_GET["t"];
			$left= $_GET["l"];
			$oResult = cImageHighlight::set( $sSol, $sInstrument, $sProduct, $top, $left, $sUser);
			break;
		case "get":
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$oResult = cImageHighlight::get( $sSol, $sInstrument, $sProduct);
			break;
		case "thumbs":
			$sSol = $_GET["s"];
			$sInstrument= $_GET["i"];
			$sProduct= $_GET["p"];
			$oResult = cImageHighlight::get_thumbs( $sSol, $sInstrument, $sProduct);
			break;
			
		case "solcount":
			$sSol = $_GET["s"];
			$oResult = cIndexes::get_solcount( $sSol, cImageHighlight::INDEX_SUFFIX);
			break;
			
		case "topsolindex":
			
			//unfortunately cant display count of highlights as i've hard coded 1 as the index value, 
			//regardless of how many highlights --OOPS - needs a change to the underlying lack of data model.
			//update when going to sql lite
			$oResult = cIndexes::get_top_sol_data( cImageHighlight::INDEX_SUFFIX);
			
			break;
			
		case "soldata":
			$oResult = cImageHighlight::get_sol_highlighted_products( $_GET["s"]);
			break;
			
		case "mosaic":
			$sSol = $_GET["s"];
			$sURL = cImageHighlight::get_sol_high_mosaic($sSol);
			$oResult = [
				"s" => $sSol,
				"u" => $sURL
			];	
			break;
			
		default:
			cDebug::error("unsupported operation");
			break;
	}
	
	//***************************************************
	//output the tags
	cCommon::write_json($oResult);
?>