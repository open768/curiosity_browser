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
				<font class="title"><?=$aItem["p"]?></font><P>
				date: <?=$aItem["d"]?> <br>
				instrument <?=$sInstrument?><BR>
				image: <a href="<?=$aItem["i"]?>"><?=$aItem["i"]?></a>
				<p>
				<img src="<?=$aItem["i"]?>"><br>
				<h2>Product Page</h2>
			<?php
			if ( $aItem["l"] === "UNK" )
				echo "UNKnown product";
			else{
			?><iframe width="100%" height="100%" src="<?=$aItem["p"]?>">Iframes not supported</iframe><?php
			}
			break;
		}
	}

?>
<P>
<font class=credits>Data courtesy MSSS/MSL/NASA/JPL-Caltech.</font>
</body>
</html>