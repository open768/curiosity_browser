'use strict'

//TODO make this into a widget

//eslint-disable-next-line no-unused-vars
class cSolGridRenderer {
	mission = null
	onClickUrl = null
	element = null
	DataRestUrl = null
	solsUrl = null
	solData = null

	//*********************************************************************
	constructor(psMissionID, poElement, psDataRestUrl, psOnClickUrl) {
		this.mission = psMissionID
		this.onClickUrl = psOnClickUrl
		this.element = poElement
		this.DataRestUrl = cAppLocations.rest + '/' + psDataRestUrl
		this.solsUrl = cAppLocations.rest + '/sols.php'

		// check for necessary classes
		if (!bean) {
			$.error('bean class is missing! check includes')
		}
		if (!cHttp2) {
			$.error('http2 class is missing! check includes')
		}
	}

	//*********************************************************************
	show_sol_grid(poExtraParams) {
		var oElement = this.element

		// check that the element is a div
		const sElementName = oElement.get(0).tagName
		if (sElementName !== 'DIV') {
			$.error('needs a DIV. this element is a: ' + sElementName)
		}

		// check that the options are passed correctly
		if (this.mission == null) $.error('mission is not set')

		//update status
		oElement.uniqueId()
		oElement.empty()
		const oLoader = cAppRender.make_spinner('Loading sol tags')
		oElement.append(oLoader)

		//send request to get the data
		var oThis = this
		var oOptions = { m: this.mission }
		if (poExtraParams) Object.assign(oOptions, poExtraParams)
		var sUrl = cBrowser.buildUrl(this.DataRestUrl, oOptions)
		const oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onDataResponse(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}

	//*********************************************************************
	onDataResponse(poHttp) {
		const oElement = this.element

		this.solData = poHttp.response

		if (this.solData === null) {
			oElement.empty()
			oElement.append(cAppRender.make_note('No data found'))
		} else {
			//fetch a list of all the sols, so that the sols with Tags can be overlaid
			oElement.empty()
			const oSpinner = cAppRender.make_spinner('Loading Sols')
			oElement.append(oSpinner)

			const sUrl = cBrowser.buildUrl(this.solsUrl, { m: this.mission })
			const oHttp = new cHttp2()
			{
				bean.on(oHttp, 'result', poHttp => this.onSolsResponse(poHttp))
				oHttp.fetch_json(sUrl)
			}
		}
	}

	//*********************************************************************
	onSolsResponse(poHttp) {
		var aSols = poHttp.response

		var oElement = this.element
		oElement.empty()
		var sSol, i

		//iterate all sols
		for (i = 0; i < aSols.length; i++) {
			//iterate each sol
			sSol = aSols[i].sol.toString()
			const oDiv = $('<DIV>', { class: 'solbuttonDiv' }) //container for each button

			if (this.solData[sSol]) {
				//does sol have data?
				const oButton = $('<button>', {
					class: 'w3-button w3-blue w3-padding-small',
					sol: sSol
				}).append(sSol)
				oButton.click(poEvent => this.onButtonClick(poEvent))
				oDiv.append(oButton)
			} else {
				//no data for the sol, link back to the index page for the sol
				const sUrl = cBrowser.buildUrl('index.php', { s: sSol })
				const oA = $('<a>', { href: sUrl, class: 'sollink' }).append(sSol)
				oDiv.append(oA)
			}

			oElement.append(oDiv)
		}
	}

	//*********************************************************************
	onButtonClick(poEvent) {
		const oButton = $(poEvent.target)
		const sSol = oButton.attr('sol')
		const sUrl = cBrowser.buildUrl(this.onClickUrl, { s: sSol })
		cBrowser.openWindow(sUrl, 'clicked')
	}
}
