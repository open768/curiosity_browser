<?php
	$home = "../..";
	require_once("$home/php/common.php");
	require_once("$spaceinc/misc/pencilnev.php");
	
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
