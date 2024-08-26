/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-Ncercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict';

class cDetail {
    static oItem = null;
    static aTags = null;
    static iNum = null;

    //###############################################################
    //# entry point
    //###############################################################
    static onLoadJQuery() {
        // disable edit controls
        cJquery.disable_element('tagtext');
        cJquery.disable_element('submittag');
        cJquery.disable_element('Commentsbox');
        cJquery.disable_element('btnComment');

        // catch key presses but not on text inputs
        $(window).keypress((poEvent) => this.onKeyPress(poEvent));
        $(':input').each(function (index, oObj) {
            if ($(oObj).attr('type') === 'text') {
                $(oObj).focus(() => this.onInputFocus());
                $(oObj).blur(() => this.onInputDefocus());
            }
        });

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

        $('submit_comment').click((poEvent) => this.onClickComment(poEvent));

        // get user data
        cCommonStatus.set_status('loading user data...');
        this.get_product_data(
            cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING],
            cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING],
            cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING],
        );
        cTagging.getTags(() => this.onGotAllTagNames());
    }

    //###############################################################
    //# Click Event Handlers
    //###############################################################
    static onClickComment() {
        const sText = $('#Commentsbox').sceditor('instance').val(); // gets the bbcode - MUST BE PARSED AT SERVER
        cSpaceComments.set(
            this.oItem.s,
            this.oItem.i,
            this.oItem.p,
            sText,
            () => this.onGotComments(),
        );
    }

    //***************************************************************
    static onClickNextProduct() {
        const sUrl = cBrowser.buildUrl(cAppLocations.rest + '/nexttime.php', {
            d: 'n',
            s: this.oItem.s,
            p: this.oItem.p,
            m: cMission.ID,
        });
        cCommonStatus.set_status('fetching next image details...');
        const oHttp = new cHttp2();
        bean.on(oHttp, 'result', (oData) => this.nexttime_callback(oData));
        oHttp.fetch_json(sUrl);
    }

    //***************************************************************
    static onClickPreviousProduct() {
        const sUrl = cBrowser.buildUrl(cAppLocations.rest + '/nexttime.php', {
            d: 'p',
            s: this.oItem.s,
            p: this.oItem.p,
            m: cMission.ID,
        });
        cCommonStatus.set_status('fetching previous image details...');
        const oHttp = new cHttp2();
        bean.on(oHttp, 'result', (oData) => this.nexttime_callback(oData));
        oHttp.fetch_json(sUrl);
    }

    //***************************************************************
    static onClickNext() {
        // find the next product
        cCommonStatus.set_status('fetching next image details...');
        var sUrl = cBrowser.buildUrl(cAppLocations.rest + '/next.php', {
            d: 'n',
            s: this.oItem.s,
            i: this.oItem.i,
            p: this.oItem.p,
            m: cMission.ID,
        });
        const oHttp = new cHttp2();
        bean.on(oHttp, 'result', (oData) => this.next_callback(oData));
        oHttp.fetch_json(sUrl);
    }

    //***************************************************************
    static onClickPrevious() {
        cCommonStatus.set_status('fetching previous image details...');
        const sUrl = cBrowser.buildUrl(cAppLocations.rest + '/next.php', {
            d: 'p',
            s: this.oItem.s,
            i: this.oItem.i,
            p: this.oItem.p,
            m: cMission.ID,
        });
        const oHttp = new cHttp2();
        bean.on(oHttp, 'result', (oData) => this.next_callback(oData));
        oHttp.fetch_json(sUrl);
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
    static onClickAddTag() {
        var sTag;

        // check something was entered
        sTag = $('#tagtext').val();
        if (sTag === '') {
            alert('no tag text');
            return;
        }

        cCommonStatus.set_status('setting tag: ' + sTag);
        cTagging.setTag(this.oItem.s, this.oItem.i, this.oItem.p, sTag, () =>
            this.onSetTag(),
        );
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
            () => this.onSaveHighlight(),
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
    static onFacebookUser() {
        cDebug.write('detail.js got Facebook user');
        cJquery.enable_element('tagtext');
        cJquery.enable_element('submittag');
        cJquery.enable_element('btnComment');

        $('#Commentsbox').sceditor({
            plugins: 'bbcode',
            style:
                cAppLocations.jsextra +
                '/sceditor/minified/jquery.sceditor.default.min.css',
            toolbarExclude: 'print,code,email,source,maximize',
            height: 100,
            resizeEnabled: false,
        });
        $('#Commentsbox')
            .sceditor('instance')
            .blur(() => this.onInputDefocus());
        $('#Commentsbox')
            .sceditor('instance')
            .focus(() => this.onInputFocus());
    }

    //###############################################################
    //* call backs
    //###############################################################
    static onGotAllTagNames(poJs) {
        cCommonStatus.set_status('got tag names');
        this.aTags = new Array();
        for (var sKey in poJs) {
            this.aTags.push(sKey);
        }
        $('#tagtext').autocomplete({ source: this.aTags });
    }

    //***************************************************************
    static onGotHighlights(paJS) {
        var i, aItem, oBox, oNumber;
        if (!paJS.d) {
            cDebug.write('no highlights');
            return;
        }

        for (i = 0; i < paJS.d.length; i++) {
            aItem = paJS.d[i];
            cDebug.write(
                'adding highlight: top=' + aItem.t + ' left=' + aItem.l,
            );
            oBox = cImgHilite.make_fixed_box(aItem.t, aItem.l);

            oNumber = $(oBox).find(cImgHilite.numberID);
            oNumber.html(i + 1);
        }
    }

    //***************************************************************
    static onSetTag(paJS) {
        this.onGotTags(paJS);
        cTagging.getTagNames(() => this.alltagnames_callback());
    }

    //***************************************************************
    static onGotTags(paJS) {
        cCommonStatus.set_status('got tag');
        var oTags = cJquery.element('tags');
        if (paJS.d.length == 0) {
            oTags.html('No Tags found, be the first to add one');
        } else {
            oTags.empty();
            var oA, sUrl, sTag;
            for (var i = 0; i < paJS.d.length; i++) {
                sTag = paJS.d[i];

                sUrl = cBrowser.buildUrl('tag.php', { t: sTag });
                oA = $('<A>', { target: 'tags', href: sUrl });
                oTags.append(oA);
            }
        }

        cCommonStatus.set_status('ok');
    }

    //***************************************************************
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
        var sUrl =
            cBrowser.pageUrl() +
            '?s=' +
            poItem.s +
            '&i=' +
            poItem.i +
            '&p=' +
            poItem.p;
        cBrowser.pushState('Detail', sUrl);
    }

    static pr_update_elements(poItem) {
        $('#sol').html(poItem.s);
        $('#instrument').html(poItem.i);
        $('#max_images').html(poItem.max);
        cAppRender.update_title(poItem.p);

        //if not data hide controls
        if (!poItem.d) {
            var oTagDiv = cJquery.element(
                cDetailPageConstants.TAGS_CONTAINER_ID,
            );
            oTagDiv.hide();

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
    static onGotDetails(poHttp) {
        var oData;
        cCommonStatus.set_status('received data...');

        // rely upon what came back rather than the query string
        var oResponse = poHttp.response;
        this.oItem = oResponse;
        oData = this.oItem.d;

        //----these things can be done
        this.populate_image();
        this.pr_update_elements(oResponse);
        this.pr_update_doc_title(oResponse);
        if (!oData) return;

        // ------------ tags
        var oTagDiv = cJquery.element(cDetailPageConstants.TAGS_ID);
        if (!oData.tags) oTagDiv.html('no Tags - be the first to add one');
        else oTagDiv.html(oData.tags);

        // update image index details
        this.iNum = oResponse.item;
        $('#img_index').html(oResponse.item);

        // populate the remaining fields
        $('#date_utc').html(oData.du);
        const sDump = cDebug.getvardump(oData.data, 1);
        $('#msldata').html($('<pre>').append(sDump));

        // get the tags and comments
        cTagging.getTags(this.oItem.s, this.oItem.i, this.oItem.p, (oData) =>
            this.onGotTags(oData),
        );
        cSpaceComments.get(this.oItem.s, this.oItem.i, this.oItem.p, () =>
            this.onGotComments(),
        );
    }

    //***************************************************************
    static populate_image() {
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

            //- - - - - - - - - - - - - - - - -
            var oBut = cJquery.element(cDetailPageConstants.TAGS_ID);
            oBut.enabled = false;
            oBut.html('no tags');

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
    static onGotComments(paJson) {
        var i, oText, sHTML;

        if (!paJson) {
            sHTML = 'No Comments - be the first !';
        } else {
            sHTML = '';
            for (i = 0; i < paJson.length; i++)
                sHTML += paJson[i].u + ':' + paJson[i].c + '<p>';
        }

        oText = $('#comments');
        oText.html(sHTML);
        cCommonStatus.set_status('ok');
    }

    //***************************************************************
    static nexttime_callback(poHttp) {
        const oData = poHttp.response;
        if (!oData) cCommonStatus.set_error_status('unable to find');
        else
            this.get_product_data(
                oData.s,
                oData.d.instrument,
                oData.d.itemName,
            );
    }

    //***************************************************************
    static next_callback(poHttp) {
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
        cImgHilite.getHighlights(
            this.oItem.s,
            this.oItem.i,
            this.oItem.p,
            (oData) => this.onGotHighlights(oData),
        );

        cCommonStatus.set_status('OK');
    }

    //***************************************************************
    static onSaveHighlight() {
        cImgHilite.remove_boxes();
        cImgHilite.getHighlights(
            this.oItem.s,
            this.oItem.i,
            this.oItem.p,
            (oData) => this.onGotHighlights(oData),
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

bean.on(cFacebook, 'gotUser', cDetail.onFacebookUser());
