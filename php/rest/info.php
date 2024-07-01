<?php
	$home = "../..";
	require_once("$home/php/app-common.php");
	
	phpinfo();
	cDebug::vardump(ini_get_all());
?>