'use strict';
/****************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024 www.chickenkatsu.co.uk

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

/*global cIndexPageConsts*/
// cIndexPageConsts are defined in index.php - and written out line 57

class cIndexPageOptions {
    static start_image = 1;
    static sol = null;
    static instrument = null;
    static keep_start_image = true;
}

//###############################################################
class cBackgroundImage {
    static REST_URL = 'random.php';
    static INTERVAL = 5 * 60 * 1000;
    static stop = false;
    static timer = null;

    //*****************************************************************
    static async render() {
        this.fetch_image();
    }

    //*****************************************************************
    static fetch_image() {
        if (this.stop) return;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }

        const oThis = this;
        const sUrl = cBrowser.buildUrl(
            cAppLocations.rest + '/' + this.REST_URL,
            {
                o: 'i', //images
                h: 1, //only want 1 image
            },
        );
        const oHttp = new cHttp2();
        {
            bean.on(oHttp, 'result', (poHttp) => oThis.OnImageResponse(poHttp));
            oHttp.fetch_json(sUrl);
        }
    }

    //*****************************************************************
    static OnImageResponse(poHttp) {
        if (this.stop) return;
        const oData = poHttp.response;
        if (!oData) cCommonStatus.set_status('couldnt get image');

        //------------show the image
        var oBodyDiv = cJquery.element(cIndexPageConsts.ID_INTRO_BODY);

        //stop if the intro section has gone
        if (oBodyDiv.length === 0) {
            this.stop = true;
            return;
        }

        var oImgData = oData.d[0];
        oBodyDiv.css('background-image', 'url(' + oImgData.d + ')');
        oBodyDiv.css('background-size', 'contain');
        oBodyDiv.css('background-repeat', 'repeat');

        //------------show information about the image
        var oFootDiv = cJquery.element(cIndexPageConsts.ID_INTRO_FOOTER);
        oFootDiv.show();
        oFootDiv.empty();

        const sUrl = cBrowser.buildUrl(
            cAppLocations.home + '/php/pages/detail.php',
            {
                s: oImgData.s,
                i: oImgData.i,
                p: oImgData.p,
            },
        );

        //------ add info to footer
        var oThis = this;
        var oA = $('<A>', { href: sUrl, target: 'detail' });
        {
            oA.append('Click here to see background image');
            oFootDiv.append(oA);
        }
        oFootDiv.append(cBrowser.whitespace(100));

        var oBut = cAppRender.make_button(
            null,
            'refresh',
            'refresh random background image',
            false,
            () => oThis.fetch_image(),
        );
        oFootDiv.append(oBut);

        this.timer = setTimeout(() => oThis.fetch_image(), this.INTERVAL);
    }
}

//###############################################################
class cSideBar {
    static ID_SIDEBAR = 'SB';
    static ID_SIDEBAR_COLLAPSED = 'SBc';
    static ID_SIDEBAR_EXPANDED = 'SBe';
    static CLOSED_WIDTH = '60px';
    static OPEN_WIDTH = '250px';
    static FONT_SIZE = '40px';

    //*****************************************************************
    static onClickExpand() {
        cJquery.element(cIndexPageConsts.ID_LEFT_COL).width(this.OPEN_WIDTH);
        cJquery.element(this.ID_SIDEBAR).width(this.OPEN_WIDTH);
        cJquery.element(this.ID_SIDEBAR_COLLAPSED).hide();
        cJquery.element(this.ID_SIDEBAR_EXPANDED).show();
    }

    //*****************************************************************
    static onClickCollapse() {
        cJquery.element(cIndexPageConsts.ID_LEFT_COL).width(this.CLOSED_WIDTH);
        cJquery.element(this.ID_SIDEBAR).width(this.CLOSED_WIDTH);
        cJquery.element(this.ID_SIDEBAR_COLLAPSED).show();
        cJquery.element(this.ID_SIDEBAR_EXPANDED).hide();
    }

