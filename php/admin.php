<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	require_once("inc/debug.php");
	require_once("inc/tags.php");
	require_once("inc/curiosity/pds.php");
	require_once("inc/curiosity/static.php");
	
	cDebug::check_GET_or_POST();
	
	//***************************************************

	if (! array_key_exists( "o", $_GET)){
		echo "usage: admin.php?o=<i>operation</i>";
		exit();
	}

	$sOperation = $_GET["o"] ;
	$aData = null;
	
	switch($sOperation){
		//------------------------------------------------------
		case "parsePDS":
			if (! array_key_exists( "v", $_GET)){
				echo "usage: admin.php?o=parsePDS&v=volume";
				exit();
			}
			$volume = $_GET["v"];
			cCuriosityPDS::run_indexer($volume);
			break;

		//------------------------------------------------------
		case "killTag":
			if (! array_key_exists( "t", $_GET)){
				echo "usage: admin.php?o=killTag&t=tag";
				exit();
			}
			cTags::kill_tag(OBJDATA_REALM, $_GET["t"]);

			break;

		//------------------------------------------------------
		case "mergeTags":
			throw new Exception("to be done");
			break;
			
		//------------------------------------------------------
		default:
			echo "operations supported: parsePDS killTag mergeTags";
			break;
	}
?>