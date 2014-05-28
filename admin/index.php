<?php
/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
	$root=realpath("../");
	require_once("$root/php/inc/debug.php");
	require_once("$root/php/inc/tags.php");
	require_once("$root/php/inc/pichighlight.php");
	require_once("$root/php/inc/static.php");
	require_once("$root/php/curiosity/pdsindexer.php");
	require_once("$root/php/inc/cached_http.php");
	
	
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
		case "backup":
			$sFilename = addslashes("$root/backup.zip");
			$sFolder = addslashes("$root/[objdata]");
			$cmd = "zip -r \"$sFilename\" \"$sFolder\"";
			cDebug::write("running command $cmd");
			$iReturn = 0;
			echo exec( $cmd, $output, $iReturn);
			cDebug::write("done: $iReturn");
			cDebug::vardump($output);
			break;
			
		case "parseAllPDS":
			set_time_limit(600);
			cCuriosityPdsIndexer::index_everything(OBJDATA_REALM);
			break;
			
		case "killPDS":
			cDebug::write("use phpshell to delete PDS files");
			break;
			
		case "parsePDS":
			if (! array_key_exists( "v", $_GET)){
				?>
				<form method="get">
					<Input type="hidden" name="o" value="<?=$sOperation?>">
					<Input type="hidden" name="debug" value="1">
					volume: <Input type="input" name="v">
					Index: <Input type="input" name="i" value="EDRINDEX">
					<input type="submit">
				</form>
				<?php
				exit();
			}
			set_time_limit(600);
			$sVolume = $_GET["v"];
			if (!isset($_GET["i"] )) cDebug::error("no index specified");
			$sIndex= $_GET["i"];
			cCuriosityPdsIndexer::run_indexer(OBJDATA_REALM, $sVolume, $sIndex);
			break;

		//------------------------------------------------------
		case "killHighlight":
			if (! array_key_exists( "p", $_GET)){
				?>
				<form method="get">
					<Input type="hidden" name="o" value="<?=$sOperation?>">
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
			cDebug::write("ok");
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
					<Input type="radio" name="o" value="backup">backup objdata<br>
					<Input type="radio" name="o" value="parsePDS">parse PDS files<br>
					<Input type="radio" name="o" value="parseAllPDS">parse ALL PDS files<br>
					<Input type="radio" name="o" value="killPDS">Kill ALL PDS files<br>
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