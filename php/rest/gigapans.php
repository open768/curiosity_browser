<?php
	$root=realpath("../..");
	$phpinc=realpath("../../../phpinc");
	
	require_once("$phpinc/ckinc/debug.php");
	require_once("$root/php/static/static.php");
	require_once("$phpinc/ckinc/common.php");
	require_once("$phpinc/ckinc/pencilnev.php");
	
	cDebug::check_GET_or_POST();

	$aData = null;
	switch ( $_GET["o"]){
		case "sol":
			$aData = cPencilNev::get_sol_gigas( $_GET["s"]);
			break;
		case "all":
			$aData = cPencilNev::get_top_gigas();
			break;
	}
	cCommon::write_json($aData);
?>
