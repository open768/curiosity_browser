//####################################################################
//####################################################################
class cTagCloud {
	static element = null
	static options = null
	static WIDTH = 250
	static TAG_CHILD_ID = 'tci'

	//****************************************************************
	static init(poWidget) {
		this.element = poWidget.element
		this.options = poWidget.options

		this.render()
	}

	//****************************************************************
	static render() {
		var oElement = this.element
		const oThis = this

		//------- check that the element is a div
		const sElementName = oElement.get(0).tagName
		if (sElementName !== 'DIV') {
			$.error('thumbnail view needs a DIV. not a: ' + sElementName)
		}

		//------------ initialise
		oElement.uniqueId()
		oElement.css('width', this.WIDTH)
		oElement.addClass('w3-theme-l5')
		oElement.empty()

		//------------clear out the DIV and put some text in it
		var oDiv = $('<header>', { class: 'w3-theme-d3' })
		{
			oDiv.width('100%')
			oDiv.append('<h3>Tag Cloud</h3>')
			oElement.append(oDiv)
		}

		var sID = cJquery.child_ID(oElement, this.TAG_CHILD_ID)
		oDiv = $('<DIV>', { id: sID })
		{
			oDiv.width('100%')
			oDiv.uniqueId()
			oDiv.append('doing nuthing')
			oElement.append(oDiv)
		}

		//---------only do something when the div is visible
		oDiv.on('inview', () => oThis.onInView())
	}

	//****************************************************************
	static onResponse(poHttp) {
		var sKey, iCount, iSize, iWeight, iMax, fsRatio, fwRatio
		var oA, sUrl

		//-------------------------------
		var oParent = this.element
		var sID = cJquery.child_ID(oParent, this.TAG_CHILD_ID)
		var oElement = cJquery.element(sID)
		oElement.empty()

		//-------------------------------
		const oData = poHttp.response

		iMax = 0
		for (sKey in oData) {
			iMax = Math.max(iMax, oData[sKey])
		}
		fsRatio = (this.options.maxFont - this.options.minFont) / iMax
		fwRatio = 800 / iMax

		for (sKey in oData) {
			iCount = oData[sKey]
			iSize = this.options.minFont + iCount * fsRatio
			iWeight = 100 + Math.round(iCount * fwRatio)

			sUrl = cBrowser.buildUrl('tag.php', { t: sKey })
			oA = $('<A>', { href: sUrl })
				.css('font-size', '' + iSize + 'px')
				.css('font-weight', iWeight)
				.append(sKey)
			oElement.append(oA).append(' ')
		}
	}

	//****************************************************************
	static onError() {
		const oElement = this.element
		oElement.empty()
		oElement.html('There was an error getting the tagcloud')
	}

	//****************************************************************
	static onInView() {
		const oThis = this
		var oElement = this.element
		oElement.off('inview') // turn off the inview listener

		var oTagElement = cJquery.get_child(oElement, this.TAG_CHILD_ID)
		var oSpinner = cAppRender.make_spinner('loading Tags')
		oTagElement.append(oSpinner)

		const sUrl = cBrowser.buildUrl(cAppRest.base_url('tag.php'), {
			[cAppUrlParams.OPERATION]: 'all',
			[cSpaceUrlParams.MISSION]: this.options.mission.ID
		})
		const oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onResponse(poHttp))
			bean.on(oHttp, 'error', poHttp => oThis.onError(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}
}

//###################################################################
$.widget('ck.tagcloud', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		mission: null,
		maxFont: 24,
		minFont: 10,
		minWidth: '200px'
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
		if (this.options.mission == null) $.error('mission is not set')
		if (!$.event.special.inview) $.error('jquery inview is missing')

		cTagCloud.init(this)
	}
})
