const goImageQueue = new cHttpQueue();

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.instrumentimage', {
    //#################################################################
    //# Definition
    //#################################################################
    options: {
        sol: null,
        instrument: null,
        product: null,
        src: null, // used when multiple images are requested for the same sol. reduced network bandwidth in this case
        date: null,
        image_div: null,
        tags_div: null,
        mission: null,
    },
    consts: {
        WAIT_VISIBLE: 1000,
        WAIT_IMAGE: cAppLocations.home + '/images/browser/chicken_icon.png',
    },

    //#################################################################
    //# Constructor
    //#################################################################
    _create: function () {
        const oThis = this;
        const oOptions = oThis.options;
        const oElement = oThis.element;

        if (oOptions.sol == null) $.error('sol is not set');
        if (oOptions.instrument == null) $.error('instrument is not set');
        if (oOptions.product == null) $.error('product is not set');
        if (oOptions.mission == null) $.error('mission is not set');
        if (!$.event.special.inview)
            $.error('inview class is missing! check includes');
        if (!oElement.gSpinner) $.error('gSpinner is missing! check includes');
        if (!oElement.visible)
            $.error('visible class is missing! check includes');

        // make sure this is a DIV
        const sElementName = oElement.get(0).tagName;
        if (sElementName !== 'DIV') {
            $.error(
                'image view needs a DIV. this element is a: ' + sElementName,
            );
        }

        oElement.uniqueId();

        // put a please wait notice up
        oElement.empty();
        oElement.addClass('ui-widget-content');

        var oDiv = $('<DIV>', { class: 'ui-widget-header' });
        oDiv.append('Loading....');
        oElement.append(oDiv);

        oDiv = $('<DIV>', { class: 'ui-widget-body' });
        const sWaitImgID = oElement.attr('id') + 'i';
        const oWaitImg = $('<IMG>', {
            src: this.consts.WAIT_IMAGE,
            id: sWaitImgID,
        });
        oDiv.append(oWaitImg);
        oDiv.append(' One Moment please: ' + oOptions.product);
        oElement.append(oDiv);

        // wait for the element to come into view before rendering
        oWaitImg.on('inview', function (poEvent, pbIsInView) {
            oThis.onPlaceholderVisible(pbIsInView);
        });
    },

    // ***************************************************************
    onPlaceholderVisible: function (pbIsInView) {
        // wait for a few ms before rendering, just in case the element has  scrolled thru the viewport
        if (pbIsInView) {
            const sWaitImgID = this.element.attr('id') + 'i';
            const oImg = cJquery.element(sWaitImgID);
            oImg.off('inview');

            const oThis = this;
            setTimeout(
                () => oThis.onPlaceholderDelay(),
                this.consts.WAIT_VISIBLE,
            );
        }
    },

    // ***************************************************************
    onPlaceholderDelay: function () {
        const sWaitImgID = this.element.attr('id') + 'i';
        const oImg = cJquery.element(sWaitImgID);
        if (!oImg.visible()) {
            // bug only fires if the whole div is visible... which it wont be
            const oThis = this;
            oImg.on('inview', function (poEvent, pbIsInView) {
                oThis.onPlaceholderVisible(pbIsInView);
            });
            return;
        }

        const oOptions = this.options;
        if (oOptions.src == null) {
            this.prv_loadDetails();
        } else {
            this.prv__render();
        }
    },

    //#################################################################
    //# Privates
    //#################################################################
    prv_loadDetails: function () {
        const oThis = this;
        const oOptions = oThis.options;
        const oElement = oThis.element;

        // put up a loading...
        oElement.empty();
        oElement.addClass('ui-widget-content');
        var oDiv = $('<DIV>', { class: 'ui-widget-header' }).append(
            'Loading details for: ' + oOptions.product,
        );
        oElement.append(oDiv);

        oDiv = $('<DIV>', { class: 'ui-widget-body' });
        const oLoader = $('<DIV>').gSpinner({ scale: 0.25 });
        oDiv.append(oLoader).append('Loading :' + oOptions.product);
        oElement.append(oDiv);

        // load the data
        const oItem = new cHttpQueueItem();
        oItem.url = cBrowser.buildUrl(cAppLocations.rest + '/detail.php', {
            s: oOptions.sol,
            i: oOptions.instrument,
            p: oOptions.product,
            m: oOptions.mission.ID,
        });
        bean.on(oItem, 'result', (poHttp) => oThis.onProductDetails(poHttp));
        bean.on(oItem, 'error', (poHttp) => oThis.onProductError(poHttp));
        goImageQueue.add(oItem);
    },

    // ***************************************************************
    prv__render: function () {
        const oThis = this;
        const oOptions = oThis.options;
        const oElement = oThis.element;

        oElement.empty();
        oElement.addClass('ui-widget-content');

        // build information div
        const oInfoDiv = $('<DIV>', { class: 'ui-widget-header' });
        oInfoDiv.append(
            $('<SPAN>', { class: 'ui-state-highlight' }).html('Date: '),
        );
        oInfoDiv.append(oOptions.date);
        oInfoDiv.append(
            $('<SPAN>', { class: 'ui-state-highlight' }).html(' Product: '),
        );
        oInfoDiv.append(oOptions.product);
        oInfoDiv.append(
            $('<SPAN>', { class: 'ui-state-highlight' }).html(' Tags: '),
        );
        oOptions.tags_div = $('<SPAN>', { class: 'soltags' }).html(
            'Loading ...',
        );
        oInfoDiv.append(oOptions.tags_div);

        // build image div
        const oImgDiv = $('<DIV>', { class: 'ui-widget-body' }).css({
            position: 'relative',
        });
        oOptions.image_div = oImgDiv;
        var oImg = $('<IMG>', { src: oOptions.src });
        oImg.on('load', function () {
            oThis.onLoadedImage();
        });
        oImg.click(function () {
            oThis._trigger('onClick', null, oOptions);
        });
        oImgDiv.append(oImg);

        // add the lot to the element
        oElement.append(oInfoDiv);
        oElement.append(oImgDiv);
    },

    //#################################################################
    //# Events
    //#################################################################
    onLoadedImage: function () {
        const oOptions = this.options;
        const oThis = this;

        cDebug.write('loaded image: ' + this.options.src);

        // get the image and tag highlights
        //#TODO# add these to a queue that can be stopped
        cImgHilite.getHighlights(
            oOptions.sol,
            oOptions.instrument,
            oOptions.product,
            (poHttp) => oThis.onHighlights(poHttp),
        );
        cTagging.getTags(
            oOptions.sol,
            oOptions.instrument,
            oOptions.product,
            (paJS) => oThis.onTags(paJS),
        );
    },

    // ***************************************************************
    onHighlights: function (poHttp) {
        var i, oDiv, oRedBox, iLeft, iTop;
        var oData = poHttp.response;

        if (!oData.d) return;
        oDiv = this.options.image_div;

        for (i = 0; i < oData.d.length; i++) {
            var aItem = oData.d[i];

            // create a redbox and display it
            oRedBox = $('<DIV>', { class: 'redbox' });
            oDiv.append(oRedBox);

            // place it relative to the parent location
            iTop = parseInt(aItem.t);
            iLeft = parseInt(aItem.l);
            oRedBox.css({ position: 'absolute', top: iTop, left: iLeft });
        }
    },

    // ***************************************************************
    onTags: function (paJS) {
        var oDiv, oA, sTag, i;

        oDiv = this.options.tags_div;
        oDiv.empty();

        if (paJS.d.length == 0) {
            oDiv.html('no Tags');
            return;
        }

        // put in the tags
        for (i = 0; i < paJS.d.length; i++) {
            sTag = paJS.d[i];
            const sUrl = cBrowser.buildUrl('tag.php', { t: sTag });
            oA = $('<A>', { href: sUrl }).html(sTag);
            oDiv.append(oA).append(' ');
        }
    },

    // ***************************************************************
    onProductDetails: function (poHttp) {
        if (poHttp.response.d) {
            this.options.src = poHttp.response.d.i;
            this.prv__render();
        } else {
            this.onProductError(poHttp);
        }
    },

    // ***************************************************************
    onProductError: function () {
        const oElement = this.element;

        oElement.empty();
        const oDiv = $('<DIV>', { class: 'ui-state-error' });
        oDiv.html('There was an error with :' + this.options.product);
        oElement.append(oDiv);
        oElement.append('<p>');
    },
});
