<!-- Tracking -->
<div id='fb-root'></div>
<?php
include("$home/php/fragments/google.php");
?>

<!-- Title Bar -->
<div class="titlebar">
    <table width="100%">
        <tr>
            <td style="vertical-align:middle;text-align:left">
                    <font class="title">
                        Curiosity Browser: 
                        <span id="toptitle"><?= $sTitle ?></span>
                        <?= (cDebug::is_localhost() ? " - <font color='red'>DEVELOPMENT</font>" : "") ?>
                    </font>
            </td>
            <td style="vertical-align:middle;text-align:right">
                <span style="display: inline-block; width: 300px;" id="username">One Moment please...</span>
                <span style="display: inline-block; width: 100px;">
                    <fb:login-button scope="public_profile,email" onlogin="cFacebook.checkLoginStatus();" auto_logout_link="true" />
                </span>
            </td>
        </tr>
    </table>
</div>