<?php

/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
//
 **************************************************************************/
$home = "../..";
require_once "$home/php/fragments/app-common.php";
include cAppGlobals::$appPhpFragments . "/rest_header.php";

$iSol = 4363;
?><table>
    <tr>
        <th>test 1</th>
        <th>test 2</th>
    </tr>
    <tr>
        <td><?php
            $oData = cCuriosityORMManifest::get_all_sol_data($iSol);
            cDebug::vardump($oData, true);
            ?>
        </td>
        <td><?php
            $oData = cCuriosityManifestIndex::get_all_sol_data($iSol, null, eSpaceSampleTypes::SAMPLE_NONTHUMBS);
            cDebug::vardump($oData, true);
            ?>
        </td>
    </tr>
</table>