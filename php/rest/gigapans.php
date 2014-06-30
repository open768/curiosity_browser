<?php
	//from the marvellous work of Nev Thompson http://www.gigapan.com/profiles/pencilnev
	
	$root=realpath("../..");
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/gigapan.php");
	
	//cDebug::$DEBUGGING = true;
	if (isset($_GET["page"] ))  
		$iPage = (int) $_GET["page"];
	else
		$iPage = 1;
	
	$oData = cGigapan::get_gigapans("pencilnev",$iPage);
	
	$aItems = $oData["d"];
	echo "<ul>";
	foreach ($aItems as $aItem){
		$sId = $aItem["I"];
		$sDescrip = $aItem["D"];

		echo "<li><a target='giga' href='http://www.gigapan.com/gigapans/$sId'>$sDescrip</a>";
	}
	echo "</ul><p>";
	$iPage++;
	
	echo "<a href='gigapans.php?page=$iPage'>Next</a>";
?>
<hr>
from the marvellous work of Nev Thompson on <a target="gprofile" href="http://www.gigapan.com/profiles/pencilnev">Gigapan.com</a>