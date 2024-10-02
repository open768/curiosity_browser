var goHighlightQueue = new cHttpQueue()

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class ckSolHighlights {
	widget = null
	element = null
	options = {
		mission: null,
		sol: null,
		home: null,
		onStatus: null,
		onClick: null
	}

	//**************************************************************
	constructor(poWidget) {
		this.widget = poWidget
		this.options = poWidget.options
		this.element = poWidget.element
	}

	//**************************************************************
	init() {
		const oElement = this.element

		//clear out the DIV and put some text in it
		oElement.empty()
		var oSpinner = cAppRender.make_spinner('taming velociraptors ....')
		oElement.append(oSpinner)

		//ok get the data
		this.pr__get_sol_highlights()
	}
	//***************************************************************************
	pr__get_sol_highlights() {
		var oParams = {}
		var oThis = this

		this.widget._trigger('onStatus', null, { text: 'fetching highlights' })

		oParams[cSpaceUrlParams.SOL] = this.options.sol

		var oHttp = new cHttp2()
		{
			if (cBrowser.data[cAppUrlParams.MOSAIC_PARAM] != null) {
				oParams[cAppUrlParams.OPERATION] = 'mosaic'
				bean.on(oHttp, 'result', poHttp => oThis.onMosaicResponse(poHttp))
			} else {
				oParams[cAppUrlParams.OPERATION] = 'soldata'
				bean.on(oHttp, 'result', poHttp => oThis.onSheetResponse(poHttp))
			}

			var sUrl = cBrowser.buildUrl(cAppLocations.rest + '/img_highlight.php', oParams)
			oHttp.fetch_json(sUrl)
		}
	}

	//***************************************************************************
	onMosaicResponse(poHttp) {
		var oElement = this.element

		oElement.empty()
		var oData = poHttp.response

		if (oData.u == null) oElement.append(cAppRender.make_note('Sorry no Mosaic found'))
		else {
			var oImg = $('<IMG>').attr({ src: oData.u })
			oElement.append(oImg)
		}
		this.widget._trigger('onStatus', null, { text: 'ok' })
	}

	//***************************************************************************
	onSheetResponse(poHttp) {
		var oElement = this.element
		var oThis = this
		var oDiv

		//-----------------------------------------------------------------
		this.widget._trigger('onStatus', null, { text: 'got some data.. processing' })
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
					oThis.widget._trigger('onClick', null, poData)
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
}

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

		const oInstance = new ckSolHighlights(this)
		oInstance.init()
	}
})

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//% Definition
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
/* global cQueueRunner */
class cHighlightbox {
	top = -1
	left = -1
	instrument = 'not set'
	product = 'not set'
	imgUrl = 'not set'
	imgID = 'not set'
}

class cInstrHighlight {
	static delay = 250
	static {
		this.imgqueue = new cQueueRunner(this.delay) //has to be static as shared by mutliple instruments?
	}
	options = {
		mission: null,
		sol: null,
		instr: null,
		products: null,
		onClick: null
	}
	WAIT_VISIBLE = 750
	HIGHLIGHT_URL = 'not set'
	STAGE1_MSG = 'Sqeeezing Limes...'
	STAGE2_MSG = 'Catching Dodos... '

	constructor(poWidget) {
		this.widget = poWidget
		this.options = poWidget.options
		this.element = poWidget.element
		this.HIGHLIGHT_URL = cAppLocations.rest + '/img_highlight.php'
	}

	init() {
		var oOptions = this.options
		var oElement = this.element
		var sProduct
		var oThis = this

		//using the query CSS styles
		oElement.uniqueId()
		oElement.empty()

		//subscribe to the queue
		const oQueue = cInstrHighlight.imgqueue
		bean.on(oQueue, cQueueRunner.EVENT_STEP, poData => oThis.onQueueEvent(poData))

		//render
		oElement.addClass('w3-card')

		var oHeader = $('<Header>', { class: 'w3-container w3-theme-d3' })
		oHeader.append(oOptions.instr)
		oElement.append(oHeader)

		var oBody = $('<div>', { class: 'w3-container w3-theme-l4 w3-padding-16' })
		{
			//get the list of products
			var bOtherColour = false
			for (sProduct in oOptions.products) {
				//dont do anything if the queue is stopping
				if (goHighlightQueue.stopping) return

				// Add the product header
				var sColourClass = bOtherColour ? 'highlight_colour1' : 'highlight_colour2'
				var oContainer = $('<DIV>', { class: 'highlight_container ' + sColourClass })
				{
					var oSpan = $('<DIV>', { class: 'highlight_product' })
					{
						oSpan.append(sProduct)
						oContainer.append(oSpan)
					}

					// add a Placeholder
					const sBodyID = cJquery.child_ID(oElement, sProduct)
					var oHighlights = $('<DIV>', { class: 'highlight_body', id: sBodyID })
					{
						oHighlights.append(this.STAGE1_MSG)
						oHighlights.attr({ Product: sProduct })
						oContainer.append(oHighlights)
					}
					oBody.append(oContainer)
				}
				oBody.append(' ')

				//wait for placeholder to become visible
				oHighlights.on('inview', (e, pb) => oThis.onInView(e.target, pb))
				bOtherColour = !bOtherColour
			}
			oElement.append(oBody)
		}
	}

