'use strict'

class cAppRender {
	static TAG_PAGE_URL = 'tag.php'
	//****************************************************************
	static make_button(psID, psCaption, psTitle, pbDisabled, pfnOnClick) {
		var oOptions = {
			title: psTitle,
			class: 'w3-button w3-theme-action w3-round w3-padding-small w3-theme-margin-1',
			style: 'display:inline-block'
		}
		if (pbDisabled) oOptions.disabled = 'disabled'
		if (psID) oOptions.id = psID
		var sType = typeof pfnOnClick
		if (sType !== 'function') cDebug.error('not passed in a function: ' + sType)

		var oButton = $('<button>', oOptions)
		{
			var oSpan = $('<span>', {
				style: 'display:flex;align-items:center'
			})
			{
				oSpan.append(psCaption)
				oButton.append(oSpan)
			}
			oButton.on('click', pfnOnClick)
		}
		if (!psID) oButton.uniqueId()
		return oButton
	}

	//****************************************************************
	static create_widget(psTitle) {
		var oWidget, oHeader, oBody
		oWidget = $('<DIV>', { class: 'w3-card w3-theme-widget' })
		{
			oHeader = $('<DIV>', {
				class: 'w3-container w3-theme-widget-header'
			})
			{
				oHeader.append(psTitle)
				oWidget.append(oHeader)
			}

			oBody = $('<DIV>', { class: 'w3-theme-widget-body' })
			oWidget.append(oBody)
			oWidget.body = oBody
		}
		return oWidget
	}

	//****************************************************************
	static update_title(psText) {
		var oDiv = cJquery.element('toptitle')
		oDiv.html(psText)
	}

	//****************************************************************
	static render_tags(poElement, paData) {
		poElement.empty()

		//---------------------------------------------------
		if (paData.d.length == 0) {
			poElement.html('No Tags found, be the first to add one')
		} else {
			var oA, sUrl, sTag
			for (var i = 0; i < paData.d.length; i++) {
				sTag = paData.d[i]

				sUrl = cBrowser.buildUrl(this.TAG_PAGE_URL, { t: sTag })
				oA = $('<A>', {
					target: 'tags',
					href: sUrl,
					class: 'w3-tag w3-theme-tag w3-text-white w3-hover-grey w3-round-xxlarge'
				})
				oA.append(sTag)
				poElement.append(oA)
			}
		}
	}

	//***************************************************************************
	static make_spinner(psCaption) {
		const oDiv = $('<DIV>', {
			class: 'w3-cell-row w3-panel w3-theme w3-leftbar w3-border-blue w3-padding-large'
		})
		{
			const oSpinner = $('<DIV>', {
				class: 'w3-cell',
				style: 'width:100px'
			})
			if (!oSpinner.gSpinner) cDebug.error('gspinner is missing')
			oSpinner.gSpinner({ scale: 0.25 })
			oDiv.append(oSpinner)

			const oText = $('<DIV>', {
				class: 'w3-cell w3-text-white'
			})
			oText.append('<h2>' + psCaption + '</h2>')
			oDiv.append(oText)
		}
		return oDiv
	}

	//***************************************************************************
	static make_note(psCaption) {
		const oDiv = $('<DIV>', {
			class: 'w3-panel w3-theme-l5 w3-leftbar w3-border-blue w3-padding-large'
		})
		oDiv.append('<h3>' + psCaption + '</h3>')
		return oDiv
	}
}

//######################################################################
//#
//######################################################################

class cAppAllSolButtons {
	static targets = [
		{
			page: 'solhigh',
			target: 'allhighs.php',
			caption: 'All Highlights'
		},
		{
			page: 'solcomments',
			target: 'allcomments.php',
			caption: 'All Comments'
		},
		{
			page: 'soltags',
			target: 'alltags.php',
			caption: 'All Tags'
		},
		{ page: 'solgigas', target: 'allgigas.php', caption: 'All Gigapans' }
	]

	//*********************************************************************
	static render_buttons(psID) {
		var oParent = cJquery.element(psID)
		var oThis = this

		var oSpan = $('<span>')
		{
			var aTargets = this.targets
			for (var i = 0; i < aTargets.length; i++) {
				var oTarget = aTargets[i]

				var oButton = cAppRender.make_button(null, oTarget.caption, oTarget.caption, false, e => oThis.onClickButton(e))
				oButton.attr('clicktarget', oTarget.target)
				oSpan.append(oButton)
			}
			oParent.append(oSpan)
		}
	}

	//*********************************************************************
	static onClickButton(poEvent) {
		var oTarget = $(poEvent.target)
		var sTagname = oTarget.get(0).tagName
		if (sTagname !== 'button') oTarget = oTarget.parent()

		var sUrl = oTarget.attr('clicktarget')

		cBrowser.openWindow(sUrl)
	}
}

//######################################################################
//#
//######################################################################
//eslint-disable-next-line no-unused-vars
class cAppSolButtons {
	static current_sol = null

	static render_buttons(psID) {
		var oButton, sSol
		var oParent = cJquery.element(psID)
		oParent.empty()

		//-------------- get the current sol
		sSol = cBrowser.queryString(cSpaceBrowser.SOL_QUERYSTRING)
		if (!sSol) {
			oParent.html('sol missing!')
			return
		}
		var iSol = parseInt(sSol)
		this.current_sol = iSol
		var oThis = this

		//------------render the buttons
		var oSpan = $('<span>')
		{
			//-------------- the buttons
			oButton = cAppRender.make_button(null, '&lt;&lt;&lt;', 'Previous Sol', false, () => oThis.onClickOtherSol(iSol - 1))
			oSpan.append(oButton)

			oButton = cAppRender.make_button(null, 'Sol: ' + sSol, 'Sol details', false, () => oThis.onClickSolDetails())
			oSpan.append(oButton)

			oButton = cAppRender.make_button(null, '&gt;&gt;&gt;', 'Next Sol', false, () => oThis.onClickOtherSol(iSol + 1))
			oSpan.append(oButton)
		}
		oParent.append(oSpan)

		//--------------render the all sol buttons
		oParent.append(cBrowser.whitespace(50))
		cAppAllSolButtons.render_buttons(psID)
	}

	//***************************************************
	static onClickOtherSol(piSol) {
		var sPageUrl = cBrowser.pageUrl()
		var oParams = {}
		oParams[cSpaceBrowser.SOL_QUERYSTRING] = piSol
		var sUrl = cBrowser.buildUrl(sPageUrl, oParams)
		document.location.href = sUrl
	}
	//***************************************************
	static onClickSolDetails() {
		var oParams = {}
		oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.current_sol
		const sUrl = cBrowser.buildUrl('index.php', oParams)
		cBrowser.openWindow(sUrl, 'index')
	}
}
