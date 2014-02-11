<html>
<head>
	<LINK href="../css/css.css" rel="stylesheet" type="text/css">
	<title>Curiosity Browser</title>
</head>
<body>
<?php
	require_once("inc/curiosity_json.php");
	require_once("inc/http.php");
	require_once("inc/debug.php");
	
	cDebug::check_GET_or_POST();

	$sSol = $_GET["sol"] ;
	$sInstrument = $_GET["instr"];	
	$sProduct = $_GET["product"];
	
	
	$oInstrumentData = cCuriosity::getSolData($sSol, $sInstrument);
	$aImages=$oInstrumentData->data;
	//cDebug::vardump($aImages);
	
	foreach ($aImages as $aItem){
		if ($aItem["p"] === $sProduct){
			?>
				<DIV class="title">Curosity Detail</DIV>
				<DIV class="gold">
				PRODUCT: <?=$aItem["p"]?><BR>
				date: <?=$aItem["d"]?> <br>
				instrument <?=$sInstrument?><BR>
				image: <a href="<?=$aItem["i"]?>"><?=$aItem["i"]?></a>
				</div>
				<p>
				<img src="<?=$aItem["i"]?>"><br>
				<h2>Product Page</h2>
				
			<?php
			if ( $aItem["l"] === "UNK" )
				echo "<DIV class='gold'>UNKnown product</div>";
			else{
				?>
					<iframe class="gold" width="100%" height="100%" src="<?=$aItem["p"]?>">Iframes not supported</iframe>
				<?php
			}
			break;
		}
	}

?>
<P>
	<p class="credits">Data courtesy MSSS/MSL/NASA/JPL-Caltech.</p>
	<p class="github">We're on <a href="https://github.com/open768/curiosity_browser"><img src="../images/github_logo.png"></a></p>
</body>
</html>