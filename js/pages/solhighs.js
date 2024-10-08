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
	static current_sol = null

	//###############################################################
	//# Entry point
	//###############################################################
	static onLoadJQuery() {
		this.current_sol = cBrowser.data[cSpaceUrlParams.SOL]
		if (this.current_sol == null) {
			var oSolHighDiv = cJquery.element(cSolHighPageConstants.HIGHLIGHTS_ID)
			oSolHighDiv.append('no SOL provided!!!!')
			return
		}

		const oDiv = cJquery.element(cSolHighPageConstants.SOL_BUTTONS_ID)
		cAppSolButtons.render_buttons(oDiv)

		//add a mosaic button
		oDiv.append(cBrowser.whitespace(50))
		const oThis = this
		const oMosaicBut = cAppRender.make_button(null, ' Mosaic', 'create a mosaic of highlights', false, () => oThis.onClickMosaicButton())
		{
			const oIcon = cRenderGoogleFont.create_icon('dataset')
			oMosaicBut.prepend(oIcon)
			oDiv.append(oMosaicBut)
		}

		const oTitle = cJquery.element(cSolHighPageConstants.SOL_TITLE_ID)
		{
			oTitle.empty()
			oTitle.append(this.current_sol)
		}

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
		const oThis = this
		oDiv.solhighlights({
			sol: this.current_sol,
			mission: cMission,
			home: cAppLocations.home,
			onStatus: (poEvent, poData) => oThis.onStatusEvent(poEvent, poData),
			onClick: (poEvent, poData) => oThis.onHighlightClick(poEvent, poData)
		})
	}

	//***************************************************************
	static set_browser_url() {
		var oSolTitle = cJquery.element(cSolHighPageConstants.SOL_TITLE_ID)
		oSolTitle.html(this.current_sol)
		const oParams = {}
		{
			oParams[cSpaceUrlParams.SOL] = this.current_sol
			oParams[cSpaceUrlParams.MISSION] = cMission.ID
		}

		const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams)
		cBrowser.update_state('solhigh', sUrl)
	}

	//###############################################################
	//# events
	//###############################################################
	static onClickMosaicButton() {
		const oParams = {}
		{
			oParams[cSpaceUrlParams.SOL] = this.current_sol
			oParams[cSpaceUrlParams.MISSION] = cMission.ID
		}
		const sUrl = cBrowser.buildUrl('solmosaic.php', oParams)
		cBrowser.openWindow(sUrl, 'solmosaic')
	}

	//***************************************************************
	static onHighlightClick(poEvent, poData) {
		const oParams = {}
		oParams[cSpaceUrlParams.SOL] = poData.s
		oParams[cSpaceUrlParams.INSTRUMENT] = poData.i
		oParams[cSpaceUrlParams.PRODUCT] = poData.p
		const sUrl = cBrowser.buildUrl('detail.php', oParams)
		cBrowser.openWindow(sUrl, 'detail')
	}

	//***************************************************************
	static onStatusEvent(poEvent, poData) {
		cCommonStatus.set_status(poData.text)
	}
}
