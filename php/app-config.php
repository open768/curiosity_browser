<?php
	$root=realpath($home);
	$AppJS = "$home/js";
	$AppJSWidgets = "$AppJS/widgets";
	$jsinc = "$home/../jsinc";			//check this works
	$jsExtra = "$jsinc/extra";
	$phpinc = "$root/../phpinc";		//have to set phpinc here to pull in header.php
	$spaceinc = "$root/../spaceinc";
    $AppPhpFragments = "$root/php/fragments";
?>