'use strict'

//TODO make this into a widget
/* global cAppAllSolButtons */

//eslint-disable-next-line no-unused-vars
class cSolGridRenderer {
	mission = null
	onClickUrl = null
	element = null
	DataRestUrl = null
	solsUrl = null
	solData = null
	caption = null

	//*********************************************************************
	constructor(psMissionID, poElement, psCaption, psDataRestUrl, psOnClickUrl) {
		this.mission = psMissionID
		this.onClickUrl = psOnClickUrl
		this.element = poElement
		this.DataRestUrl = cAppRest.base_url(psDataRestUrl)
		this.solsUrl = cAppRest.base_url('sols.php')
		this.caption = psCaption

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

		//SPINNER
		oElement.uniqueId()
		oElement.empty()
		const oLoader = cAppRender.make_spinner('Loading sol tags')
		oElement.append(oLoader)

		//send request to get the data
		const oThis = this
		var oOptions = { [cSpaceUrlParams.MISSION]: this.mission }
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

			const sUrl = cBrowser.buildUrl(this.solsUrl, { [cSpaceUrlParams.MISSION]: this.mission })
			const oHttp = new cHttp2()
			{
				const oThis = this
				bean.on(oHttp, 'result', poHttp => oThis.onSolsResponse(poHttp))
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

		//---------------------all sol buttons
		const oButtonDiv = $('<div>', { class: 'w3-panel w3-theme-d2' })
		{
			cAppAllSolButtons.render_buttons(oButtonDiv)
			oElement.append(oButtonDiv)
		}

		//---------------------helpful note
		var oContextDiv = cAppRender.make_note(
			'This grid shows all the sols (Martian days) that the rover has been on Mars. The blue buttons show where there is ' + this.caption + ' data'
		)
		oElement.append(oContextDiv)

		//---------------------the data
		const oDataDiv = $('<DIV>', { class: 'w3-panel' })
		{
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
					const oThis = this
					oButton.on('click', poEvent => oThis.onButtonClick(poEvent))
					oDiv.append(oButton)
				} else {
					//no data for the sol, link back to the index page for the sol
					const sUrl = cBrowser.buildUrl('index.php', { [cSpaceUrlParams.SOL]: sSol })
					const oA = $('<a>', { href: sUrl, class: 'sollink' }).append(sSol)
					oDiv.append(oA)
				}

				oDataDiv.append(oDiv)
			}
			oElement.append(oDataDiv)
		}
	}

	//*********************************************************************
	onButtonClick(poEvent) {
		const oButton = $(poEvent.target)
		const sSol = oButton.attr('sol')
		const sUrl = cBrowser.buildUrl(this.onClickUrl, { [cSpaceUrlParams.SOL]: sSol })
		cBrowser.openWindow(sUrl, 'clicked')
	}
}
