'use strict'
/* global cAppAllSolButtons */
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
class cSolButtons {
	TAG_ID = 't'
	HIGH_ID = 'h'
	GIGA_ID = 'g'
	NOTEBOOK_ID = 'n'
	CAL_ID = 'c'
	REFRESH_ID = 'r'
	ALLTHUMB_ID = 'at'
	SITE_ID = 's'
	options = null
	element = null
	widget = null

	//****************************************************************
	constructor(poWidget) {
		this.widget = poWidget
		this.options = poWidget.options
		this.element = poWidget.element
		this.init()
	}

	//****************************************************************
	pr_render_sol_buttons() {
		var oWidget, oButton
		var oElement = this.element
		var sID
		const oThis = this

		oWidget = cAppRender.create_widget('Sol Information:')
		{
			var oBody = oWidget.body
			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.TAG_ID)
			oButton = cAppRender.make_button(sID, 'Tags', 'Tags', true, () => oThis.onClickTag())
			oBody.append(oButton)

			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.HIGH_ID)
			oButton = cAppRender.make_button(sID, 'Highlights', 'Highlights', true, () => oThis.onClickHighlights())
			oBody.append(oButton)

			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.GIGA_ID)
			oButton = cAppRender.make_button(sID, 'Gigapans', 'Gigapans', true, () => oThis.onClickGigapans())
			oBody.append(oButton)

			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.NOTEBOOK_ID)
			oButton = cAppRender.make_button(sID, 'MSL Notebook', 'MSL Notebook', true, () => oThis.onClickMSLNotebook())
			oBody.append(oButton)

			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.CAL_ID)
			oButton = cAppRender.make_button(sID, 'Calendar', 'Calendar', true, () => oThis.onClickCalender())
			oBody.append(oButton)

			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.REFRESH_ID)
			oButton = cAppRender.make_button(sID, 'Refresh', 'Refresh', true, () => oThis.onClickRefresh())
			oBody.append(oButton)

			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.ALLTHUMB_ID)
			oButton = cAppRender.make_button(sID, 'All thumbnails', 'All thumbnails', true, () => oThis.onClickAllThumbs())
			oBody.append(oButton)

			// ----------------------------------------------------
			sID = cJquery.child_ID(oElement, this.SITE_ID)
			oButton = cAppRender.make_button(sID, 'Site', 'Site', true, () => oThis.onClickSite())
			oBody.append(oButton)
		}
		oElement.append(oWidget)
	}

	//****************************************************************
	pr_render_info() {
		var oElement = this.element
		var oButton = null
		var oWidget = cAppRender.create_widget('information:')
		{
			var oBody = oWidget.body
			// ----------------------------------------------------
			oButton = cAppRender.make_button(null, '', 'about', false, () => cBrowser.openWindow('about.php', 'about'))
			{
				oButton.append(cRenderGoogleFont.create_icon('info'))
				oButton.append(' About')
				oBody.append(oButton)
			}

			// ----------------------------------------------------
			oButton = cAppRender.make_button(null, '', 'Where is curiosity now?', false, () => cBrowser.openWindow(cCuriosity.WHERE_IS_ROVER, 'whereami'))
			{
				oButton.append(cRenderGoogleFont.create_icon('map'))
				oButton.append(' Map')
			}
			oBody.append(oButton)

			// ----------------------------------------------------
			oButton = cAppRender.make_button(null, 'Sites', 'All Sites', false, () => cBrowser.openWindow('allsites.php', 'allsites'))
			oBody.append(oButton)
		}
		oElement.append(oWidget)
	}

	//****************************************************************
	pr_render_all_sols() {
		var oElement = this.element

		var oWidget = cAppRender.create_widget('All Sols:')
		{
			var oBody = oWidget.body
			cAppAllSolButtons.render_buttons(oBody)
		}
		oElement.append(oWidget)
	}

	//****************************************************************
	init() {
		var oElement

		// check for necessary classes
		if (!bean) {
			$.error('bean class is missing! check includes')
		}
		if (!cHttp2) {
			$.error('http2 class is missing! check includes')
		}
		if (this.options.mission == null) $.error('mission is not set')

		//prepare element
		oElement = this.element
		oElement.uniqueId()
		oElement.empty()

		//make buttons
		this.pr_render_sol_buttons()
		this.pr_render_all_sols()
		this.pr_render_info()
	}

	//*****************************************************************
	set_sol(psSol) {
		const oThis = this

		// store the sol
		const oOptions = this.options
		oOptions.sol = psSol
		const oElement = this.element

		// disable all buttons in this widget;
		oElement.children('button').each(function () {
			$(this).attr('disabled', 'disabled')
		})

		// enable selected buttons
		var sID
		sID = cJquery.child_ID(oElement, this.NOTEBOOK_ID)
		cJquery.enable_element(cJquery.element(sID))
		sID = cJquery.child_ID(oElement, this.CAL_ID)
		cJquery.enable_element(cJquery.element(sID))
		sID = cJquery.child_ID(oElement, this.REFRESH_ID)
		cJquery.enable_element(cJquery.element(sID))
		sID = cJquery.child_ID(oElement, this.ALLTHUMB_ID)
		cJquery.enable_element(cJquery.element(sID))
		sID = cJquery.child_ID(oElement, this.SITE_ID)
		cJquery.enable_element(cJquery.element(sID))

		// fetch tags, highlights and gigapans
		var sUrl = cBrowser.buildUrl(cAppRest.base_url('gigapans.php'), {
			o: 'sol',
			s: this.options.sol,
			m: oOptions.mission.ID
		})
		var oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onFetchedGigapans(poHttp))
			oHttp.fetch_json(sUrl)
		}

		sUrl = cBrowser.buildUrl(cAppRest.base_url('tag.php'), {
			o: 'solcount',
			s: this.options.sol,
			m: oOptions.mission.ID
		})
		oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onFetchedTagCount(poHttp))
			oHttp.fetch_json(sUrl)
		}

		sUrl = cBrowser.buildUrl(cAppRest.base_url('img_highlight.php'), {
			o: 'solcount',
			s: this.options.sol,
			m: oOptions.mission.ID
		})
		oHttp = new cHttp2()
		{
			bean.on(oHttp, 'result', poHttp => oThis.onHiLiteCount(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}

	//#################################################################
	//# Events
	//#################################################################
	onHiLiteCount(poHttp) {
		if (poHttp.response > 0) {
			const oElement = this.element
			const sID = cJquery.child_ID(oElement, this.NOTEBOOK_ID)
			cJquery.enable_element(cJquery.element(sID))
		}
	}

	//*****************************************************************
	onFetchedTagCount(poHttp) {
		if (poHttp.response > 0) {
			const oElement = this.element
			const sID = cJquery.child_ID(oElement, this.TAG_ID)
			cJquery.enable_element(cJquery.element(sID))
		}
	}

	//*****************************************************************
	onFetchedGigapans(poHttp) {
		if (poHttp.response) {
			const oElement = this.element
			const sID = cJquery.child_ID(oElement, this.GIGA_ID)
			cJquery.enable_element(cJquery.element(sID))
		}
	}

	//*****************************************************************
	onClickTag() {
		this.widget._trigger('onClick', null)
		cBrowser.openWindow(cBrowser.buildUrl('soltag.php', { s: this.options.sol }), 'soltag')
	}
	//*****************************************************************
	onClickHighlights() {
		this.widget._trigger('onClick', null)
		cBrowser.openWindow(cBrowser.buildUrl('solhigh.php', { sheet: 1, s: this.options.sol }), 'solhigh')
	}
	//*****************************************************************
	onClickGigapans() {
		this.widget._trigger('onClick', null)
		cBrowser.openWindow(cBrowser.buildUrl('solgigas.php', { s: this.options.sol }), 'solgigas')
	}
	//*****************************************************************
	onClickMSLNotebook() {
		this.widget._trigger('onClick', null)
		const sUrl = cCuriosity.get_msl_notebook_link(this.options.sol)
		window.open(sUrl, 'date')
	}
	//*****************************************************************
	onClickCalender() {
		this.widget._trigger('onClick', null)
		const sUrl = cBrowser.buildUrl('cal.php', { s: this.options.sol })
		cBrowser.openWindow(sUrl, 'calendar')
	}
	//*****************************************************************
	onClickRefresh() {
		this.widget._trigger('onClick', null)
	}
	//*****************************************************************
	onClickAllThumbs() {
		this.widget._trigger('onClick', null)
		this.widget._trigger('onAllSolThumbs', null, { s: this.options.sol })
	}
	//*****************************************************************
	onClickSite() {
		this.widget._trigger('onClick', null)
		cBrowser.openWindow(cBrowser.buildUrl('site.php', { sol: this.options.sol }), 'site')
	}
}

//#########################################################################
//#
//#########################################################################
$.widget('ck.solButtons', {
	options: {
		sol: null,
		onStatus: null,
		onClick: null,
		onAllSolThumbs: null,
		mission: null
	},
	instance: null,

	_create: function () {
		this.instance = new cSolButtons(this)
	},

	//*****************************************************************
	set_sol: function (psSol) {
		return this.instance.set_sol(psSol)
	}
})
