<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024
This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
 **************************************************************************/

$home = "../..";
require_once  "$home/php/fragments/app-common.php";

require_once  cAppGlobals::$ckPhpInc . "/header.php";
require_once  cAppGlobals::$ckPhpInc . "/hash.php";
require_once  cAppGlobals::$ckPhpInc . "/facebook.php";

//***************************************************
//check inputs
$sUserID = cHeader::get(cAppUrlParams::USER, true);
cDebug::write("userID: $sUserID");

$sToken = cHeader::get(cAppUrlParams::TOKEN, true);
//cDebug::write("access token: $sToken");

//***************************************************
$sUser = null;


$sOperation = cHeader::get(cAppUrlParams::OPERATION);
cDebug::write("Operation is : $sOperation");
switch ($sOperation) {
    case "getuser":
        cDebug::write("getting stored user details");
        $sUser = cFacebook_ServerSide::getStoredUser($sUserID);

        if ($sUser)
            if (trim($sUser) == "")
                $sUser = null;

        //finally get user details from facebook
        if (!$sUser) {
            cDebug::write("stored details not found, getting  from Facebook");
            $sUser = cFacebook_ServerSide::getUserName($sUserID, $sToken);
        }
        break;
    default:
        cDebug::error("unrecognised operation $sOperation");
}

//############################### response ####################
include cAppGlobals::$appPhpFragments . "/rest_header.php";
cCommon::write_json($sUser);
