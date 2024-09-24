<?php
$home = "../../..";
require_once "$home/php/fragments/app-common.php";
require_once "$home/php/classes/admin-funcs.php";
cAdminFunctions::check_user_is_admin();
prevent_buffering();

$sOperation = cHeader::get("o", true);

switch ($sOperation) {
    case "tags":
        cDebug::write("tags");
        cHeader::set_download_filename("export_tags.csv");
        cAdminFunctions::export_tags();
        break;
    case "highs":
        cDebug::write("highs");
        cHeader::set_download_filename("export_highs.csv");
        cAdminFunctions::export_highs();
        break;
    default:
        cDebug::error("unknown operation $sOperation");
}