    //*****************************************************************
    static async render() {
        var oIcon, oThis;
        oThis = this;

        var oParent = cJquery.element(cIndexPageConsts.ID_LEFT_COL);

        var oContainer = $('<DIV>', {
            id: this.ID_SIDEBAR,
            class: 'sidebar',
        });
        {
            //-----------------------------------------------------------
            var oCollapsed = $('<DIV>', {
                id: this.ID_SIDEBAR_COLLAPSED,
                style: 'width:' + this.CLOSED_WIDTH,
                class: 'w3-center',
            });
            {
                oIcon = cRenderGoogleFont.create_icon(
                    'left_panel_open',
                    'font-size:' + this.FONT_SIZE,
                );
                {
                    oIcon.addClass('w3-hover-grey');
                    oIcon.click(() => oThis.onClickExpand());
                    oCollapsed.append(oIcon);
                }
                var oText = $('<DIV>', { class: 'sidebar-text' });
                {
                    oText.append('Menu');
                    oCollapsed.append(oText);
                }
            }
            oContainer.append(oCollapsed);
        }

        //-----------------------------------------------------------
        var oExpanded = $('<DIV>', {
            id: this.ID_SIDEBAR_EXPANDED,
            style: 'width:' + this.OPEN_WIDTH_WIDTH,
        });
        {
            oIcon = cRenderGoogleFont.create_icon(
                'left_panel_close',
                'font-size:' + this.FONT_SIZE,
            );
            {
                oIcon.addClass('w3-hover-grey');
                oIcon.click(() => oThis.onClickCollapse());
                oExpanded.append(oIcon);
            }

            oExpanded.hide();
            oContainer.append(oExpanded);
        }
        oParent.append(oContainer);
        return oContainer;
    }
}

//###############################################################
//* renders left column
//###############################################################
class cLeftColumn {
    static ID_TAB_TAG_CONTENT = 'idttc';
    static ID_TAB_SOL_CONTENT = 'idtsc';
    static ID_WIDGET_SOLCHOOSER = 'idWSC';
    static ID_WIDGET_SOLBUTTONS = 'idWSB';
    static WIDTH = '270px';

    //**********************************************************
    static async pr__render_sol_tab(poParent) {
        var oSolTabContent = $('<DIV>', {
            class: 'tab-content',
            id: this.ID_TAB_SOL_CONTENT,
        });
        {
            //--------SOL chooser
            var oSolChooser = $('<DIV>', {
                id: this.ID_WIDGET_SOLCHOOSER,
            });
            {
                oSolChooser.append('Loading ');
                oSolTabContent.append(oSolChooser);
                oSolChooser.solinstrumentChooser({
                    onStatus: (poEvent, paHash) =>
                        cIndexPage.onStatusEvent(poEvent, paHash),
                    onSelect: (poEvent, poData) =>
                        cIndexPage.onSelectSolInstrEvent(poEvent, poData),
                    mission: cMission,
                });
            }
            //----------SOL buttons
            var oSolButtons = $('<DIV>', {
                id: this.ID_WIDGET_SOLBUTTONS,
            });
            {
                oSolButtons.append('Loading ');
                oSolTabContent.append(oSolButtons);
                oSolButtons.solButtons({
                    onStatus: (poEvent, paHash) =>
                        cIndexPage.onStatusEvent(poEvent, paHash),
                    mission: cMission,
                    onClick: () => cIndexPage.stop_queue(),
                    onAllSolThumbs: () => cIndexPage.onClickAllSolThumbs(),
                });
            }
            //---------admin
            cAdminBox.render(oSolTabContent);

            //complete the widget
            poParent.append(oSolTabContent);
        }
    }

    //**********************************************************
    static async pr__render_tag_tab(poParent) {
        //Tab Content (tags)
        var oTagContent = $('<DIV>', {
            class: 'tab-content leftcolumn',
            id: this.ID_TAB_TAG_CONTENT,
        });
        {
            oTagContent.append('loading TAGS');
            poParent.append(oTagContent);
            oTagContent.tagcloud({
                mission: cMission,
            });
        }
    }

