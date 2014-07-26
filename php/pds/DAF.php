<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
// based on specifications found at  http://naif.jpl.nasa.gov/pub/naif/toolkit_docs/C/req/daf.html
**************************************************************************/

require_once("$root/php/inc/debug.php");
require_once("$root/php/inc/http.php");
require_once("$root/php/inc/objstore.php");
require_once("$root/php/inc/gz.php");
require_once("$root/php/inc/static.php");
require_once("$root/php/inc/common.php");
require_once("$root/php/inc/hash.php");


class cPDS_DAFReader{
	//**********************************************************************
	public function parseURL( $psUrl){
		//fetch and compress url
		//open a stream from the file
		//read the header of the file
		//read the body of the file
		//close the file
	}
}
?>