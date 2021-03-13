<?php
	$root=realpath("../..");
	require_once("$root/php/common.php");
	
	phpinfo();
	cDebug::vardump(ini_get_all());
?>