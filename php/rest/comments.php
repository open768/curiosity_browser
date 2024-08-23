<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 -2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
 **************************************************************************/

$home = "../..";
require_once  "$home/php/fragments/app-common.php";
require_once  "$spaceInc/misc/comments.php";
require_once  "$phpInc/extra/sbbcode/SBBCodeParser.php";



//***************************************************
$sOperation = $_GET["o"];
$oResult = null;

switch ($sOperation) {
    case "get":
        $sSol = $_GET["s"];
        $sInstrument = $_GET["i"];
        $sProduct = $_GET["p"];

        $aResult = cSpaceComments::get($sSol, $sInstrument, $sProduct);

        break;
    case "set":
        $sUser = cAuth::must_get_user();
        $sSol = $_GET["s"];
        $sInstrument = $_GET["i"];
        $sProduct = $_GET["p"];
        $sBBcode = $_GET['v'];

        cDebug::write("input was $sBBcode");
        $parser = new  SBBCodeParser\Node_Container_Document();
        $parser->parse($sBBcode);
        $sHTML = $parser->get_html();
        $sComment = utf8_encode($sHTML);

        $aResult = cSpaceComments::set($sSol, $sInstrument, $sProduct, $sComment, $sUser);
        break;
    case "topsolindex":
        $aResult = cSpaceComments::get_top_index();
        break;

    default:
        cDebug::error("unsupported operation");
        break;
}

//***************************************************
//output the data
cCommon::write_json($aResult);
