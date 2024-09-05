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

		const sUrl = cBrowser.buildUrl(cAppLocations.rest + '/cal.php', {
			s: oOptions.sol,
			m: oOptions.mission.ID
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

		var oContainer = $('<div>', { class: 'w3-card' })
		{
			var oHeader = $('<header>', { class: 'w3-container w3-theme-d1' })
			{
				oHeader.append('<b>legend</b>')
				oContainer.append(oHeader)
			}
			var oBody = $('<DIV>', { class: 'w3-container' })
			{
				for (var i = 0; i < paInstr.length; i++) {
					const oInstr = paInstr[i]
					const oOuterSpan = $('<span>').attr({ class: 'greybox' })
					{
						oOuterSpan.append(oInstr.name).append('&nbsp;')
						const oInnerSpan = $('<span>').attr({
							style: 'background-color:' + oInstr.colour
						})
						oInnerSpan.append(cBrowser.whitespace(100))
						oOuterSpan.append(oInnerSpan)
					}
					oBody.append(oOuterSpan)
					oColours[oInstr.abbr] = oInstr.colour
				}
				oContainer.append(oBody)
			}
			oElement.append(oContainer)
		}

		return oColours
	}

	//***************************************************************
	static prv__build_cal_part(paDates, poColours) {
		var i, oTable, oRow, oCell
		const oElement = this.element

		const aHeadings = this.prv__get_Headings(paDates)
		const aTimes = this.prv__get_Times(paDates)

		const oDiv = $('<DIV>', { class: 'ui-widget-body' })
		oTable = $('<TABLE>', { class: 'cal' })
		oDiv.append(oTable)
		oElement.append(oDiv)

		// header row of table
		oRow = $('<TR>')
		oRow.append($('<TD>'))
		for (i = 0; i < aHeadings.length; i++) {
			oCell = $('<TH>')
				.attr({ class: 'caldate' })
				.append('UTC:' + aHeadings[i])
			oRow.append(oCell)
		}
		oTable.append(oRow)

		// now the calendar entries
		for (i = 0; i < aTimes.length; i++) {
			const sTime = aTimes[i]
			oRow = this.prv_renderRow(sTime, aHeadings, paDates, poColours)
			oTable.append(oRow)
		}
	}

	//***************************************************************
	static prv_renderRow(psTime, paHeadings, paDates, poColours) {
		var i, oRow, oCell
		var oDate, sDate, aItems

		oRow = $('<tr>', { class: 'caltime' })

		oCell = $('<th>').append(psTime)
		oRow.append(oCell)

		for (i = 0; i < paHeadings.length; i++) {
			sDate = paHeadings[i]
			oCell = $('<td>')
			oRow.append(oCell)

			oDate = paDates[sDate]
			//eslint-disable-next-line no-prototype-builtins
			if (oDate.hasOwnProperty(psTime)) {
				aItems = oDate[psTime]
				this.prv_render_items(oCell, aItems, poColours)
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
				class: 'calbutton roundbutton',
				style: sStyle,
				i: oItem.i,
				p: oItem.p,
				title: oItem.i + ',' + oItem.p
			})
			oButton.append('&nbsp;')
			oButton.click(e => oThis.onButtonClick(e))

			poCell.append(oButton)
		}
	}

	//#################################################################
	//# Events
	//#################################################################
	static onButtonClick(poEvent) {
		const oOptions = this.options
		const oItem = $(poEvent.target)

		const oParams = {
			s: oOptions.sol,
			i: oItem.attr('i'),
			p: oItem.attr('p'),
			m: oOptions.mission.ID
		}
		const sUrl = cBrowser.buildUrl('detail.php', oParams)
		document.open(sUrl, 'detail')
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

		this.prv__build_cal_part(aDates, oColours)
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
