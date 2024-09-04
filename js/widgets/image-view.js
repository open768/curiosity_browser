// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class cImageList {
    IMAGES_URL = cAppLocations.rest + '/images.php';
    IMAGES_TO_SHOW = 5;
    CURRENT_CHILD_ID = 'CILC';

    widget = null;
    element = null;
    options = null;
    start_image = 1;

    //********************************************************
    constructor(poWidget) {
        this.widget = poWidget;
        this.element = poWidget.element;
        this.options = poWidget.options;

        //------------------checks
        const oOptions = this.options;
        if (oOptions.sol == null) $.error('sol is not set');
        if (oOptions.instrument == null) $.error('instrument is not set');
        if (oOptions.mission == null) $.error('mission is not set');
    }

    //*****************************************************************************
    load_images(piStartImage) {
        const oOptions = this.options;
        this.widget._trigger('onStatus', null, { text: 'loading Images' });

        const oThis = this;
        const oElement = this.element;

        //------------------- add a spinner
        oElement.empty();

        var sCaption =
            'Loading Images for sol:' +
            oOptions.sol +
            ' instr:' +
            oOptions.instrument;
        const oDiv = cAppRender.make_spinner(sCaption);
        oElement.append(oDiv);

        // --------------update the Browser url
        var oParams = {};
        oParams[cSpaceBrowser.BEGIN_QUERYSTRING] = piStartImage;
        oParams[cSpaceBrowser.SOL_QUERYSTRING] = oOptions.sol;
        oParams[cSpaceBrowser.INSTR_QUERYSTRING] = oOptions.instrument;
        var sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams);
        cBrowser.update_state('index', sUrl);

        //update the navigation bar current page

        // ------------------load images
        sUrl = cBrowser.buildUrl(this.IMAGES_URL, {
            s: oOptions.sol,
            i: oOptions.instrument,
            b: piStartImage,
            e: piStartImage + this.IMAGES_TO_SHOW,
            m: oOptions.mission.ID,
        });
        const oHttp = new cHttp2();
        {
            bean.on(oHttp, 'result', (poHttp) => oThis.onImagesLoaded(poHttp));
            oHttp.fetch_json(sUrl);
        }
    }

    //*****************************************************************************
    pr_render_navigation(piMax) {
        const oElement = this.element;
        const oOptions = this.options;
        const oThis = this;
        oElement.empty();

        var oDiv = $('<div>', {
            class: 'W3-container w3-theme-d3',
        });
        {
            //-----------------------------------------------------------------------
            var bDisabled = oOptions.start_image < this.IMAGES_TO_SHOW;
            var oPrevPageButton = cAppRender.make_button(
                null,
                '<< Previous',
                'previous Page',
                bDisabled,
                () => oThis.onClickPreviousPage(),
            );
            {
                oPrevPageButton.width('200px');
                oDiv.append(oPrevPageButton);
            }

            //-----------------------------------------------------------------------
            var sID = cJquery.child_ID(oElement, this.CURRENT_CHILD_ID);
            var oCurrentDiv = $('<span>', {
                id: sID,
                class: 'w3-margin-left w3-margin-right',
            });
            {
                oCurrentDiv.append(oOptions.start_image);
                oDiv.append(oCurrentDiv);
            }

            //-----------------------------------------------------------------------
            bDisabled = oOptions.start_image >= piMax - this.IMAGES_TO_SHOW;
            var oNextPageButton = cAppRender.make_button(
                null,
                'Next >>',
                'next Page',
                bDisabled,
                () => oThis.onClickNextPage(),
            );
            {
                oNextPageButton.width('200px');
                oDiv.append(oNextPageButton);
            }

            //-----------------------------------------------------------------------
            oDiv.append(' Max:' + piMax);
        }
        oElement.append(oDiv);
    }

    //*****************************************************************************
    //* Events
    //*****************************************************************************
    onImagesLoaded(poHttp) {
        const oThis = this;
        var oDiv, iIndex;

        this.widget._trigger('onStatus', null, { text: 'showing images' });
        const oJson = poHttp.response;
        const oOptions = this.options;

        // clear out the image div
        this.element.empty();

        // build the html to put into the div
        if (oJson.max == 0) {
            this.element.append(cAppRender.make_note('No data found'));
        } else {
            // nothing in this div
            oOptions.max_images = oJson.max;
            oOptions.start_image = parseInt(oJson.start);

            this.pr_render_navigation(oJson.max);
            // create the navigation div

            // display the images
            for (iIndex = 0; iIndex < oJson.images.length; iIndex++) {
                // get the img details
                let oItem = oJson.images[iIndex];

                // build up the div
                oDiv = $('<DIV>').instrumentimage({
                    sol: oOptions.sol,
                    instrument: oOptions.instrument,
                    product: oItem.p,
                    mission: oOptions.mission,
                    src: oItem.i,
                    date: oItem.du,
                    onClick: function (poEvent, poData) {
                        oThis.widget._trigger('onClick', poEvent, poData);
                    },
                    onStatus: function (poEvent, paData) {
                        oThis.widget._trigger('onStatus', poEvent, paData);
                    },
                });
                this.element.append(oDiv);
                this.element.append('<P>');
            }
        }

        // set up keypress
        if (!oOptions.keypress_done) {
            this.widget._on(window, {
                keypress: function (poEvent) {
                    oThis.onKeypress(poEvent);
                },
            });
            oOptions.keypress_done = true;
        }

        this.widget._trigger('onLoaded', null, oOptions.start_image);
    }

    //**************************************************************************************************
    onClickPreviousPage() {
        const oOptions = this.options;
        if (oOptions.start_image < this.IMAGES_TO_SHOW) return;
        this.load_images(oOptions.start_image - this.IMAGES_TO_SHOW);
    }

    //**************************************************************************************************
    onClickNextPage() {
        const oOptions = this.options;
        if (oOptions.start_image >= oOptions.max_images - this.IMAGES_TO_SHOW)
            return;

        this.load_images(oOptions.start_image + this.IMAGES_TO_SHOW);
    }

    //**************************************************************************************************
    onKeypress(poEvent) {
        if (poEvent.target.tagName === 'INPUT') return;

        const sChar = String.fromCharCode(poEvent.which);

        switch (sChar) {
            case 'n':
                this.onClickNextPage();
                break;
            case 'p':
                this.onClickPreviousPage();
                break;
        }
    }
}

//################################################################################
//#
//################################################################################
$.widget('ck.image_list', {
    //#################################################################
    //# Definition
    //#################################################################
    options: {
        sol: null,
        instrument: null,
        start_image: 0,
        max_images: -1,
        keypress_done: false,
        mission: null,
    },

    //#################################################################
    //# Constructor
    //#################################################################
    _create: function () {
        // check for necessary classes
        if (!bean) {
            $.error('bean class is missing! check includes');
        }
        if (!cHttp2) {
            $.error('http2 class is missing! check includes');
        }

        // init
        const sElementName = this.element.get(0).tagName;
        if (sElementName !== 'DIV') {
            $.error(
                'thumbnail view needs a DIV. this element is a: ' +
                    sElementName,
            );
        }

        // check that the options are passed correctly
        const oOptions = this.options;
        if (oOptions.sol == null) $.error('sol is not set');
        if (oOptions.instrument == null) $.error('instrument is not set');
        if (oOptions.mission == null) $.error('mission is not set');

        // start the images load
        var oInstance = new cImageList(this);
        oInstance.load_images(oOptions.start_image);
    },
});
