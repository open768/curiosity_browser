<?php
	$phpinc = realpath("$root/../phpinc");
	$spaceinc = realpath("$root/../spaceinc");
	require_once "$phpinc/ckinc/session.php";
	require_once "$spaceinc/curiosity/static.php";
	cSession::set_folder();
	session_start();
	require_once "$phpinc/ckinc/secret.php";
	require_once("$phpinc/ckinc/debug.php");
	require_once("$phpinc/ckinc/common.php");
	require_once("$phpinc/ckinc/auth.php");
	require_once("$spaceinc/curiosity/curiosity.php");
	require_once("$spaceinc/curiosity/static.php");
	cDebug::check_GET_or_POST();

?>