    //**********************************************************
    static render() {
        var oLeftColDiv = cJquery.element(cIndexPageConsts.ID_LEFT_COL);
        oLeftColDiv.empty();
        oLeftColDiv.addClass('w3-theme-d1');

        // side bar - contains an open and closed bit
        cSideBar.render(oLeftColDiv);
        {
            //tab bar
            var oExpandedBit = cJquery.element(cSideBar.ID_SIDEBAR_EXPANDED);
            {
                cPageTabs.render(oExpandedBit);
                this.pr__render_sol_tab(oExpandedBit);
                this.pr__render_tag_tab(oExpandedBit);
            }
        }

        //click the default tab
        cPageTabs.clickDefaultTab();
    }
}

//###############################################################
//* handles admin box
//###############################################################
class cAdminBox {
    //*************************************************************
    static async render(poParent) {
        var oThis = this;
        var oWidget = cAppRender.create_widget('Admin');
        var oBody = oWidget.body;
        {
            if (cIndexPageConsts.IS_ADMIN === 'yes') {
                var oButton = cAppRender.make_button(
                    null,
                    'Admin',
                    'Admin functions',
                    false,
                    () => oThis.onAdminClick(),
                );
                oBody.append(oButton);
            } else {
                oBody.append('Not an Admin');
            }
        }
        poParent.append(oWidget);
    }

    //*************************************************************
    static onAdminClick() {
        cBrowser.openWindow(
            cAppLocations.home + '/php/pages/admin/admin.php',
            'admin',
        );
    }
}

//###############################################################
//* handles search box
//###############################################################
class cSearchBox {
    static REST_URL = 'search.php';

    //***************************************************************
    static async render() {
        // populate contents
        var oThis = this;
        var oElement = cJquery.element(cIndexPageConsts.ID_SEARCH_PANE);
        oElement.empty();
        oElement.addClass('w3-cell-row');

        var oCell = $('<div>', { class: 'w3-cell' });
        {
            //--------- input box
            var oTextbox = $('<input>', {
                type: 'text',
                id: cIndexPageConsts.ID_SEARCH,
                size: 30,
            });
            oCell.append(oTextbox);

            //--------- button
            var oButton = cAppRender.make_button(
                null,
                'Search',
                'Search for a product',
                false,
                () => oThis.onClickSearch(),
            );
            oCell.append(oButton);
            oElement.append(oCell);
        }

        oCell = $('<div>', { class: 'w3-cell' });
        {
            //--------- checkbox
            var oCheckbox = $('<input>', {
                class: 'w3-check',
                type: 'checkbox',
                id: cIndexPageConsts.ID_CHKTHUMBS,
            });
            oCell.append(oCheckbox);

            oCell.append('<label>Show Thumbnails</label>');
            oElement.append(oCell);
        }

        // setup keypress
        this.pr_instrument_box();
    }

    //***************************************************************
    static pr_instrument_box() {
        var oThis = this;
        cJquery.element(cIndexPageConsts.ID_SEARCH).keypress(function (e) {
            oThis.onSearchKeypress(e);
        });
    }

    //***************************************************************
    static onSearchKeypress(poEvent) {
        cIndexPage.stop_queue();
        if (poEvent.which == 13) this.onClickSearch();
    }

    //***************************************************************
    static onClickSearch() {
        cIndexPage.stop_queue();
        const sText = cJquery.element(cIndexPageConsts.ID_SEARCH).val();
        if (sText == '') return;
        cIndexPageOptions.instrument = null;
        var oThis = this;

        if (!isNaN(sText)) {
            cJquery
                .element(cLeftColumn.ID_WIDGET_SOLCHOOSER)
                .solinstrumentChooser('set_sol', sText);
        } else {
            const sUrl = cBrowser.buildUrl(
                cAppLocations.rest + '/' + this.REST_URL,
                {
                    s: sText,
                    m: cMission.ID,
                },
            );
            const oHttp = new cHttp2();
            {
                bean.on(oHttp, 'result', (poHttp) =>
                    oThis.OnSearchResponse(poHttp),
                );
                oHttp.fetch_json(sUrl);
            }
        }
    }

