/*global cCalendar */
class cSolCalendar {
	options = null
	element = null
	widget = null

	//**************************************************************
	//**************************************************************
	static init(poWidget) {
		this.widget = poWidget
		this.options = poWidget.options
		this.element = poWidget.element
		this.prv__getData()
	}

	//**************************************************************
	//**************************************************************
	//#################################################################
	//# Private
	//#################################################################
	static prv__getData() {
		const oThis = this
		const oElement = this.element
		const oOptions = this.options

		// clear out the DIV and put some text in it
		oElement.empty()
		var oSpinner = cAppRender.make_spinner('Loading calendar for sol: ' + oOptions.sol)
		oElement.append(oSpinner)

		const sUrl = cBrowser.buildUrl(cAppRest.base_url('cal.php'), {
			[cSpaceUrlParams.SOL]: oOptions.sol,
			[cSpaceUrlParams.MISSION]: oOptions.mission.ID
		})
		const oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onCalResponse(poHttp))
			bean.on(oHttp, 'error', poHttp => oThis.onError(poHttp))
			oHttp.fetch_json(sUrl, oElement)
		}
	}

	//***************************************************************
	static prv__get_Headings(paDates) {
		const aHeadings = Array()
		var sDateKey

		for (sDateKey in paDates) {
			aHeadings.push(sDateKey)
		}
		return aHeadings
	}

	//***************************************************************
	static prv__get_Times(paDates) {
		var sDate, sTime
		const aTimes = Array()

		for (sDate in paDates) {
			for (sTime in paDates[sDate]) {
				if (aTimes.indexOf(sTime) == -1) {
					aTimes.push(sTime)
				}
			}
		}
		aTimes.sort()

		return aTimes
	}

	//#################################################################
	//# render functions
	//#################################################################
	static pr_render_legend(paInstr) {
		const oElement = this.element
		const oColours = {}
		const oOptions = this.options
		const oThis = this

		var oContainer = $('<div>', { class: 'w3-card' })
		{
			var oHeader = $('<header>', { class: 'w3-container w3-theme-d1' })
			{
				oHeader.append('<b>legend</b>')
				oContainer.append(oHeader)
			}
			var oBody = $('<DIV>', { class: 'w3-container w3-theme-l5' })
			{
				for (var i = 0; i < paInstr.length; i++) {
					const oInstr = paInstr[i]
					const oOuterSpan = $('<div>', {
						class: 'w3-tag w3-white w3-round-large w3-border legend_outer w3-hover-grey',
						[cSpaceUrlParams.INSTRUMENT]: oInstr.name,
						[cSpaceUrlParams.SOL]: oOptions.sol
					})
					{
						const oNameDiv = $('<div>', { class: 'legend_tag' })
						{
							oNameDiv.append(oInstr.name)
							oOuterSpan.append(oNameDiv)
						}

						const oColorDiv = $('<div>', { class: 'legend_line' })
						{
							oColorDiv.css('background-color', oInstr.colour)
							oOuterSpan.append(oColorDiv)
						}
						oBody.append(oOuterSpan)
						oOuterSpan.on('click', e => oThis.onLegendClick(e))
					}
					oColours[oInstr.abbr] = oInstr.colour
				}
				oContainer.append(oBody)
			}
			oElement.append(oContainer)
		}

		return oColours
	}

	//***************************************************************
	static pr_render_calendar(paDates, poColours) {
		var i, oTable, oRow, oCell
		const oElement = this.element

		const aHeadings = this.prv__get_Headings(paDates)
		const aTimes = this.prv__get_Times(paDates)

		const oDiv = $('<DIV>', { class: 'w3-panel' })
		{
			oTable = $('<TABLE>', { border: 1, cellspacing: 0, cellpadding: 4 })
			{
				// header row of table
				oRow = $('<TR>')
				{
					//------empty column for dates
					oRow.append($('<TD>', { class: 'w3-light-grey' }))

					//------empty column for dates
					for (i = 0; i < aHeadings.length; i++) {
						oCell = $('<TH>')
							.attr({ class: 'caldate' })
							.append('UTC:' + aHeadings[i])
						oRow.append(oCell)
					}
					oTable.append(oRow)
				}

				// now the calendar entries
				for (i = 0; i < aTimes.length; i++) {
					const sTime = aTimes[i]
					oRow = this.prv_renderRow(sTime, aHeadings, paDates, poColours)
					oTable.append(oRow)
				}
				oDiv.append(oTable)
			}
			oElement.append(oDiv)
		}
	}

	//***************************************************************
	static prv_renderRow(psTime, paHeadings, paDates, poColours) {
		var i, oRow, oCell
		var oDate, sDate, aItems

		oRow = $('<tr>', { class: 'caltime' })
		{
			//-----time
			oCell = $('<th>').append(psTime)
			oRow.append(oCell)

			//------buttons
			for (i = 0; i < paHeadings.length; i++) {
				sDate = paHeadings[i]
				oCell = $('<td>')
				{
					oDate = paDates[sDate]
					//eslint-disable-next-line no-prototype-builtins
					if (oDate.hasOwnProperty(psTime)) {
						aItems = oDate[psTime]
						this.prv_render_items(oCell, aItems, poColours)
					}
					oRow.append(oCell)
				}
			}
		}

		return oRow
	}

	//***************************************************************
	static prv_render_items(poCell, paItems, poColours) {
		var i, oItem, oButton, sColour, sStyle
		const oThis = this

		for (i = 0; i < paItems.length; i++) {
			oItem = paItems[i]
			sColour = poColours[oItem.i]
			sStyle = 'background-color:' + sColour
			if (oItem.d === cCalendar.current_date) {
				sStyle += ';border:4px double black'
			}

			oButton = $('<button>', {
				class: 'roundbutton w3-hover-grey',
				style: sStyle,
				[cSpaceUrlParams.INSTRUMENT]: oItem.i,
				[cSpaceUrlParams.PRODUCT]: oItem.p,
				title: 'instrument:' + oItem.i + '\nproduct:' + oItem.p
			})
			oButton.append('&nbsp;')
			oButton.on('click', e => oThis.onButtonClick(e))

			poCell.append(oButton)
		}
	}

	//#################################################################
	//# Events
	//#################################################################
	static onButtonClick(poEvent) {
		const oOptions = this.options
		const oButton = $(poEvent.target)

		const oParams = {
			[cSpaceUrlParams.SOL]: oOptions.sol,
			[cSpaceUrlParams.INSTRUMENT]: oButton.attr('i'),
			[cSpaceUrlParams.PRODUCT]: oButton.attr('p'),
			[cSpaceUrlParams.MISSION]: oOptions.mission.ID
		}
		const sUrl = cBrowser.buildUrl('detail.php', oParams)
		cBrowser.openWindow(sUrl, 'detail')
	}

	//***************************************************************
	static onLegendClick(poEvent) {
		var oEl = $(poEvent.target)
		const oOptions = this.options
		var sInstr = oEl.attr('i')
		if (sInstr == null) {
			oEl = oEl.parent('[i]')
			sInstr = oEl.attr('i')
		}

		const oParams = {
			[cSpaceUrlParams.SOL]: oOptions.sol,
			[cSpaceUrlParams.INSTRUMENT]: sInstr,
			[cSpaceUrlParams.MISSION]: oOptions.mission.ID,
			b: 1,
			t: 1
		}
		const sUrl = cBrowser.buildUrl('index.php', oParams)
		cBrowser.openWindow(sUrl, 'index')
	}

	//***************************************************************
	static onError() {
		const oElement = this.element

		oElement.empty()
		oElement.append(cAppRender.make_note('Sorry no data was found'))
	}

	//***************************************************************
	static onCalResponse(poHttp) {
		const oElement = this.element

		const oData = poHttp.response
		const aDates = oData.cal
		const aInstr = oData.instr

		oElement.empty()
		const oColours = this.pr_render_legend(aInstr)

		this.pr_render_calendar(aDates, oColours)
	}
}

$.widget('ck.solcalendar', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		mission: null,
		sol: null,
		onLoadedCal: null,
		onClick: null
	},

	//#################################################################
	//# Constructor
	//#################################################################
	_create() {
		const oOptions = this.options
		const oElement = this.element

		// check for necessary classes
		if (!bean) $.error('bean class is missing! check includes')
		if (!cHttp2) $.error('http2 class is missing! check includes')
		if (oOptions.mission == null) $.error('mission is not set')
		if (oOptions.sol == null) $.error('sol is not set')

		// make sure this is a DIV
		const sElementName = oElement.get(0).tagName
		if (sElementName !== 'DIV') {
			$.error('calendar view needs a DIV. this element is a: ' + sElementName)
		}
		oElement.uniqueId()

		cSolCalendar.init(this)
	}
})
