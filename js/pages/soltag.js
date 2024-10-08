/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict'
/* global cAppSolButtons*/
var current_sol = null

//###############################################################
//# Utility functions
//###############################################################
//eslint-disable-next-line no-unused-vars
function onLoadJQuery_SOLTAG() {
	var sUrl, sSol

	// render the sol buttons
	var oDiv = cJquery.element('solbuttons')
	cAppSolButtons.render_buttons(oDiv)

	// update sol number
	sSol = cBrowser.data.s

	sUrl = cBrowser.buildUrl('index.php', { s: sSol })
	$('#sol').html("<a href='" + sUrl + "'>" + sSol + '</a>')
	current_sol = sSol

	// put up a spinner
	oDiv = cJquery.element('soltag')
	oDiv.empty()
	var oSpinner = cAppRender.make_spinner('fetching tags')
	oDiv.append(oSpinner)

	// load tags
	sUrl = cBrowser.buildUrl(cAppRest.base_url('/tag.php'), {
		s: sSol,
		o: 'sol',
		m: cMission.ID
	})
	cCommonStatus.set_status('fetching tags')

	const oHttp = new cHttp2()
	{
		bean.on(oHttp, 'result', load_soltag_callback)
		oHttp.fetch_json(sUrl)
	}
}

//###############################################################
//* call backs
//###############################################################
function load_soltag_callback(poHttp) {
	var sInstr, aTags, i, sProduct, sTag, oItem, sTagUrl, sProductURL
	var oDiv

	oDiv = $('#soltag')
	oDiv.empty()
	const aData = poHttp.response

	if (aData == null) {
		oDiv.append(cAppRender.make_note('no tags found'))
		return
	}

	for (sInstr in aData) {
		oDiv.append('<h2>' + sInstr + '</h2>')
		aTags = aData[sInstr]

		for (i = 0; i < aTags.length; i++) {
			oItem = aTags[i]
			sProduct = oItem.p
			sTag = oItem.t
			sTagUrl = cBrowser.buildUrl('tag.php', { t: sTag })
			var oATag = $('<A>', { href: sTagUrl }).append(sTag)

			sProductURL = cBrowser.buildUrl('detail.php', {
				s: current_sol,
				i: sInstr,
				p: sProduct
			})
			var oAProduct = $('<A>', { href: sProductURL }).append(sProduct)

			oDiv.append(oATag).append(' in ').append(oAProduct).append('<br>')
		}
	}

	cCommonStatus.set_status('ok')
}
