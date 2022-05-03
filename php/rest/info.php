<?php
	$home = "../..";
	require_once("$home/php/common.php");
	
	phpinfo();
	cDebug::vardump(ini_get_all());
?>