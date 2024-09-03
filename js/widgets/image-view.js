// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.imageview', {
    //#################################################################
    //# Definition
    //#################################################################
    consts: {
        IMAGES_URL: cAppLocations.rest + '/images.php',
        IMAGES_TO_SHOW: 5,
        CurrentID: 'C',
        LeftID: 'L',
        RightID: 'R',
        MaxID: 'M',
    },
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
        // check that the element is a div

        // check for necessary classes
        if (!bean) {
            $.error('bean class is missing! check includes');
        }
        if (!cHttp2) {
            $.error('http2 class is missing! check includes');
        }
        if (!this.element.gSpinner) {
            $.error('gSpinner is missing! check includes');
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
        this._trigger('onStatus', null, { text: 'loading Images' });
        this._load_images(oOptions.start_image);
    },

    //#################################################################
    //# Methods
    //#################################################################
    _load_images: function (piStartImage) {
        const oThis = this;
        const oOptions = this.options;

        // put some info in the widget
        const oElement = this.element;
        oElement.empty();

        const oDiv = $('<DIV>', { class: '.ui-widget-content' });
        const oLoader = $('<DIV>');
        oLoader.gSpinner({ scale: 0.25 });
        oDiv.append(oLoader).append(
            'Loading Images for sol:' +
                oOptions.sol +
                ' instr:' +
                oOptions.instrument,
        );
        oElement.append(oDiv);

        // load images
        const sUrl = cBrowser.buildUrl(this.consts.IMAGES_URL, {
            s: oOptions.sol,
            i: oOptions.instrument,
            b: piStartImage,
            e: piStartImage + this.consts.IMAGES_TO_SHOW,
            m: oOptions.mission.ID,
        });
        const oHttp = new cHttp2();
        {
            bean.on(oHttp, 'result', (poHttp) => oThis.onFullImages(poHttp));
            oHttp.fetch_json(sUrl);
        }
    },

    //#################################################################
    //# events
    //#################################################################
    onKeypress: function (poEvent) {
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
    },

    //**************************************************************************************************
    onFullImages: function (poHttp) {
        const oThis = this;
        var oDiv, iIndex;

        this._trigger('onStatus', null, { text: 'showing images' });
        const oJson = poHttp.response;
        const oOptions = this.options;

        // clear out the image div
        this.element.empty();

        // build the html to put into the div
        if (oJson.max == 0) {
            this.element.html('No data found');
        } else {
            // nothing in this div
            this.element.empty();
            oOptions.max_images = oJson.max;

            // update title
            oOptions.start_image = parseInt(oJson.start);

            // create the navigation div
            const sID = this.element.id;
            const oNavTable = $('<table>', { class: 'gold', width: '100%' });
            const oRow = $('<TR>');
            var oCell = $('<TD>', { width: '40%' });
            var oButton = $('<button>', {
                class: 'leftarrow imagenav',
                title: 'Previous Page',
                id: sID + this.consts.LeftID,
            });
            if (oOptions.start_image < this.consts.IMAGES_TO_SHOW) {
                oButton.attr('disabled', 'disabled');
            } else {
                oButton.html('Previous Page').click(function () {
                    oThis.onClickPreviousPage();
                });
            }
            oCell.append(oButton);
            oRow.append(oCell);
            oCell = $('<TD>', {
                width: '10%',
                id: sID + this.consts.CurrentID,
                align: 'middle',
            }).html(oJson.start);
            oRow.append(oCell);
            oCell = $('<TD>', { width: '40%' });
            oButton = $('<button>', {
                class: 'rightarrow imagenav',
                title: 'Previous Page',
                id: sID + this.consts.LeftID,
            });
            if (
                oOptions.start_image >=
                oJson.max - this.consts.IMAGES_TO_SHOW
            ) {
                oButton.attr('disabled', 'disabled');
            } else {
                oButton.html('Next Page').click(function () {
                    oThis.onClickNextPage();
                });
            }
            oCell.append(oButton);
            oRow.append(oCell);
            oCell = $('<TD>', { align: 'right' });
            oCell.append(' Max:' + oJson.max);
            oRow.append(oCell);
            oNavTable.append(oRow);
            this.element.append(oNavTable);

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
                        oThis._trigger('onClick', poEvent, poData);
                    },
                    onStatus: function (poEvent, paData) {
                        oThis._trigger('onStatus', poEvent, paData);
                    },
                });
                this.element.append(oDiv);
                this.element.append('<P>');
            }

            // add the navigation controls again (have to clone)
            this.element.append(oNavTable.clone(true));
        }

        // set up keypress
        if (!oOptions.keypress_done) {
            this._on(window, {
                keypress: function (poEvent) {
                    oThis.onKeypress(poEvent);
                },
            });
            oOptions.keypress_done = true;
        }

        this._trigger('onLoaded', null, oOptions.start_image);
    },

    //**************************************************************************************************
    onClickPreviousPage: function () {
        const oOptions = this.options;
        if (oOptions.start_image < this.consts.IMAGES_TO_SHOW) return;
        this._load_images(oOptions.start_image - this.consts.IMAGES_TO_SHOW);
    },

    //**************************************************************************************************
    onClickNextPage: function () {
        const oOptions = this.options;
        if (
            oOptions.start_image >=
            oOptions.max_images - this.consts.IMAGES_TO_SHOW
        )
            return;
        this._load_images(oOptions.start_image + this.consts.IMAGES_TO_SHOW);
    },
});
