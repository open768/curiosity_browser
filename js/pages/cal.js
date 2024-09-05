/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict'
/* global cAppSolButtons */
//eslint-disable-next-line no-unused-vars
class cCalendar {
	static current_sol = null
	static current_date = null
	static oColours = {}

	//###############################################################
	//# entry point
	//###############################################################
	static onLoadJQuery() {
		this.current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]

		const oDiv = cJquery.element('solButtons')
		cAppSolButtons.render_buttons(oDiv, false)

		//update the page
		$('#sol').html(this.current_sol)
		const sURL = cBrowser.buildUrl(cBrowser.pageUrl(), { s: this.current_sol })
		cBrowser.update_state('calendar', sURL)

		this.load_widget()
	}

	//###############################################################
	//# Event Handlers
	//###############################################################
	static load_widget() {
		const oDiv = $('#calendar')
		var oWidget = oDiv.data('ckSolcalendar') // capitalise the first letter of the widget
		if (oWidget) oWidget.destroy()
		$('#calendar').solcalendar({
			mission: cMission,
			sol: this.current_sol
		})
	}
}
