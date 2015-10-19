<?php
	$root=realpath("../..");
	$phpinc=realpath("../../../phpinc");
	require_once("$phpinc/ckinc/session.php");
	cSession::set_folder();
	session_start();
	
	require_once("$phpinc/ckinc/debug.php");
	
	phpinfo();
	cDebug::check_GET_or_POST();
	cDebug::vardump(ini_get_all());
?>