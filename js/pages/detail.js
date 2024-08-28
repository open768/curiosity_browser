/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-Ncercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict';

//###############################################################
//# cDetail
//###############################################################
class cDetailTags {
    static TAGS_ID = 'cdid';
    static TAGS_TEXT_ID = 'cdtext';
    static TAGS_BUTTON_ID = 'cdbut';

    static render() {
        var oThis = this;
        var oContainer = cJquery.element(
            cDetailPageConstants.TAGS_CONTAINER_ID,
        );
        {
            //--------------------------------------------------
            oContainer.empty();
            oContainer.addClass('w3-cell-row w3-theme-l3');

            //----label------------------------------------------
            var oSpan = $('<span>', {
                class: 'w3-cell w3-theme',
                style: 'width:100px',
            });
            {
                oSpan.append('Tags:');
                oContainer.append(oSpan);
            }

            //---where tags go--------------------------------------
            var sID = cJquery.child_ID(oContainer, this.TAGS_ID);
            oSpan = $('<span>', {
                class: 'w3-cell',
                id: sID,
                style: 'min-width:400px',
            });
            {
                oSpan.append('loading tags');
                oContainer.append(oSpan);
            }

            //---input controls-----------------------------------------------
            oSpan = $('<span>', { class: 'w3-cell' });
            {
                sID = cJquery.child_ID(oContainer, this.TAGS_TEXT_ID);
                {
                    var oInput = $('<input>', {
                        type: 'text',
                        size: 20,
                        id: sID,
                    });
                    cJquery.disable_element(oInput);
                    oSpan.append(oInput);
                }

                sID = cJquery.child_ID(oContainer, this.TAGS_BUTTON_ID);
                {
                    var oButton = cAppRender.make_button(
                        sID,
                        'add',
                        'add Tag',
                        true,
                        () => oThis.onClickAdd(),
                    );
                    oSpan.append(oButton);
                }
                oContainer.append(oSpan);
            }
        }
        //catch FB event
        oThis = this;
        bean.on(cFacebook, cFacebook.STATUS_EVENT, () => oThis.enable());

        this.get_tags();
    }

    //***********************************************************
    static async get_tags() {
        var oThis = this;

        cTagging.getTags(
            cDetail.sol,
            cDetail.instrument,
            cDetail.product,
            (poHttp) => oThis.onGotTags(poHttp),
        );
    }

    //***********************************************************
    static onGotTags(poHttp) {
        cCommonStatus.set_status('got tag');
        //---------------------------------------------------
        var oContainer = cJquery.element(
            cDetailPageConstants.TAGS_CONTAINER_ID,
        );
        var sID = cJquery.child_ID(oContainer, this.TAGS_ID);
        var oTagDiv = cJquery.element(sID);
        oTagDiv.empty();

        //---------------------------------------------------
        var aData = poHttp.response.d;
        if (aData.length == 0) {
            oTagDiv.html('No Tags found, be the first to add one');
        } else {
            var oA, sUrl, sTag;
            for (var i = 0; i < aData.length; i++) {
                sTag = aData[i];

                sUrl = cBrowser.buildUrl('tag.php', { t: sTag });
                oA = $('<A>', {
                    target: 'tags',
                    href: sUrl,
                    class: 'w3-tag w3-theme-tag',
                });
                oA.append(sTag);
                oTagDiv.append(oA);
            }
        }

        cCommonStatus.set_status('ok');
    }

    //***********************************************************
    static async onClickAdd() {
        var sTag;

        var oContainer = cJquery.element(
            cDetailPageConstants.TAGS_CONTAINER_ID,
        );
        var sID = cJquery.child_ID(oContainer, this.TAGS_TEXT_ID);
        var oText = cJquery.element(sID);

        // check something was entered
        sTag = oText.val();
        if (sTag === '') {
            alert('no tag text');
            return;
        }

        var oThis = this;
        cCommonStatus.set_status('setting tag: ' + sTag);
        cTagging.setTag(
            cDetail.sol,
            cDetail.instrument,
            cDetail.product,
            sTag,
            () => oThis.onSetTag(),
        );
    }
    //***************************************************************
    static onSetTag() {
        this.get_tags();
    }

