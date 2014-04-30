<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

	require_once("inc/debug.php");
	require_once("inc/tags.php");
	require_once("inc/pichighlight.php");
	require_once("inc/curiosity/pds.php");
	require_once("inc/curiosity/static.php");
	require_once("inc/cached_http.php");
	
	cDebug::check_GET_or_POST();
	
	//***************************************************

	if (!isset($_GET["o"] ))
		$sOperation = "";
	else
		$sOperation = $_GET["o"] ;
	cDebug::write("Operation is '$sOperation'");

	$aData = null;
	
	switch($sOperation){
		//------------------------------------------------------
		case "parsePDS":
			if (! array_key_exists( "v", $_GET)){
				echo "usage: admin.php?o=parsePDS&v=volume";
				exit();
			}
			$volume = $_GET["v"];
			cCuriosityPDS::run_indexer($volume);
			break;

		//------------------------------------------------------
		case "killHighlight":
			if (! array_key_exists( "p", $_GET)){
				?>
				<form method="get">
					<Input type="hidden" name="o" value="killHighlight">
					<Input type="hidden" name="debug" value="1">
					sol: <Input type="input" name="s"><br>
					instr: <Input type="input" name="i"><br>
					product: <Input type="input" name="p"><br>
					which: <Input type="input" name="w"><br>
					<input type="submit">
				</form>
				<?php
				exit();
			}
			cImageHighlight::kill_highlites(OBJDATA_REALM, $_GET["s"], $_GET["i"], $_GET["p"], $_GET["w"]);
			break;

		//------------------------------------------------------
		case "killTag":
			if (! array_key_exists( "t", $_GET)){
				?>
				<form method="get">
					<Input type="hidden" name="o" value="killTag">
					<Input type="hidden" name="debug" value="1">
					<Input type="input" name="t"><br>
					<input type="submit"></input>
				</form>
				<?php
				exit();
			}
			cTags::kill_tag(OBJDATA_REALM, $_GET["t"]);
			break;

		//------------------------------------------------------
		case "killSession":
			session_start();
			cDebug::write("ok");
			session_destroy();
			break;
		//------------------------------------------------------
		case "killCache":
			cCachedHttp::clearCache();
			break;
			
		//------------------------------------------------------
		case "reindexTags":
			cTags::reindex(OBJDATA_REALM);
			break;

			//------------------------------------------------------
		case "reindexHilite":
			cImageHighlight::reindex(OBJDATA_REALM);
			break;
			
		//------------------------------------------------------
		case "mergeTags":
			throw new Exception("to be done");
			break;
			
		//------------------------------------------------------
		default:
			?>
				<form method="get">
					<Input type="radio" name="o" value="parsePDS">parse PDS files<br>
					<Input type="radio" name="o" value="killCache">clear cache<br>
					<Input type="radio" name="o" value="killTag">remove tag<br>
					<Input type="radio" name="o" value="mergeTags">merge a tag<br>
					<Input type="radio" name="o" value="reindexTags">reindex Tags - needed after deletion<br>
					<Input type="radio" name="o" value="reindexHilite">reindex image highlights <br>
					<Input type="radio" name="o" value="killHighlight">delete highlights<br>
					<Input type="radio" name="o" value="killSession">kill the session<br>
					<Input type="hidden" name="debug" value="1">
					<input type="submit"></input>
				</form>
			<?php
			break;
	}
?>