    //***************************************************************
    static OnSearchResponse(poHttp) {
        var sUrl;

        const oData = poHttp.response;
        if (!oData) {
            cCommonStatus.set_status('not a valid search');
        } else {
            cCommonStatus.set_status('got search callback');
            sUrl = cBrowser.buildUrl('detail.php', {
                s: oData.s,
                i: oData.d.instrument,
                p: oData.d.itemName,
            });
            document.location.href = sUrl;
        }
    }
}
//###############################################################
//* handles page tabs
//###############################################################
class cPageTabs {
    //see w3.css tabs https://www.w3schools.com/w3css/w3css_tabulators.asp
    static current_button = null;
    static HIGHLIGHT_CLASS = 'w3-theme-button-up';
    static LOWLIGHT_CLASS = 'w3-theme-button-down';
    static SOL_CAPTION = 'Sol';
    static TAGS_CAPTION = 'Tags';
    static BUTTON_CLASS = 'tagbut';
    static ID_TAB_BAR = null;

    //*********************************************************************
    static async render(poParent) {
        //-----------------------the TAB Bar
        var oTabBar = $('<DIV>');
        {
            oTabBar.uniqueId();
            this.ID_TAB_BAR = oTabBar.attr('id');
            oTabBar.append('Loading Tab bar');
            poParent.append(oTabBar);
        }

        this.pr__renderTabs();
    }

    //*********************************************************************
    static pr__renderTabs() {
        cDebug.write('instrumenting tabs');

        //clear out any content
        var oBar = cJquery.element(this.ID_TAB_BAR);
        oBar.empty();

        //add the buttons the the tab bar
        this.pr__add_tab(
            oBar,
            this.SOL_CAPTION,
            cLeftColumn.ID_TAB_SOL_CONTENT,
        );
        this.pr__add_tab(
            oBar,
            this.TAGS_CAPTION,
            cLeftColumn.ID_TAB_TAG_CONTENT,
        );
    }

    //*********************************************************************
    static onTabClick(poElement) {
        //close all content pages
        $('.tab-content').each(function () {
            $(this).hide();
        });

        //remove the highlight of all buttons within the TAB BAR
        var oThis = this;
        var oParent = cJquery.element(this.ID_TAB_BAR);
        var oChildren = oParent.children('.' + this.BUTTON_CLASS);

        oChildren.each(function () {
            var oButton = $(this);
            oButton.removeClass(oThis.HIGHLIGHT_CLASS);
            oButton.addClass(oThis.LOWLIGHT_CLASS);
        });

        //add highlight to clicked  tab button element
        poElement.addClass(this.HIGHLIGHT_CLASS);
        poElement.removeClass(this.LOWLIGHT_CLASS);

        //show the tab target for the button clicked
        var sTarget = poElement.attr('target');
        var oSelected = cJquery.element(sTarget);
        oSelected.show();
    }

    //*********************************************************************
    static pr__add_tab(poParent, psCaption, psTarget) {
        var sChildID, oButton, oThis;

        oThis = this;

        //create button
        sChildID = cJquery.child_ID(poParent, psCaption); //should really remove spaces from caption
        oButton = $('<button>', {
            id: sChildID,
            class: 'w3-bar-item w3-button ' + oThis.BUTTON_CLASS,
            target: psTarget,
        });

        //set button properties
        oButton.width('50%');
        oButton.append(psCaption);
        oButton.on('click', function () {
            oThis.onTabClick($(this));
        });

        //add button to parent
        poParent.append(oButton);
        return oButton;
    }

    //*********************************************************************
    static clickDefaultTab() {
        var oBar = cJquery.element(this.ID_TAB_BAR);
        var sButtonID = cJquery.child_ID(oBar, this.SOL_CAPTION);
        var oButton = cJquery.element(sButtonID);
        oButton.click();
    }
}

//###############################################################
//* not quite a JQUERY widget - JQuery Events
//###############################################################

