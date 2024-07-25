<?php
	$root=realpath($home);
	$phpInc = "$root/../phpinc";		//have to set phpinc here to pull in header.php
	$spaceInc = "$root/../spaceinc";
    $appPhpFragments = "$root/php/fragments";
    $appImages = "$home/images/";

    // Javascript locations 
	$AppJS = "$home/js";
	$AppJSWidgets = "$AppJS/widgets";
	$jsInc = "$home/../jsinc";			//check this works
	$jsExtra = "$jsInc/extra";
?>