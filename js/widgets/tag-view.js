/* global goImageQueue */
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.tagview', {
	//#################################################################
	//# Definition
	//#################################################################
	consts: {
		MAX_TRANSFERS: 5,
		MAX_TO_SHOW: 10,
		MAX_TO_SHOW_QS: 'starttag'
	},
	options: {
		tag: null,
		queue: null,
		onStatus: null,
		mission: null
	},

	//#################################################################
	//# Constructor
	//#################################################################
	_create: function () {
		// check that the element is a div
		const oWidget = this
		const oElement = this.element

		// check for necessary classes
		if (!bean) $.error('bean class is missing! check includes')
		if (!cHttp2) $.error('http2 class is missing! check includes')
		if (!cActionQueue) $.error('cActionQueue class is missing! check includes')
		if (this.options.mission == null) $.error('mission is not set')

		// make sure this is a DIV
		const sElementName = oElement.get(0).tagName
		if (sElementName !== 'DIV') {
			$.error('thumbnail view needs a DIV. this element is a: ' + sElementName)
		}
		oElement.uniqueId()

		// check that the options are passed correctly
		const sTag = this.options.tag
		if (sTag == null) $.error('tag is not set')

		// clear out the DIV and put some text in it
		oElement.empty()
		var oSpinner = cAppRender.make_spinner('Loading Images for tag: ' + sTag)
		oElement.append(oSpinner)

		const oHttp = new cHttp2()
		{
			const sUrl = cBrowser.buildUrl(cAppRest.base_url('tag.php'), {
				t: sTag,
				o: 'detail',
				m: this.options.mission.ID
			})

			bean.on(oHttp, 'result', poHttp => oWidget.onTagUsage(poHttp))
			bean.on(oHttp, 'error', poHttp => oWidget.onError(poHttp))
			oHttp.fetch_json(sUrl, oElement)
		}
	},

	//#################################################################
	//# Events
	//#################################################################
	onTagUsage: function (poHttp) {
		var i, sItem, aParts
		const aData = poHttp.response
		const oWidget = this
		const oElement = this.element

		oElement.empty()
		if (!aData) {
			oElement.append("<span class='subtitle'>This tag is not known</span>")
			return
		}

		// remove duplicates from list
		const aList = []
		for (i = 0; i < aData.length; i++) {
			sItem = aData[i]
			if (aList.indexOf(sItem) == -1) {
				aList.push(sItem)
			}
		}
		aList.sort()

		// create image
		for (i = 0; i < aList.length; i++) {
			sItem = aList[i]
			aParts = sItem.split('/') //really why did i think this was a good idea?? @todo
			cDebug.write('got a detail: ' + sItem)

			const oDiv = $('<DIV>')
			oDiv.instrumentimage({
				// shouldnt have to pass a src or date attribute
				sol: aParts[0],
				instrument: aParts[1],
				product: aParts[2],
				mission: this.options.mission,
				onClick: function (poEvent, poData) {
					oWidget.onClick(poEvent, poData)
				},
				onStatus: function (poEvent, paData) {
					oWidget._trigger('onStatus', poEvent, paData)
				}
			})
			oElement.append(oDiv)
			oElement.append('<P>')
		}
	},

	//***************************************************************
	onClick: function (poEvent, poData) {
		goImageQueue.stop()
		this._trigger('onClick', poEvent, poData)
	}
})
