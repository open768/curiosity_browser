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
	return "<option>nothing";
}



//##########################################################################
function build_SolData($poData){
	$aImages = $poData->images;
	//---build a list of data
	$aInstruments = array();
	foreach ($aImages as $oItem){
		$sInstrument = $oItem->instrument;
		$sDate = $oItem->utc;
		$sUrls = $oItem->urlList;
		if ($oItem->sampleType !== "thumbnail"){
			if (!array_key_exists($sInstrument, $aInstruments))
				$aInstruments[$sInstrument] = new cInstrument($sInstrument);
			$oData = $aInstruments[$sInstrument];
			$oData->add($sInstrument, $sDate, $sUrls );
		}
	}
	return $aInstruments;
}
//##########################################################################
function display_results($paInstruments){

	//---display header
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
	<form method=post>
		<table border=0>
		<tr><td>
			sol: <input type="text" size=5 id="sol" name="sol">
		</td></tr>
		<tr><td>
			<select name="SOL" size =15>
				<?=show_sols()?>
			</select>
		</td></tr>
		<tr><td>
			<input type=submit name="s" id="s">
		</td></tr>
	</form>
	<?php
}

//##########################################################################
function main($pSol){
	$sol = $_POST["sol"];
	$oResponse = cCuriosity::getSolData($sol);
	$aInstruments = build_SolData( $oResponse);
	display_results($aInstruments);
}
if (isset($_POST["s"])){ 	
	$sol=$_POST["sol"];
	main($sol);
}else
	show_form();



?>