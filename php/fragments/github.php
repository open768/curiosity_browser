<p class="credits">Data courtesy MSSS/MSL/NASA/JPL-Caltech. Please note <a href="index.php#disclaim">site disclaimer</a></p>
<?php if (isset($sExtraCredits)){?>
<p class="credits"><?=$sExtraCredits?>.</p>
<?php }?>

<div class="github">
	<table width="100%"><tr>
		<td style="vertical-align:middle;text-align:left">
			<a href="http://www.chickenkatsu.co.uk" target="chicken"><img src="images/chicken_icon.png"></a>
			We're on <img src="images/github_logo.png">
			<a href="https://github.com/open768/curiosity_browser">https://github.com/open768/curiosity_browser</a>
		</td>
		<td style="vertical-align:middle;text-align:right">
			<span id="fb.like" class="fb-like" data-href="<?=$_SERVER['REQUEST_URI']?>" data-layout="button_count" data-action="like" data-show-faces="true" data-share="true"></span>
		</td>
	</tr></table>
</div>
