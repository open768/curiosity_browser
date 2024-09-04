/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict'

/*global cAppSolButtons,cSolHighPageConstants*/
//eslint-disable-next-line no-unused-vars
class cSolHighs {
	static is_mosaic = false
	static current_sol = null

	//###############################################################
	//# Entry point
	//###############################################################
	static onLoadJQuery() {
		this.current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]
		if (this.current_sol == null) {
			var oSolHighDiv = cJquery.element(cSolHighPageConstants.HIGHLIGHTS_ID)
			oSolHighDiv.append('no SOL provided!!!!')
			return
		}

		// change status of checkbox
		var oElMosaic = cJquery.element(cSolHighPageConstants.CHK_MOSAIC_ID)
		if (cBrowser.data[cSpaceBrowser.MOSAIC_QUERYSTRING] != null) oElMosaic.prop('checked', true)
		oElMosaic.on('change', () => this.onCheckMosaic())

		this.set_browser_url()

		const oDiv = cJquery.element(cSolHighPageConstants.SOL_BUTTONS_ID)
		cAppSolButtons.render_buttons(oDiv)
		this.render_highlights()
	}

	//###############################################################
	//# Utility functions
	//###############################################################
	static render_highlights() {
		var oDiv = cJquery.element(cSolHighPageConstants.HIGHLIGHTS_ID)

		//delete existing widget
		const oWidget = oDiv.data('ckSolhighlights') // capitalise the first letter of the widget
		if (oWidget) oWidget.destroy()

		//render widget
		oDiv.solhighlights({
			sol: this.current_sol,
			mission: cMission,
			home: cAppLocations.home,
			onStatus: (poEvent, poData) => this.onStatusEvent(poEvent, poData),
			onClick: (poEvent, poData) => this.onHighlightClick(poEvent, poData)
		})
	}

	//***************************************************************
	static set_browser_url() {
		var oSolTitle = cJquery.element(cSolHighPageConstants.SOL_TITLE_ID)
		oSolTitle.html(this.current_sol)
		const oParams = {}

		oParams[cSpaceBrowser.SOL_QUERYSTRING] = this.current_sol
		if (this.is_mosaic) oParams[cSpaceBrowser.MOSAIC_QUERYSTRING] = 1

		const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams)
		cBrowser.update_state('solhigh', sUrl)
	}

	//###############################################################
	//# events
	//###############################################################
	static onCheckMosaic() {
		var oChkMosaic = cJquery.element(cSolHighPageConstants.CHK_MOSAIC_ID)
		this.is_mosaic = oChkMosaic[0].checked
		this.set_browser_url()
		this.render_highlights()
	}

	//***************************************************************
	static onClickMosaic() {
		var sUrl

		if (cBrowser.data[cSpaceBrowser.MOSAIC_QUERYSTRING] != null) return
		//pr_stop_queue()   //TODO find out what stop-queue is
		const oParams = {}
		oParams[cSpaceBrowser.SOL_QUERYSTRING] = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]
		oParams[cSpaceBrowser.MOSAIC_QUERYSTRING] = 1
		sUrl = cBrowser.buildUrl('solhigh.php', oParams)
		cBrowser.update_state('highlights', sUrl)
		cCommonStatus.set_status('loading..')
		this.onLoadJQuery()
	}

	//***************************************************************
	static onHighlightClick(poEvent, poData) {
		const oParams = {}
		oParams[cSpaceBrowser.SOL_QUERYSTRING] = poData.s
		oParams[cSpaceBrowser.INSTR_QUERYSTRING] = poData.i
		oParams[cSpaceBrowser.PRODUCT_QUERYSTRING] = poData.p
		const sUrl = cBrowser.buildUrl('detail.php', oParams)
		cBrowser.openWindow(sUrl, 'detail')
	}

	//***************************************************************
	static onStatusEvent(poEvent, poData) {
		cCommonStatus.set_status(poData.text)
	}
}
