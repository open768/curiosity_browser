<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/debug.php");

	cDebug::$DEBUGGING=true;
	$sCurrent="";
	if (isset($_POST["s"])){
		$sCurrent=$_POST["sol"];
	}
	

//##########################################################################
class cInstrument{
	public $instrument;
	public $data;
	
	function __construct($psInstrument) {
		$this->instrument = $psInstrument;
		$this->data = array();
	}
	
	public function add($psInstrument, $psDate, $psUrls){
		if ($psInstrument !== $this->instrument)
			die ("attempting to add wrong instrument data");
		
		array_push($this->data, array("d" => $psDate, "u" => $psUrls));
	}
}
//##########################################################################
function show_sols()
{
	$sHTML = "";
	$oManifest = cCuriosity::getManifest();
	$aSols = $oManifest->sols;
	foreach ($aSols as $oSol){
		$iSol = $oSol->sol;
		$sDate = $oSol->last_updated;
		$sHTML .= "<option value='$iSol'>sol $iSol&nbsp;|&nbsp; $sDate";
	}
	
	return $sHTML;
}



//##########################################################################
function display_results($paInstruments){

	//---display table of contents instruments
	?>
		<h1>TOC</h1>
		<ul>
	<?php
		foreach ($paInstruments as $sInstrument=>$oInstrument){
			?>
				<li><a href="#<?=$sInstrument?>"><?=$sInstrument?></a>
			<?php
		}
	?>
		</ul>
		<p>
		
		<h1>Instruments</h1>
	<?php
	
	//---display data properly
	foreach ($paInstruments as $sInstrument=>$oInstrument){
		?>
			<h2>Instrument: <a name="<?=$sInstrument?>"><?=$sInstrument?></a></h2>
			<table border=1 cellspacing=0>
		<?php
		foreach ($oInstrument->data as $aItem){
			$sDate = $aItem["d"];
			$sUrl = $aItem["u"];
			?>
				<tr>
					<td><?=$sDate?><br>
					<td><?=$sUrl?><br>
					<td><img src="<?=$sUrl?>" alt="<?=$sDate?>"></td>
				</tr>
			<?php
		}
	}
}

//*********************************************************************
function  show_form(){
	?>
	<script src="functions.js"></script>
	<form method=post name="sols" id="sols">
		<table border=0>
		<tr><td>
			sol: <input type="text" size="5" id="sol" name="sol">
		</td></tr>
		<tr><td>
			<select name="SOL" size="10" id="list" name="list" onchange="clicklist()" ondblclick = "submitform()">
				<?=show_sols()?>
			</select>
		</td></tr>
		<tr><td>
			<input type="submit" name="s" id="s">
		</td></tr>
	</form>
	<?php
}

//##########################################################################
function main($pSol){
	$sol = $_POST["sol"];
	$oResponse = cCuriosity::getSolData($sol);
	$aInstruments = cCuriosity::build_SolData( $oResponse);
	display_results($aInstruments);
}

if (isset($_POST["sol"])){ 	
	$sol=$_POST["sol"];
	main($sol);
}else
	show_form();



?>