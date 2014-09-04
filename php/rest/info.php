<?php
	$root=realpath("../..");
	require_once("$root/php/inc/debug.php");
	
	phpinfo();
	cDebug::check_GET_or_POST();
	cDebug::vardump(ini_get_all());
?>