<?php
class cAppIDs {
    const STATUS_ID = "status";
}

class cAppConsts {
    const CROP_WIDTH = 120;
    const CROP_HEIGHT = 120;
    const THUMB_QUALITY = 90;
    static $CK_IMAGE = null;
}
cAppConsts::$CK_IMAGE = cAppGlobals::$jsImages . "/browser/chicken-icon.png";

class cAppUrlParams {
    const OPERATION = "o";
    const REFRESH = "r";
    const USER = "u";
    const TOKEN = "t";
    const BEGIN = "b";
    const END = "e";
    const DIRECTION = "d";
    const HOWMANY = "h";

    const OP_SEARCH = "s";
    const OP_IMAGE = "i";
    const SURE = "sr";
    const FACEBOOK = "fb";

    const PRODUCT_FROM = "pfrom";
    const PRODUCT_TO = "pto";

    const HIGHLIGHT_TOP = "t";
    const HIGHLIGHT_LEFT = "l";
    const HIGHLIGHT_WIDTH = "w";
    const HIGHLIGHT_HEIGHT = "h";

    const TAG = "t";
    const VALUE = "v";
    const URL = "u";

    const THUMB_PARAM = 't';
    const BEGIN_PARAM = 'b';
    const MOSAIC_PARAM = 'mos';

    const ALL_INSTRUMENTS = 'All';
}
