<!-- Tracking -->
<div id='fb-root'></div>
<?php
include("$appPhpFragments/google.php");
?>

<!-- Title Bar -->
<div class="w3-cell-row w3-light-grey">
    <div class= "w3-cell title">
        Curiosity Browser: 
        <span id="toptitle"><?= $sTitle ?></span>
        <?= (cDebug::is_localhost() ? " - <font color='red'>DEVELOPMENT</font>" : "") ?>
    </div>
    <div class= "w3-cell w3-right-align">
        <span style="display: inline-block; width: 300px;" id="fbusername">One Moment please...</span>
        <span style="display: inline-block; width: 100px;">
            <fb:login-button scope="public_profile,email" onlogin="cFacebook.checkLoginStatus();" auto_logout_link="true" />
        </span>
    </div>
</div>