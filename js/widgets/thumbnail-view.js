/* global cThumbnail */
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class cThumbnailView {
	static widget = null
	static element = null
	static options = {
		ThumbsPerPage: 100,
		sol: null,
		instrument: null,
		onClick: null,
		mission: null
	}
	static REST_URL = cAppRest.base_url('solthumbs.php')

	static init(poWidget) {
		this.widget = poWidget
		this.element = poWidget.element
		this.options = poWidget.options

		this.get_thumbnails()
	}

	//******************************************************************************
	static get_thumbnails() {
		// make a spinner
		const oOptions = this.options
		const oElement = this.element

		oElement.empty()
		var sCaption = 'Loading thumbnails for sol:' + oOptions.sol
		if (oOptions.instrument) sCaption += ', instr: ' + oOptions.instrument
		var oSpinner = cAppRender.make_spinner(sCaption)
		oElement.append(oSpinner)

		// start the normal thumbnail download
		const oThis = this
		this.widget._trigger('onStatus', null, { text: 'loading basic thumbnails' })
		const sUrl = cBrowser.buildUrl(this.REST_URL, {
			[cSpaceUrlParams.SOL]: oOptions.sol,
			[cSpaceUrlParams.INSTRUMENT]: oOptions.instrument,
			[cSpaceUrlParams.MISSION]: oOptions.mission.ID
		})
		const oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onThumbsJS(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}
	//#################################################################
	//# methods
	//#################################################################
	static stop_queue() {
		const oQRunner = cThumbnail.thumbqueue
		oQRunner.stop() // have to use a global otherwise cant reset the queue
	}

	//#################################################################
	//# Events
	//#################################################################
	static onThumbsJS(poHttp) {
		var i, aData, oItem
		const oThis = this
		const oElement = oThis.element

		cDebug.write('got basic thumbnails')
		this.widget._trigger('onStatus', null, { text: 'got basic thumbnails' })
		this.widget._trigger('onBasicThumbnail')

		// ok load the thumbnails
		oElement.empty()

		aData = poHttp.response.d.data
		if (aData.length == 0) {
			oElement.append(cAppRender.append('Sorry no thumbnails found'))
			this.widget._trigger('onStatus', null, { text: 'No thumbnails found' })
		} else {
			const oQRunner = cThumbnail.thumbqueue
			oQRunner.reset() // have to use a global otherwise cant reset the queue

			for (i = 0; i < aData.length; i++) {
				oItem = aData[i]
				const oThumbnailWidget = $('<SPAN>').thumbnail({
					sol: oItem.sol,
					instrument: oItem.instr,
					product: oItem.product,
					url: oItem.image_url,
					mission: oItem.mission,
					onStatus: function (poEvent, poData) {
						oThis.widget._trigger('onStatus', poEvent, poData)
					},
					onClick: function (poEvent, poData) {
						oThis.onThumbClick(poEvent, poData)
					}
				})

				// draw the widget;
				oElement.append(oThumbnailWidget)
			}
		}
	}

	//************************************************************************
	static onThumbClick(poEvent, poData) {
		this.stop_queue()
		this.widget._trigger('onClick', poEvent, poData)
	}
}

$.widget('ck.thumbnailview', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		ThumbsPerPage: 100,
		sol: null,
		instrument: null,
		onClick: null,
		mission: null
	},

	//#################################################################
	//# Constructor
	//#################################################################
	_create: function () {
		// check for necessary classes
		if (!bean) {
			$.error('bean class is missing! check includes')
		}
		if (!cHttp2) {
			$.error('http2 class is missing! check includes')
		}
		if (!this.element.thumbnail) {
			$.error('thumbnail is missing! check includes')
		}
		cDebug.write('creating widget thumbnailview')

		// check that the options are passed correctly
		const oOptions = this.options
		if (oOptions.sol == null) $.error('sol is not set')
		if (oOptions.mission == null) $.error('mission is not set')
		this.element.uniqueId()

		// check that the element is a div
		const sElementName = this.element.get(0).tagName
		if (sElementName !== 'DIV') {
			$.error('thumbnail view needs a DIV. this element is a: ' + sElementName)
		}

		cThumbnailView.init(this)
	}
})
