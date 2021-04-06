<?php
	include("php/fragments/analytics.php");
	include("php/fragments/facebook.php");
?>
<div class="titlebar">
	<table width="100%"><tr>
		<td style="vertical-align:middle;text-align:left">
			<span style="align:left"><font class="title">Curiosity Browser: <span id="toptitle"><?=$sTitle?></span><?=(cHeader::is_localhost()?" - <font color='red'>DEVELOPMENT</font>":"")?></font></span>
		</td>
		<td style="vertical-align:middle;text-align:right">
			<fb:login-button 
			  scope="public_profile,email"
			  onlogin="OnFBCheckLoginState();">
			</fb:login-button>
		</td>
	</tr></table>
</div>
