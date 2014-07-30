<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

require_once("$root/php/inc/debug.php");

class cCommon{
	public static function write_json($poThing){
		if (cDebug::$DEBUGGING){
			cDebug::write("json output:");
			cDebug::vardump($poThing);
		}else
			echo json_encode($poThing );
	}
	
	public static function serialise($poThing){
		if (!is_object($poThing)) cDebug::error("not an object");
		return get_object_vars($poThing); 
	}
}