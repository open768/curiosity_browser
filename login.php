<?php

require_once "php/inc/debug.php";
require_once "php/inc/secret.php";
require_once "php/static/static.php";
require_once "php/inc/auth.php";
require_once "php/ayah/ayah.php";

cDebug::check_GET_or_POST();

//***** check if logged in
session_start();
$sMessage = cAuth::check();
?>

<html>
<head>
	<LINK href="css/css.css" rel="stylesheet" type="text/css">
	<title>Login Required</title>
</head>
<body>
	<?php include_once("analytics-fragment.php") ?>
	<script src="js/inc/common.js"></script>
	<script src="js/inc/secret.js"></script>
	<script src="js/jquery/jquery.js"></script>
	<script src="js/jquery/jquery-ui.js"></script>
<DIV class="title">Login Needed</DIV>

	<DIV class="gold" id="colours">
		<?php
			if ($sMessage) echo "<i>$sMessage</i><p>";
			cAuth::show_form();
		?>
	</div>
	
	<!-- footer -->
	<p class="credits">Data courtesy MSSS/MSL/NASA/JPL-Caltech.</p>
	<div class="github">
		<table border="0" width="100%"><tr>
			<td width="50"><a href="http://www.chickenkatsu.co.uk" target="chicken"><img src="images/chicken_icon.png"></a></td>
			<td>
				We're on <img src="images/github_logo.png"> <a href="https://github.com/open768/curiosity_browser">https://github.com/open768/curiosity_browser</a>
				<p>
				<div class="fb-like" data-href="https://www.facebook.com/mars.features" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></div>
			</td>
		</tr></table>
	</div>
</body>
</html>