class cIndexPage {
    /**
     *called  when jQuery is loaded
     *
     * @static
     * @memberof cIndexPage
     * @returns void
     */
    static onLoadJQuery() {
        // show the intro blurb if nothing on the querystring
        if (document.location.search.length == 0) {
            cJquery.element(cIndexPageConsts.ID_INTRO).show();
            cBackgroundImage.render();
        }

        // load the tabs and show the first one
        cLeftColumn.render();

        // remember the start_image if its there
        if (cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING]) {
            cIndexPageOptions.start_image = parseInt(
                cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING],
            );
        }

        // render searchbox
        cSearchBox.render();

        // disable thumbs checkbox until something happens
        cJquery
            .element(cIndexPageConsts.ID_CHKTHUMBS)
            .attr('disabled', 'disabled');
    }

    //###############################################################
    //# Event Handlers
    //###############################################################
    static onClickAllSolThumbs() {
        this.stop_queue();
        cIndexPageOptions.instrument = null;
        cIndexPageOptions.start_image = -1;
        cJquery
            .element(cIndexPageConsts.ID_CHKTHUMBS)
            .prop('checked', true)
            .attr('disabled', 'disabled');
        cJquery
            .element(cLeftColumn.ID_WIDGET_SOLCHOOSER)
            .solinstrumentChooser('deselectInstrument');
        this.load_data();
    }

    //***************************************************************
    static onCheckThumbsEvent() {
        this.stop_queue();
        this.load_data();
    }

    //***************************************************************
    static onImageClick(poEvent, poOptions) {
        this.stop_queue();
        const sUrl = cBrowser.buildUrl('detail.php', {
            s: poOptions.sol,
            i: poOptions.instrument,
            p: poOptions.product,
        });
        cBrowser.openWindow(sUrl, 'detail');
    }

    //***************************************************************
    static onSelectSolInstrEvent(poEvent, poData) {
        this.stop_queue();
        // load the data
        cDebug.write('selected sol ' + poData.sol);
        cIndexPageOptions.sol = poData.sol;
        cDebug.write('selected instr ' + poData.instrument);
        cIndexPageOptions.instrument = poData.instrument;
        if (!cIndexPageOptions.keep_start_image)
            cIndexPageOptions.start_image = 1;
        cIndexPageOptions.keep_start_image = false;
        this.load_data();
    }

    //***************************************************************
    static onStatusEvent(poEvent, paHash) {
        cCommonStatus.set_status(paHash.data);
    }

    //***************************************************************
    static onThumbClickEvent(poEvent, poData) {
        this.stop_queue();
        const sUrl = cBrowser.buildUrl('detail.php', {
            s: poData.sol,
            i: poData.instr,
            p: poData.product,
        });
        cDebug.write('loading page ' + sUrl);
        var oImgDiv = cJquery.element(cIndexPageConsts.ID_IMAGE_CONTAINER);
        {
            oImgDiv.empty();
            oImgDiv.html('redirecting to: ' + sUrl);
        }
        setTimeout(() => cBrowser.openWindow(sUrl, 'detail'), 0);
    }

    //***************************************************************
    static onImagesLoadedEvent(poEvent, piStartImage) {
        // enable thumbnails
        cJquery.element(cIndexPageConsts.ID_CHKTHUMBS).removeAttr('disabled');
        cIndexPageOptions.start_image = piStartImage;
        this.update_url();
    }

    //###############################################################
    //# Utility functions
    //###############################################################
    static update_url() {
        const oParams = {};
        oParams[cSpaceBrowser.SOL_QUERYSTRING] = cIndexPageOptions.sol;
        if (cIndexPageOptions.instrument)
            oParams[cSpaceBrowser.INSTR_QUERYSTRING] =
                cIndexPageOptions.instrument;
        if (this.is_thumbs_checked())
            oParams[cSpaceBrowser.THUMB_QUERYSTRING] = '1';
        if (cIndexPageOptions.start_image)
            oParams[cSpaceBrowser.BEGIN_QUERYSTRING] =
                cIndexPageOptions.start_image;
        const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams);
        cBrowser.pushState('Index', sUrl);
    }

    //***************************************************************
    static stop_queue() {
        var oDiv;
        try {
            oDiv = cJquery.element(cIndexPageConsts.ID_IMAGE_CONTAINER);
            oDiv.thumbnailview('stop_queue');
        } catch (e) {
            /* do nothing*/
        }
    }

    //***************************************************************
    static is_thumbs_checked() {
        return cJquery.element(cIndexPageConsts.ID_CHKTHUMBS).is(':checked');
    }

    /**
     *loads data into the page - is also triggered by solinstrchooser
     *
     * @static
     * @memberof cIndexPage
     */
    static load_data() {
        var oChkThumb;
        const oThis = this;
        this.update_url();

        cDebug.write(
            'loading data: ' +
                cIndexPageOptions.sol +
                ':' +
                cIndexPageOptions.instrument,
        );

        //inform subscribers @todo - change to use bean. this function shouldnt have to know who the subscribers are
        var oSolBtnsElement = cJquery.element(cLeftColumn.ID_WIDGET_SOLBUTTONS);
        oSolBtnsElement.solButtons('set_sol', cIndexPageOptions.sol);

        //inform subscribers
        oChkThumb = cJquery.element(cIndexPageConsts.ID_CHKTHUMBS);
        if (cIndexPageOptions.instrument) {
            oChkThumb.removeAttr('disabled');
            oChkThumb.off('change');
            if (cBrowser.data[cSpaceBrowser.THUMB_QUERYSTRING]) {
                oChkThumb.prop('checked', true);
                this.show_thumbs(
                    cIndexPageOptions.sol,
                    cIndexPageOptions.instrument,
                );
            } else {
                this.show_images(
                    cIndexPageOptions.sol,
                    cIndexPageOptions.instrument,
                    cIndexPageOptions.start_image,
                );
            }
            oChkThumb.on('change', (poEvent) =>
                oThis.onCheckThumbsEvent(poEvent),
            );
        } else {
            oChkThumb.attr('disabled', 'disabled');
            this.show_thumbs(
                cIndexPageOptions.sol,
                cSpaceBrowser.ALL_INSTRUMENTS,
            );
        }
    }

    //###############################################################
    //* GETTERS
    //###############################################################
    static show_thumbs(psSol, psInstrument) {
        var oDiv;
        cAppRender.update_title(
            'showing  thumbs for sol:' + psSol + ' : ' + psInstrument,
        );
        const oThis = this;

        oDiv = cJquery.element(cIndexPageConsts.ID_IMAGE_CONTAINER);
        if (oDiv.length == 0) $.error('image DIV not found ');

        if (oDiv.thumbnailview('instance') != undefined) {
            oDiv.thumbnailview('destroy');
        }

        cDebug.write('creating widget');
        oDiv.thumbnailview({
            // apply widget
            sol: psSol,
            instrument: psInstrument,
            onStatus(poEvent, paHash) {
                oThis.onStatusEvent(poEvent, paHash);
            }, // TODO replace with events
            onClick(poEvent, poData) {
                oThis.onThumbClickEvent(poEvent, poData);
            },
            mission: cMission,
        });
    }

    //***************************************************************
    static show_images(piSol, psInstr, piStartImage) {
        var oWidget, oDiv;
        const oThis = this;
        cAppRender.update_title(
            'showing  images for sol:' + piSol + ' : ' + psInstr,
        );

        //---- find the DIV
        oDiv = cJquery.element(cIndexPageConsts.ID_IMAGE_CONTAINER);
        if (oDiv.length == 0) $.error('image DIV not found');

        //---- destroy the previous widget if it exists
        oWidget = oDiv.data('ckImageview');
        if (oWidget) oWidget.destroy();

        //---- create the widget to display the images
        cDebug.write('creating widget');
        oDiv.imageview({
            // apply widget
            sol: piSol,
            instrument: psInstr,
            start_image: piStartImage,
            onStatus(poEvent, paHash) {
                oThis.onStatusEvent(poEvent, paHash);
            },
            onLoaded(poEvent, piStartImage) {
                oThis.onImagesLoadedEvent(poEvent, piStartImage);
            },
            onClick(poEvent, poOptions) {
                oThis.onImageClick(poEvent, poOptions);
            },
            mission: cMission,
        });
    }
}
