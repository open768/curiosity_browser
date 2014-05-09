<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

class cDebug{
	public static $DEBUGGING=false;
	
	public static function write($poThing){
		if (self::$DEBUGGING){
			$sDate = date('d-m-Y H:i:s');
			echo "<p><font color=red><code>$sDate: $poThing</code></font><p>";
			ob_flush();
			flush();
		}
	}
	
	//**************************************************************************
	public static function vardump( $poThing){
		if (self::$DEBUGGING){
			echo "<table border=1 width=100%><tr><td><PRE>";
			var_dump($poThing);
			echo "</PRE></td></tr></table>";
			ob_flush();
			flush();
		}
	}

	//**************************************************************************
	public static function error($psText){
		self::write("error: <$psText");
		throw new Exception($psText);
	}
	
	//**************************************************************************
	public static function check_GET_or_POST(){
		global $_GET, $_POST;
		
		self::$DEBUGGING = (isset($_GET["debug"]) || isset($_POST["debug"]));
	}
	
	
	
}