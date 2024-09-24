var goHighlightQueue = new cHttpQueue()

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.solhighlights', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		mission: null,
		sol: null,
		home: null,
		onStatus: null,
		onClick: null
	},

	//#################################################################
	//# Constructor
	//#################################################################
	_create: function () {
		var oOptions = this.options
		var oElement = this.element

		//check for necessary classes
		if (!bean) {
			$.error('bean class is missing! check includes')
		}
		if (!cHttp2) {
			$.error('http2 class is missing! check includes')
		}

		//check that the options are passed correctly
		if (oOptions.mission == null) $.error('mission is not set')
		if (oOptions.sol == null) $.error('Sol is not set')
		oElement.uniqueId()

		//check that the element is a div
		var sElementName = oElement.get(0).tagName
		if (sElementName !== 'DIV') $.error('needs a DIV. this element is a: ' + sElementName)

		//clear out the DIV and put some text in it
		oElement.empty()
		var oSpinner = cAppRender.make_spinner('taming velociraptors ....')
		oElement.append(oSpinner)

		//ok get the data
		this.pr__get_sol_highlights()
	},

	//***************************************************************************
	pr__get_sol_highlights: function () {
		var oParams = {}
		var oThis = this

		this._trigger('onStatus', null, { text: 'fetching highlights' })

		oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.options.sol

		var oHttp = new cHttp2()
		{
			if (cBrowser.data[cSpaceBrowser.MOSAIC_QUERYSTRING] != null) {
				oParams[cSpaceBrowser.OUTPUT_QUERYSTRING] = 'mosaic'
				bean.on(oHttp, 'result', poHttp => oThis.onMosaicResponse(poHttp))
			} else {
				oParams[cSpaceBrowser.OUTPUT_QUERYSTRING] = 'soldata'
				bean.on(oHttp, 'result', poHttp => oThis.onSheetResponse(poHttp))
			}

			var sUrl = cBrowser.buildUrl(cAppLocations.rest + '/img_highlight.php', oParams)
			oHttp.fetch_json(sUrl)
		}
	},

	//***************************************************************************
	onMosaicResponse: function (poHttp) {
		var oElement = this.element

		oElement.empty()
		var oData = poHttp.response

		if (oData.u == null) oElement.append(cAppRender.make_note('Sorry no Mosaic found'))
		else {
			var oImg = $('<IMG>').attr({ src: oData.u })
			oElement.append(oImg)
		}
		this._trigger('onStatus', null, { text: 'ok' })
	},

	//***************************************************************************
	onSheetResponse: function (poHttp) {
		var oElement = this.element
		var oThis = this
		var oDiv

		//-----------------------------------------------------------------
		this._trigger('onStatus', null, { text: 'got some data.. processing' })
		oElement.empty()

		//-----------------------------------------------------------------
		var iCount = 0
		var aData = poHttp.response
		var sInstrument
		for (sInstrument in aData) {
			oDiv = $('<DIV>').instrhighlight({
				mission: this.options.mission,
				sol: this.options.sol,
				instr: sInstrument,
				products: aData[sInstrument],
				home: this.options.home,
				onClick: function (poEvent, poData) {
					oThis._trigger('onClick', null, poData)
				}
			})
			oElement.append(oDiv)
			oElement.append('<P>')
			iCount++
		}

		if (iCount == 0) {
			oElement.append(cAppRender.make_note('Sorry no Highlights found'))
		}
	}
})

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.instrhighlight', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		mission: null,
		sol: null,
		instr: null,
		products: null,
		onClick: null
	},
	consts: {
		WAIT_VISIBLE: 750,
		HIGHLIGHT_URL: cAppLocations.rest + '/img_highlight.php',
		STAGE1_MSG: 'Sqeeezing Limes...',
		STAGE2_MSG: 'Catching Dodos... '
	},

	//#################################################################
	//# Constructor
	//#################################################################
	_create: function () {
		var oOptions = this.options
		var oElement = this.element

		//check that the options are passed correctly
		if (oOptions.mission == null) $.error('mission is not set')
		if (oOptions.sol == null) $.error('sol is not set')
		if (oOptions.instr == null) $.error('instr is not set')
		if (oOptions.products == null) $.error('products not set')

		//check that necessary libraries are included
		if (!oElement.visible) {
			$.error('visible is missing! check includes')
		}
		if (!$.event.special.inview) {
			$.error('inview class is missing! check includes')
		}

		//check that the element is a div
		var sElementName = oElement.get(0).tagName
		if (sElementName !== 'DIV') $.error('needs a DIV. this element is a: ' + sElementName)

		//clear out the DIV and get it ready for content
		this.initialise()
	},

	//*******************************************************************
	//*
	//*******************************************************************
	initialise: function () {
		var oOptions = this.options
		var oElement = this.element
		var sProduct
		var oThis = this

		//using the query CSS styles
		oElement.uniqueId()
		oElement.empty()
		oElement.addClass('ui-widget-content')

		var oHeader = $('<DIV>', { class: 'ui-widget-header' })
		oHeader.append(oOptions.instr)
		oElement.append(oHeader)

		var oBody = $('<DIV>', { class: 'ui-widget-body' })
		oElement.append(oBody)

		//get the list of products
		var bOtherColour = false
		for (sProduct in oOptions.products) {
			//dont do anything if the queue is stopping
			if (goHighlightQueue.stopping) return

			// Add the product header
			var sColourClass = bOtherColour ? 'highlight_colour1' : 'highlight_colour2'
			var oSpan = $('<SPAN>', { class: 'highlight_product ' + sColourClass })
			oSpan.uniqueId()
			oSpan.append(sProduct)
			oBody.append(oSpan)

			// add a Placeholder
			var oHighlights = $('<SPAN>', { class: 'highlight_body' })
			oHighlights.append(this.consts.STAGE1_MSG)
			oHighlights.attr({ Product: sProduct })
			oBody.append(oHighlights)

			//wait for placeholder to become visible
			oHighlights.on('inview', (e, pb) => oThis.onInView(e.target, pb))
			bOtherColour = !bOtherColour
		}
	},

	//*******************************************************************
	onInView: function (oTarget, pbIsInView) {
		var oThis = this
		//dont do anything if the queue is stopping
		if (goHighlightQueue.stopping) return
		if (!pbIsInView) return

		//turn off the inview listener
		var oSpan = $(oTarget)
		oSpan.off('inview')

		//wait for object to remain visible
		setTimeout(() => oThis.onTimer(oSpan), this.consts.WAIT_VISIBLE)
	},

	//*******************************************************************
	onTimer: function (poSpan) {
		var oThis = this

		//dont do anything if the queue is stopping
		if (goHighlightQueue.stopping) return

		if (!poSpan.visible()) {
			poSpan.on('inview', function (poEvent, pbIsInView) {
				oThis.onInView(pbIsInView)
			})
			return
		}

		//show a spinner
		poSpan.empty()
		var oSpinner = cAppRender.make_spinner(this.consts.STAGE2_MSG)
		poSpan.append(oSpinner)

		//load the highlight information
		this.load_highlights(poSpan)
	},

	//*******************************************************************
	load_highlights: function (poSpan) {
		var oOptions = this.options
		var oThis = this

		var oParams = {}
		oParams[cSpaceBrowser.SOL_QUERYSTRING] = oOptions.sol
		oParams[cSpaceBrowser.INSTR_QUERYSTRING] = oOptions.instr
		oParams[cSpaceBrowser.PRODUCT_QUERYSTRING] = poSpan.attr('product')
		oParams[cSpaceBrowser.OUTPUT_QUERYSTRING] = 'thumbs'
		oParams[cSpaceBrowser.MISSION_QUERYSTRING] = oOptions.mission.ID
		var sUrl = cBrowser.buildUrl(this.consts.HIGHLIGHT_URL, oParams)

		var oItem = new cHttpQueueItem()
		oItem.url = sUrl
		oItem.element = poSpan
		bean.on(oItem, 'result', poHttp => oThis.onHighlightResponse(oItem, poHttp))
		bean.on(oItem, 'error', poHttp => oThis.onHighlightError(oItem, poHttp))
		goHighlightQueue.add(oItem)
	},

	//*******************************************************************
	// eslint-disable-next-line no-unused-vars
	onHighlightError: function (poItem, poHttp) {
		var oSpan = poItem.element
		oSpan.empty()
		var oDiv = $('<DIV>', { class: 'ui-state-error' })
		oDiv.append('Unable to fetch highlights')
		oSpan.append(oDiv)
	},
	//*******************************************************************
	onHighlightResponse: function (poItem, poHttp) {
		var oError, oImg
		var oSpan = poItem.element
		oSpan.empty()

		var aUrls = poHttp.response.u
		var oOptions = this.options

		if (aUrls.length == 0) {
			oError = $('<DIV>', { class: 'ui-state-error' })
			oError.append('no thumbnails found')
			oSpan.append(oError)
		} else {
			var i

			//add allthe found highlights
			for (i = 0; i < aUrls.length; i++) {
				var sImgUrl = oOptions.home + '/' + aUrls[i]
				oImg = $('<IMG>').attr({
					src: sImgUrl,
					class: 'highlight_body image'
				})
				var sProduct = oSpan.attr('product')
				const oThis = this
				oImg.on('click', () => oThis.onImageClick(sProduct))
				oSpan.after(oImg) //append the image
			}

			//and remove the placeholder span
			oSpan.remove()
		}
	},

	//************************************************************* */
	onImageClick: function (psProduct) {
		var oOptions = this.options
		goHighlightQueue.stop()
		this._trigger('onClick', null, {
			s: oOptions.sol,
			i: oOptions.instr,
			p: psProduct
		})
	}
})
