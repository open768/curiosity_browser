// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.solgigas', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		mission: null,
		sol: null
	},

	//#################################################################
	//# Constructor
	//#################################################################
	_create: function () {
		const oThis = this
		const oOptions = this.options
		const oElement = this.element

		// check for necessary classes
		if (!bean) {
			$.error('bean class is missing! check includes')
		}
		if (!cHttp2) {
			$.error('http2 class is missing! check includes')
		}

		// check that the options are passed correctly
		if (oOptions.mission == null) $.error('mission is not set')
		if (oOptions.sol == null) $.error('sol is not set')
		oElement.uniqueId()

		// check that the element is a div
		const sElementName = oElement.get(0).tagName
		if (sElementName !== 'DIV') {
			$.error('needs a DIV. this element is a: ' + sElementName)
		}

		// clear out the DIV and put some text in it
		oElement.empty()
		var oSpinner = cAppRender.make_spinner('Loading sol gigas')
		oElement.append(oSpinner)

		// get the sols with Tags
		var sUrl = cBrowser.buildUrl(cAppRest.base_url('gigapans.php'), {
			[cSpaceUrlParams.SOL]: oOptions.sol,
			[cAppUrlParams.OPERATION]: 'sol',
			[cSpaceUrlParams.MISSION]: cMission.ID
		})
		const oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onGigaResponse(poHttp))
			oHttp.fetch_json(sUrl)
		}
	},

	//#################################################################
	//# Events
	//#################################################################
	onGigaResponse: function (poHttp) {
		const oElement = this.element
		const aData = poHttp.response

		// --------------------------------------------------------------
		oElement.empty()
		if (aData == null) {
			oElement.append(cAppRender.make_note('Sorry no data was found'))
			return
		}

		// --------------------------------------------------------------
		for (var i = 0; i < aData.length; i++) {
			let aItem = aData[i]
			let sGigaID = aItem.I
			let sIUrl = 'http://static.gigapan.org/gigapans0/' + sGigaID + '/images/' + sGigaID + '-800x279.jpg'
			let sGUrl = 'http://www.gigapan.com/gigapans/' + sGigaID

			let oNewDiv = $('<DIV>', { class: 'ui-widget-header' })
			oA = $('<a>', { target: 'giga', href: sGUrl })
			oA.append(aItem.D)
			oNewDiv.append(oA)
			oElement.append(oNewDiv)

			oNewDiv = $('<DIV>', { class: 'ui-widget-body' })
			var oA = $('<a>', { target: 'giga', href: sGUrl })
			const oImg = $('<img>', { src: sIUrl })
			oA.append(oImg)
			oNewDiv.append(oA)
			oNewDiv.append('<br>')

			oElement.append(oNewDiv)
			oElement.append('<p>')
		}
	}
})
