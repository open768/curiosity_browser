/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict'

/*global cAppSolButtons cSolMosaicPageConstants cRender*/
//eslint-disable-next-line no-unused-vars
class cSolMosaic {
	static current_sol = null

	//###############################################################
	//# Entry point
	//###############################################################
	static onLoadJQuery() {
		this.current_sol = cBrowser.data[cSpaceUrlParams.SOL]
		if (this.current_sol == null) {
			var oSolHighDiv = cJquery.element(cSolMosaicPageConstants.HIGHLIGHTS_ID)
			oSolHighDiv.append('no SOL provided!!!!')
			return
		}

		const oDiv = cJquery.element(cSolMosaicPageConstants.SOL_BUTTONS_ID)
		cAppSolButtons.render_buttons(oDiv)

		const oTitle = cJquery.element(cSolMosaicPageConstants.SOL_TITLE_ID)
		{
			oTitle.empty()
			oTitle.append(this.current_sol)
		}

		this.get_mosaic_url()
	}

	//###############################################################
	//# Utility functions
	//###############################################################
	static get_mosaic_url() {
		var oDiv = cJquery.element(cSolMosaicPageConstants.MOSAIC_ID)
		oDiv.empty()
		const oSpinner = cAppRender.make_spinner('loading mosaic')
		oDiv.append(oSpinner)

		const oParams = {}
		{
			oParams[cSpaceUrlParams.SOL] = this.current_sol
			oParams[cSpaceUrlParams.MISSION] = cMission.ID
		}
		const sUrl = cBrowser.buildUrl(cAppRest.base_url('solmosaic.php'), oParams)
		const oHttp = new cHttp2()
		{
			const oThis = this
			bean.on(oHttp, 'result', poHttp => oThis.onMosaicResponse(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}

	//###############################################################
	//# events
	//###############################################################
	static onMosaicResponse(poHttp) {
		var oDiv = cJquery.element(cSolMosaicPageConstants.MOSAIC_ID)
		oDiv.empty()

		const oData = poHttp.response
		if (oData.mos == null) {
			oDiv.append(cRender.messagebox('unable to create mosaic'))
			return
		}

		const oParams = {}
		oParams[cAppUrlParams.MOSAIC_PARAM] = oData[cAppUrlParams.MOSAIC_PARAM]

		const sImgUrl = cBrowser.buildUrl(cAppLocations.mosaicer, oParams)
		const oImg = $('<img>', { src: sImgUrl, class: 'image' })
		const oThis = this
		oImg.click(() => oThis.onClickMosaic(oData))
		oDiv.append(oImg)
	}

	//***************************************************************
	static onClickMosaic(poData) {
		const sUrl = cBrowser.buildUrl('solhigh.php', { s: poData[cSpaceUrlParams.SOL] })
		cBrowser.openWindow(sUrl, 'index')
	}

	//***************************************************************
	static onStatusEvent(poEvent, poData) {
		cCommonStatus.set_status(poData.text)
	}
}