	//**************************************************************************
	onInView(poTarget, pbIsInView) {
		var oThis = this
		//dont do anything if the queue is stopping
		if (goHighlightQueue.stopping) return
		if (!pbIsInView) return

		//turn off the inview listener
		var oSpan = $(poTarget)
		oSpan.off('inview')

		//wait for object to remain visible
		setTimeout(() => oThis.onTimer(oSpan), this.WAIT_VISIBLE)
	}

	//*******************************************************************
	onTimer(poSpan) {
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
		var oSpinner = cAppRender.make_spinner(this.STAGE2_MSG)
		poSpan.append(oSpinner)

		//load the highlight information
		this.load_highlights(poSpan)
	}

	//*******************************************************************
	load_highlights(poSpan) {
		var oOptions = this.options
		var oThis = this

		var oParams = {}
		{
			oParams[cSpaceUrlParams.SOL] = oOptions.sol
			oParams[cSpaceUrlParams.INSTRUMENT] = oOptions.instr
			oParams[cSpaceUrlParams.PRODUCT] = poSpan.attr('product')
			oParams[cAppUrlParams.OPERATION] = 'getcropdata'
			oParams[cSpaceUrlParams.MISSION] = oOptions.mission.ID
		}
		var sUrl = cBrowser.buildUrl(this.HIGHLIGHT_URL, oParams)

		var oItem = new cHttpQueueItem()
		{
			oItem.url = sUrl
			oItem.element = poSpan
			bean.on(oItem, 'result', poHttp => oThis.onHighlightResponse(poHttp))
			bean.on(oItem, 'error', poHttp => oThis.onHighlightError(poHttp))
			goHighlightQueue.add(oItem)
		}
	}

	//*******************************************************************
	// eslint-disable-next-line no-unused-vars
	onHighlightError(poHttp) {
		const oElement = this.element
		oElement.empty()
		var oDiv = $('<DIV>', { class: 'ui-state-error' })
		{
			oDiv.append('Unable to fetch highlights')
			oElement.append(oDiv)
		}
	}

	//*******************************************************************
	onHighlightResponse(poHttp) {
		var oError, oImg
		var oElement = this.element

		const aData = poHttp.response
		const aHighData = aData.d
		const sProduct = aData[cSpaceUrlParams.PRODUCT]
		const sInstr = aData[cSpaceUrlParams.INSTRUMENT]
		const oThis = this

		const oBodyDiv = cJquery.get_child(oElement, sProduct)
		oBodyDiv.empty()

		if (aHighData.length == 0) {
			oError = $('<DIV>', { class: 'ui-state-error' })
			oError.append('no thumbnails found')
			oBodyDiv.append(oError)
		} else {
			//add allthe found highlights

			for (var iBox = 0; iBox < aHighData.length; iBox++) {
				//- - - - - - - - get the data from the response
				const oBox = aHighData[iBox]
				var sTop = oBox[cAppUrlParams.HIGHLIGHT_TOP]
				sTop = sTop.slice(0, -2)

				var sLeft = oBox[cAppUrlParams.HIGHLIGHT_LEFT]
				sLeft = sLeft.slice(0, -2)

				const sImgID = 'img' + sProduct + '_' + sTop + '_' + sLeft
				const oData = new cHighlightbox()
				{
					oData.top = sTop
					oData.left = sLeft
					oData.product = sProduct
					oData.instrument = sInstr
					oData.imgUrl = aData[cAppUrlParams.URL]
					oData.imgID = sImgID
				}

				//- - - - - - - - add a placeholder
				oImg = $('<IMG>').attr({
					src: cAppConsts.CK_IMAGE,
					class: 'image',
					title: sProduct,
					id: sImgID
				})
				oBodyDiv.append(oImg) //append the image

				//- - - - - - - let the dfault image load
				setTimeout(() => oThis.onCKImageTimerEvent(oData), 100)
			}
		}
	}

	onCKImageTimerEvent(poData) {
		const oQueue = cInstrHighlight.imgqueue
		oQueue.queue.push(null, poData)
		if (!oQueue.running) oQueue.start()
	}

	//************************************************************* */
	onQueueEvent(poData) {
		var aParams = {}
		{
			aParams[cAppUrlParams.URL] = poData.imgUrl
			aParams[cAppUrlParams.HIGHLIGHT_WIDTH] = cAppConsts.CROP_WIDTH
			aParams[cAppUrlParams.HIGHLIGHT_HEIGHT] = cAppConsts.CROP_HEIGHT
			aParams[cAppUrlParams.HIGHLIGHT_TOP] = poData.top
			aParams[cAppUrlParams.HIGHLIGHT_LEFT] = poData.left
		}
		var sCropperUrl = cBrowser.buildUrl(cAppLocations.cropper, aParams)

		const oThis = this
		const oImg = cJquery.element(poData.imgID)
		oImg.attr('src', sCropperUrl)

		oImg.on('click', () => oThis.onImageClick(poData))
	}

	//************************************************************* */
	onImageClick(poData) {
		var oOptions = this.options
		goHighlightQueue.stop()
		this.widget._trigger('onClick', null, {
			s: oOptions.sol,
			i: poData.instrument,
			p: poData.product
		})
	}
}

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
		const oInstance = new cInstrHighlight(this)
		oInstance.init()
	}
})
