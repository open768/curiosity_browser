<div class="titlebar">
	<table width="100%"><tr>
		<td style="vertical-align:middle" width="30">
			<img src="images/smalldude.png"  height="30">
		</td>
		<td style="vertical-align:middle;text-align:left">
			<span style="align:left"><font class="title">Curiosity Browser: <span id="toptitle"><?=$sTitle?></span><?=(cHeader::is_localhost()?" - <font color='red'>DEVELOPMENT</font>":"")?></font></span>
		</td>
		<td style="vertical-align:middle;text-align:right">
			<span class="FBloginButton" ID="username">Checking Login..</span>
			<button ID="FBloginButton" class="FBloginButton" style="display:none" onclick="cFacebook.onClickLogin();">Login with FB</button>
		</td>
	</tr></table>
</div>
