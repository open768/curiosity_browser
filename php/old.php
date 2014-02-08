<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");
	
	cDebug::$DEBUGGING=true;
	const INPUT__INSTRUMENT ="II";
	const INPUT__SOL ="IS";
	const MAX_DISPLAY = 5;

//***********************************************************************************
function show_sols_list()
{
	$oManifest = cCuriosity::getManifest();
	$aSols = $oManifest->sols;
	
	
	$sHTML='<select name="SOL" size="10" id="list" name="list" onchange="clicklist()" ondblclick = "submitform()"';
	foreach ($aSols as $oSol){
		$iSol = $oSol->sol;
		$sDate = $oSol->last_updated;
		$sHTML .= "<option value='$iSol'>sol $iSol&nbsp;|&nbsp; $sDate";
	}
	$sHTML .="</select>";
	
	return $sHTML;
}

//***********************************************************************************
function show_instruments_list(){
	$sHTML = "";
	$aList = cCuriosity::getInstrumentList();

	foreach ($aList as $sKey=>$sCaption){
		$sHTML.="<input type='radio' name='".INPUT__INSTRUMENT."' value='$sKey'>$sCaption</input><br>";
	}
	return $sHTML;
}

//***********************************************************************************
function main($pSol, $psInstrument){
	$oData = cCuriosity::getSolData($pSol, $psInstrument);
	if (count($oData->data) == 0){
		echo "No Data";
	}else{
		echo "<h1>data for $psInstrument instrument on Sol $pSol</h1>";
		foreach ($oData->data as $oItem){
			$sUrl=$oItem["u"];
			$sDate=$oItem["d"];
			echo "$sUrl<br>$sDate<p>";
		}
	}
}

if (isset($_POST[INPUT__SOL]) && $_POST[INPUT__SOL] && isset($_POST[INPUT__INSTRUMENT])){ 	
	$sSol = $_POST[INPUT__SOL];
	$sInstrument = $_POST[INPUT__INSTRUMENT];
	cDebug::write("SOL=$sSol, Instrument=$sInstrument ");
	main($sSol, $sInstrument);
}else{
	?>
		<LINK href="css/css.css" rel="stylesheet" type="text/css">
		<table border="1" width=100%>
			<tr>
				<td rowspan="2" width="50" class="form">
					<form method=post name="sols" id="sols">
						sol: <input type="text" size="5" id="<?=INPUT__SOL?>" name="<?=INPUT__SOL?>">
						<br>
						<?=show_sols_list()?>
						<?=show_instruments_list()?>
						<br>
						<input type="submit" name="s" id="s">
					</form>
				</td>
				<td id="Controls" class="controls">
					controls Go Here
					<button id="previous">&lt;</button>
					<button id="next">&gt;</button>
				</td>
			</tr>
			<tr><td id="images" class="images">
				images  go here
			</td></tr>
		</table>
	<?php
}



?>