    //***********************************************************
    static enable() {
        var oContainer = cJquery.element(
            cDetailPageConstants.TAGS_CONTAINER_ID,
        );
        if (oContainer.length == 0) cDebug.error('TAG container doesnt exist');

        var sID = cJquery.child_ID(oContainer, this.TAGS_TEXT_ID);
        var oElement = cJquery.element(sID);
        cJquery.enable_element(oElement);

        sID = cJquery.child_ID(oContainer, this.TAGS_BUTTON_ID);
        oElement = cJquery.element(sID);
        cJquery.enable_element(oElement);
    }
}

//###############################################################
//# cDetail
//###############################################################
class cDetail {
    static oItem = null;
    static iNum = null;
    static sol = null;
    static instrument = null;
    static product = null;

    //***********************************************************
    static onLoadJQuery() {
        //set click handlers
        $('#sol').click((poEvent) => this.onClickSol(poEvent));
        $('#instrument').click((poEvent) => this.onClickInstr(poEvent));
        cJquery
            .element(cDetailPageConstants.CAL_ID)
            .click((poEvent) => this.onClickCal(poEvent));
        $('#showthumb').click((poEvent) => this.onClickThumbnails(poEvent));
        $('#highlights').click((poEvent) => this.onClickHighlights(poEvent));
        $('#nasalink').click((poEvent) => this.onClickNASA(poEvent));
        $('#mslrawlink').click((poEvent) => this.onClickMSLRaw(poEvent));
        $('#pds_product').click((poEvent) => this.onClickPDS(poEvent));
        $('#google').click((poEvent) => this.onClickGoogle(poEvent));

        $('#submittag').click((poEvent) => this.onClickAddTag(poEvent));

        $('#prev_prod_top').click((poEvent) =>
            this.onClickPreviousProduct(poEvent),
        );
        $('#prev_top').click((poEvent) => this.onClickPrevious(poEvent));
        $('#next_top').click((poEvent) => this.onClickNext(poEvent));
        $('#next_prod_top').click((poEvent) =>
            this.onClickNextProduct(poEvent),
        );

        $('#prev_left').click((poEvent) => this.onClickPrevious(poEvent));

        $('#tmpl_accept').click((poEvent) => this.onClickBoxAccept(poEvent));
        $('#tmpl_cancel').click((poEvent) => this.onClickBoxCancel(poEvent));

        $('#next_right').click((poEvent) => this.onClickNext(poEvent));

        $('#prev_prod_bottom').click((poEvent) =>
            this.onClickPreviousProduct(poEvent),
        );
        $('#prev_bottom').click((poEvent) => this.onClickPrevious(poEvent));
        $('#next_bottom').click((poEvent) => this.onClickNext(poEvent));
        $('#next_prod_bottom').click((poEvent) =>
            this.onClickNextProduct(poEvent),
        );

        // catch key presses but not on text inputs
        $(window).keypress((poEvent) => this.onKeyPress(poEvent));
        $(':input').each(function (index, oObj) {
            if ($(oObj).attr('type') === 'text') {
                $(oObj).focus(() => this.onInputFocus());
                $(oObj).blur(() => this.onInputDefocus());
            }
        });

        // get user data
        cCommonStatus.set_status('loading user data...');
        var sSol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING];
        var sInstr = cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING];
        var sProduct = cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING];
        this.sol = sSol;
        this.instrument = sInstr;
        this.product = sProduct;

        //get the image data
        this.get_product_data(sSol, sInstr, sProduct);

        // render comments
        var oComment = cJquery.element('commentContainer');
        oComment.commentbox({
            mission: cMission,
            sol: sSol,
            product: sProduct,
            instrument: sInstr,
            read_only: false,
        });

        //tags
        cDetailTags.render();
    }

    //***************************************************************
    static pr_fetch_next_product(psDirection) {
        const sUrl = cBrowser.buildUrl(cAppLocations.rest + '/nexttime.php', {
            d: psDirection,
            s: this.oItem.s,
            p: this.oItem.p,
            m: cMission.ID,
        });
        cCommonStatus.set_status('fetching next image details...');
        const oHttp = new cHttp2();
        bean.on(oHttp, 'result', (oData) => this.onNextProduct(oData));
        oHttp.fetch_json(sUrl);
    }

    //***************************************************************
    static pr_fetch_next_image(psDirection) {
        // find the next image
        cCommonStatus.set_status('fetching next image details...');
        var sUrl = cBrowser.buildUrl(cAppLocations.rest + '/next.php', {
            d: psDirection,
            s: this.oItem.s,
            i: this.oItem.i,
            p: this.oItem.p,
            m: cMission.ID,
        });
        const oHttp = new cHttp2();
        bean.on(oHttp, 'result', (oData) => this.onNextImage(oData));
        oHttp.fetch_json(sUrl);
    }

    //###############################################################
    //# Click Event Handlers
    //###############################################################
    static onClickNextProduct() {
        this.pr_fetch_next_product('n');
    }

    static onClickPreviousProduct() {
        this.pr_fetch_next_product('p');
    }

    //***************************************************************
    static onClickNext() {
        this.pr_fetch_next_image('n');
    }

    //***************************************************************
    static onClickPrevious() {
        this.pr_fetch_next_image('p');
    }

    //***************************************************************
    static onClickCal() {
        const sUrl = cBrowser.buildUrl('cal.php', {
            s: this.oItem.s,
            t: this.oItem.d.du,
        });
        cBrowser.openWindow(sUrl, 'calendar');
    }

    //***************************************************************
    static onClickSol() {
        const sUrl = cBrowser.buildUrl('index.php', {
            s: this.oItem.s,
            i: this.oItem.i,
            b: this.iNum,
        });
        cBrowser.openWindow(sUrl, 'index');
    }

    //***************************************************************
    static onClickThumbnails() {
        const sUrl = cBrowser.buildUrl('index.php', {
            s: this.oItem.s,
            i: this.oItem.i,
            t: 1,
        });
        cBrowser.openWindow(sUrl, 'solthumb');
    }

    //***************************************************************
    static onClickHighlights() {
        const sUrl = cBrowser.buildUrl('solhigh.php', { s: this.oItem.s });
        cBrowser.openWindow(sUrl, 'solthumb');
    }

    //***************************************************************
    static onClickInstr() {
        this.onClickSol();
    }

    //***************************************************************
    static onClickNASA() {
        window.open(this.oItem.d.i, 'nasa');
    }

    //***************************************************************
    static onClickMSLRaw() {
        const sUrl = cCuriosity.get_raw_image(this.oItem.s, this.oItem.p);
        window.open(sUrl, 'mslraw');
    }

    //***************************************************************
    static onClickPDS() {
        const sUrl = cBrowser.buildUrl('pds.php', {
            s: this.oItem.s,
            i: this.oItem.i,
            p: this.oItem.p,
            t: escape(this.oItem.d.du),
        });
        cBrowser.openWindow(sUrl, 'pds');
    }

    //***************************************************************
    static onKeyPress(poEvent) {
        const sChar = String.fromCharCode(poEvent.which);
        switch (sChar) {
            case 'n':
                this.onClickNext();
                break;
            case 'N':
                this.onClickNextProduct();
                break;
            case 'p':
                this.onClickPrevious();
                break;
            case 'P':
                this.onClickPreviousProduct();
                break;
        }
    }

    //***************************************************************
    static onClickGoogle() {
        const sUrl = 'https://www.google.com/#q=%22' + this.oItem.p + '%22';
        window.open(sUrl, 'map');
    }

    //***************************************************************
    static OnImageClick(poEvent) {
        if (cAuth.user) {
            cImgHilite.makeBox(poEvent.pageX, poEvent.pageY, true);
        } else {
            alert('log in to highlight');
        }
    }

    //**************************************************
    static onClickBoxAccept(poEvent) {
        const oBox = cImgHilite.getBoxFromButton(poEvent.currentTarget);
        cImgHilite.save_highlight(
            this.oItem.s,
            this.oItem.i,
            this.oItem.p,
            oBox,
            (poHttp) => this.onSaveHighlight(poHttp),
        );
    }

    //**************************************************
    static onClickBoxCancel(poEvent) {
        cImgHilite.rejectBox(poEvent.currentTarget);
    }

    //###############################################################
    //# Focus Event Handlers
    //###############################################################
    static onInputFocus() {
        $(window).unbind('keypress');
    }

    static onInputDefocus() {
        $(window).keypress(() => this.onKeyPress());
    }

    //###############################################################
    //# Event Handlers
    //###############################################################

    //***************************************************************
    static onNextProduct(poHttp) {
        const oData = poHttp.response;
        if (!oData) cCommonStatus.set_error_status('unable to find');
        else {
            this.get_product_data(
                oData.s,
                oData.d.instrument,
                oData.d.itemName,
            );
        }
    }

    //***************************************************************
    static onNextImage(poHttp) {
        const oData = poHttp.response;
        this.get_product_data(oData.s, this.oItem.i, oData.d.p);
    }

    //***************************************************************
    static OnImageLoaded(poEvent) {
        var iWidth, iHeight, iImgW, iButW;

        iHeight = $(poEvent.target).height();
        iImgW = $(poEvent.target).width();
        iButW = $('#prev_prod_top').innerWidth();
        iWidth = iImgW / 2 - iButW;

        // make the buttons the right size
        cDebug.write('setting button sizes');
        cDebug.write('imageWidth: ' + iImgW);
        cDebug.write('button width: ' + iButW);
        cDebug.write('width: ' + iWidth);
        cDebug.write('height: ' + iHeight);

        $('#next_right').height(iHeight);
        $('#prev_left').height(iHeight);
        $('#next_prod_top').innerWidth(iWidth);
        $('#prev_prod_top').innerWidth(iWidth);
        $('#next_prod_bottom').innerWidth(iWidth);
        $('#prev_prod_bottom').innerWidth(iWidth);

        // make the image clickable
        $(poEvent.target).click((poImgEvent) => this.OnImageClick(poImgEvent));
        cImgHilite.imgTarget = poEvent.target;

        // get the highlights if any
        this.getHighlights();

        cCommonStatus.set_status('OK');
    }

    //***************************************************************
    static onGotHighlights(poHttp) {
        var i, aItem, oBox, oNumber;
        var oData = poHttp.response;
        if (!oData.d) {
            cDebug.write('no highlights');
            return;
        }

        for (i = 0; i < oData.d.length; i++) {
            aItem = oData.d[i];
            cDebug.write(
                'adding highlight: top=' + aItem.t + ' left=' + aItem.l,
            );
            oBox = cImgHilite.make_fixed_box(aItem.t, aItem.l);

            oNumber = $(oBox).find(cImgHilite.numberID);
            oNumber.html(i + 1);
        }
    }

    //***************************************************************
    static onGotDetails(poHttp) {
        var oData;
        cCommonStatus.set_status('received data...');

        // rely upon what came back rather than the query string
        var oResponse = poHttp.response;
        this.oItem = oResponse;
        oData = this.oItem.d;

        //----remember the details
        this.sol = oResponse.s;
        this.product = oResponse.p;
        this.instrument = oResponse.i;

        //----these things can be done
        this.pr_populate_image();
        this.pr_update_elements(oResponse);
        this.pr_update_doc_title(oResponse);
        if (!oData) return;

        this.pr_update_msl(oData.data);

        // update image index details
        this.iNum = oResponse.item;
        $('#img_index').html(oResponse.item);

        // populate the remaining fields
        $('#date_utc').html(oData.du);

        // get the tags
        cDetailTags.get_tags();
    }

    //***************************************************************
    static onSaveHighlight() {
        cImgHilite.remove_boxes();
        this.getHighlights();
    }

    //###############################################################
    //# Privates
    //###############################################################
    static pr_update_doc_title(poItem) {
        //---------- THERE WAS DATA -----------------
        // update the title
        document.title =
            'detail: s:' +
            poItem.s +
            ' i:' +
            poItem.i +
            ' p:' +
            poItem.p +
            ' (Curiosity Browser)';

        // ------------update the address bar
        var sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), {
            s: poItem.s,
            i: poItem.i,
            p: poItem.p,
        });
        cBrowser.pushState('Detail', sUrl);
    }

    //***************************************************************
    static pr_update_elements(poItem) {
        $('#sol').html(poItem.s);
        $('#instrument').html(poItem.i);
        $('#max_images').html(poItem.max);
        cAppRender.update_title(poItem.p);

        //if not data hide controls
        if (!poItem.d) {
            $('#date_utc').empty().append('unable to get date');
            cJquery.disable_element(cDetailPageConstants.CAL_ID);
            cJquery.disable_element('pds_product');
            cJquery.disable_element('nasalink');
            $('#msldata').hide();

            cJquery.element(cDetailPageConstants.COMMENTS_CONTAINER_ID).hide();
            return;
        }
    }

    //***************************************************************
    static pr_populate_image() {
        // no data returned
        var oData = this.oItem.d;

        // empty highligths as there may have been a product before
        cImgHilite.remove_boxes();

        // set status
        cCommonStatus.set_status('Image Loading');

        //--------------there was no data returned
        if (oData === null) {
            cDebug.warn('product ' + this.oItem.p + ' was not found');
            var oDiv = cJquery.element(cDetailPageConstants.IMAGE_CONTAINER_ID);
            {
                oDiv.empty();
                oDiv.addClass('image_error');
                oDiv.append('product not found');
            }

            var sUrl;
            if (this.oItem.migrate !== null) {
                sUrl = cBrowser.buildUrl('migrate.php', {
                    s: this.oItem.s,
                    i: this.oItem.i,
                    pfrom: this.oItem.p,
                    pto: this.oItem.migrate,
                });

                cBrowser.openWindow(sUrl, 'migrate');
            } else {
                sUrl = cBrowser.buildUrl('error.php', {
                    m: 'product ' + this.oItem.p + ' was not found',
                });
                cBrowser.openWindow(sUrl, 'error');
            }
            return;
        }

        // there was an image
        const oImg = $('<img>').attr({ src: oData.i, id: 'baseimg' });
        oImg.on('load', (poEvent) => this.OnImageLoaded(poEvent));
        $('#image').empty();
        $('#image').append(oImg);

        //update the FB meta information for the image //should be a separate class
        $("meta[property='og:image']").attr(
            'content',
            cAppLocations.home + '/' + oData.i,
        ); // facebook tag for image
    }
    //***************************************************************
    static pr_update_msl(oData) {
        const sDump = cDebug.getvardump(oData, 1);

        var oMSLDiv = cJquery.element(cDetailPageConstants.MSL_ID);
        oMSLDiv.html($('<pre>').append(sDump));
    }

    //***************************************************************
    static getHighlights() {
        var oThis = this;
        cImgHilite.getHighlights(
            this.oItem.s,
            this.oItem.i,
            this.oItem.p,
            (poHttp) => oThis.onGotHighlights(poHttp),
        );
    }

    //***************************************************************
    static get_product_data(psSol, psInstr, psProd) {
        const sUrl = cBrowser.buildUrl(cAppLocations.rest + '/detail.php', {
            s: psSol,
            i: psInstr,
            p: psProd,
            m: cMission.ID,
        });
        cCommonStatus.set_status('fetching data for ' + psProd);
        const oHttp = new cHttp2();
        bean.on(oHttp, 'result', (oData) => this.onGotDetails(oData));
        oHttp.fetch_json(sUrl);
    }
}
