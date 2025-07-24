/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-Ncercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
'use strict'
/* global cSpaceConstants */
//###############################################################
//# cDetail Tags
//###############################################################
class cDetailTags {
	static TAGS_OUTPUTID = 'cdid'
	static TAGS_TEXT_ID = 'cdtext'
	static TAGS_TEXT_DROPDOWN_ID = 'cdtxtdrop'
	static TAGS_BUTTON_ID = 'cdbut'

	static render() {
		const oThis = this
		var oContainer = cJquery.element(cDetailPageConstants.TAGS_CONTAINER_ID)
		{
			//--------------------------------------------------
			oContainer.empty()
			oContainer.addClass('w3-cell-row w3-theme-l3')

			//----label------------------------------------------
			var oSpan = $('<span>', {
				class: 'w3-cell w3-theme',
				style: 'width:100px'
			})
			{
				oSpan.append('Tags:')
				oContainer.append(oSpan)
			}

			//---where tags go--------------------------------------
			var sID = cJquery.child_ID(oContainer, this.TAGS_OUTPUT_ID)
			oSpan = $('<span>', {
				class: 'w3-cell',
				id: sID,
				style: 'width:500px'
			})
			{
				oSpan.append('loading tags')
				oContainer.append(oSpan)
			}

			//---input controls-----------------------------------------------
			oSpan = $('<span>', { class: 'w3-cell' })
			{
				var oTagInputContainer = $('<div>', {
					class: 'w3-dropdown-hover'
				})
				{
					var sTextID = cJquery.child_ID(oContainer, this.TAGS_TEXT_ID)
					{
						var oInput = $('<input>', {
							type: 'text',
							size: 20,
							id: sTextID
						})
						cJquery.disable_element(oInput)
						oInput.on('keyup', () => oThis.onKeyUp(oInput))
						oTagInputContainer.append(oInput)
					}

					var sDropdownID = cJquery.child_ID(oContainer, this.TAGS_TEXT_DROPDOWN_ID)
					{
						var oDropdown = $('<DIV>', {
							id: sDropdownID,
							class: 'w3-dropdown-content w3-border w3-center w3-padding-small w3-theme-l4',
							style: 'z-index:100'
						})
						oDropdown.append('type something')
						oTagInputContainer.append(oDropdown)
					}
					oSpan.append(oTagInputContainer)
				}

				sID = cJquery.child_ID(oContainer, this.TAGS_BUTTON_ID)
				{
					var oButton = cAppRender.make_button(sID, 'add', 'add Tag', true, () => oThis.onClickAdd())
					oSpan.append(oButton)
				}
				oContainer.append(oSpan)
			}
		}
		//catch FB event
		bean.on(cFacebook, cFacebook.STATUS_EVENT, () => oThis.enable())

		this.get_tags()
	}

	//***********************************************************
	//* Utility functions
	//***********************************************************
	static async get_tags() {
		const oThis = this

		cTagging.getTags(cDetail.sol, cDetail.instrument, cDetail.product, poHttp => oThis.onGotTags(poHttp))
	}

	//***********************************************************
	static enable() {
		var oInput = this.pr_get_tag_child(this.TAGS_TEXT_ID)
		cJquery.enable_element(oInput)

		var oButton = this.pr_get_tag_child(this.TAGS_BUTTON_ID)
		cJquery.enable_element(oButton)
	}

	//***********************************************************
	static pr_get_tag_child(psID) {
		var oContainer = cJquery.element(cDetailPageConstants.TAGS_CONTAINER_ID)
		if (oContainer.length == 0) cDebug.error('container doesnt exist')

		var oElement = cJquery.get_child(oContainer, psID)

		return oElement
	}

	//***********************************************************
	static async pr_set_tag(psTag) {
		const oThis = this
		cCommonStatus.set_status('setting tag: ' + psTag)
		cTagging.setTag(cDetail.sol, cDetail.instrument, cDetail.product, psTag, () => oThis.onSetTag())
	}

	//***********************************************************
	//* Events
	//***********************************************************
	static async onKeyUp(poInputElement) {
		//----get the dropdown ID
		var oDropdown = this.pr_get_tag_child(this.TAGS_TEXT_DROPDOWN_ID)
		oDropdown.empty()

		//----get the input
		var sText = poInputElement.val()

		if (sText.length < 3) oDropdown.append('type more characters')
		else {
			oDropdown.append('enough characters')
			const oThis = this
			cTagging.searchTags(sText, poHttp => oThis.onGotSearchResults(poHttp))
		}
	}

	//***********************************************************
	static onGotTags(poHttp) {
		cCommonStatus.set_status('got tag')

		//---------------------------------------------------
		var oTagDiv = this.pr_get_tag_child(this.TAGS_OUTPUT_ID)
		cAppRender.render_tags(oTagDiv, poHttp.response)
		cBrowser.unbindInputKeyPress()

		cCommonStatus.set_status('ok')
	}

	//***********************************************************
	static async onClickAdd() {
		var sTag

		var oText = this.pr_get_tag_child(this.TAGS_TEXT_ID)

		// check something was entered
		sTag = oText.val()
		if (sTag === '') {
			alert('no tag text')
			return
		}

		this.pr_set_tag(sTag)
	}

	//***************************************************************
	static async onClickSearchResult(poEvent) {
		var sTag = poEvent.currentTarget.textContent
		this.pr_set_tag(sTag)
	}
	//***************************************************************
	static onSetTag() {
		this.get_tags()
	}

	//***************************************************************
	static onGotSearchResults(poHttp) {
		var oDiv = this.pr_get_tag_child(this.TAGS_TEXT_DROPDOWN_ID)
		oDiv.empty()

		//-----get the response
		var aData = poHttp.response

		if (aData.length == 0) {
			oDiv.append('nothing matched')
			return
		}

		//output the results
		const oThis = this
		for (var i = 0; i < aData.length; i++) {
			var sTag = aData[i]
			var oButton = cAppRender.make_button(null, sTag, sTag, false, poEvent => oThis.onClickSearchResult(poEvent))
			oDiv.append(oButton)
		}
	}
}

//###############################################################
//# cDetailSolButtons
//###############################################################
class cDetailSolButtons {
	static SOL_CHILD_ID = 's'
	static INSTR_CHILD_ID = 'i'
	static IMGNO_CHILD_ID = 'no'
	static UTC_CHILD_ID = 'u'
	static IMGMAX_CHILD_ID = 'max'
	static CAL_CHILD_ID = 'c'
	static PDS_CHILD_ID = 'p'
	static NASA_CHILD_ID = 'n'

	static $sol_button_id = null

	static render() {
		const oThis = this
		const oContainer = cJquery.element(cDetailPageConstants.SOL_CONTROLS_ID)

		oContainer.empty()

		//-------------------------------------------------------------------------------
		var sID
		var oSubcontainer = $('<SPAN>', { class: 'w3-theme-l1 w3-padding' })
		{
			oSubcontainer.append('Sol: ')
			sID = cJquery.child_ID(oContainer, this.SOL_CHILD_ID)
			this.pr_add_button(oSubcontainer, sID, ' All Sol Images', '???', e => oThis.onClickSol(e))
			sID = cJquery.child_ID(oContainer, this.INSTR_CHILD_ID)
			this.pr_add_button(oSubcontainer, sID, 'Show Intrument Images', 'loading', () => oThis.onClickInstr())
			sID = cJquery.child_ID(oContainer, this.CAL_CHILD_ID)
			this.pr_add_button(oSubcontainer, sID, 'Show Sol Calendar', 'Calendar', () => oThis.onClickCal())
			this.pr_add_button(oSubcontainer, null, 'Highlights', 'Highlights', () => oThis.onClickHighlights())
			this.pr_add_button(oSubcontainer, null, 'Show Thumbnails', 'Thumbnails', () => oThis.onClickThumbnails())
			oContainer.append(oSubcontainer)
		}
		oContainer.append(cBrowser.whitespace(20))

		oSubcontainer = $('<SPAN>', { class: 'w3-theme-l1 w3-padding' })
		{
			oSubcontainer.append('This Product: ')
			sID = cJquery.child_ID(oContainer, this.UTC_CHILD_ID)
			var oSpan = $('<SPAN>', { id: sID, class: 'date' })
			{
				oSpan.append('date goes here')
				oSubcontainer.append(oSpan)
			}
			this.pr_add_button(oSubcontainer, null, 'Original NASA Image', 'Original', () => oThis.onClickNASA())
			sID = cJquery.child_ID(oContainer, this.NASA_CHILD_ID)
			this.pr_add_button(oSubcontainer, sID, 'MSL curiosity Raw images', 'MSL Raw Image', () => oThis.onClickMSLRaw())
			sID = cJquery.child_ID(oContainer, this.PDS_CHILD_ID)
			this.pr_add_button(oSubcontainer, sID, 'released PDS product', 'PDS Product', () => oThis.onClickPDS())
			this.pr_add_button(oSubcontainer, null, 'Search related with google', 'Google', () => oThis.onClickGoogle())

			//------------------------------------------------------------------------------
			oSubcontainer.append(cBrowser.whitespace(20))

			//------------------------------------------------------------------------------
			const sImgNoID = cJquery.child_ID(oContainer, this.IMGNO_CHILD_ID)
			const sImgMaxID = cJquery.child_ID(oContainer, this.IMGMAX_CHILD_ID)
			oSubcontainer.append("image <span id='" + sImgNoID + "'>??</span> of <span id='" + sImgMaxID + "'>??</span>")
			oContainer.append(oSubcontainer)
		}
	}

	//****************************************************************
	//* privates
	//****************************************************************
	static pr_add_button(poParent, psID = null, psTitle, psCaption, pfnOnClick) {
		var oParams = { class: 'w3-button w3-padding-small w3-theme-action', title: psTitle }
		if (psID !== null) oParams.id = psID
		var oButton = $('<button>', oParams)
		{
			oButton.append(psCaption)
			oButton.on('click', pfnOnClick)
			poParent.append(oButton)
			poParent.append(' ')
		}
	}

	//***************************************************************
	//* events
	//***************************************************************
	static onClickSol() {
		const oItem = cDetail.oItem
		const sUrl = cBrowser.buildUrl('index.php', {
			[cSpaceUrlParams.SOL]: oItem.s
		})
		cBrowser.openWindow(sUrl, 'index')
	}

	//***************************************************************
	static onClickInstr() {
		const oItem = cDetail.oItem
		const sUrl = cBrowser.buildUrl('index.php', {
			[cSpaceUrlParams.SOL]: oItem.s,
			[cSpaceUrlParams.INSTRUMENT]: oItem.i,
			[cAppUrlParams.BEGIN]: cDetail.iNum
		})
		cBrowser.openWindow(sUrl, 'index')
	}
	//***************************************************************
	static onClickNASA() {
		const oItem = cDetail.oItem
		window.open(oItem.d.i, 'nasa')
	}

	//***************************************************************
	static onClickMSLRaw() {
		const oItem = cDetail.oItem
		const sUrl = cCuriosity.get_raw_image(oItem.s, oItem.p)
		window.open(sUrl, 'mslraw')
	}

	//***************************************************************
	static onClickPDS() {
		const oItem = cDetail.oItem

		const sUrl = cBrowser.buildUrl('pds.php', {
			[cSpaceUrlParams.SOL]: oItem.s,
			[cSpaceUrlParams.INSTRUMENT]: oItem.i,
			[cSpaceUrlParams.PRODUCT]: oItem.p
		})
		cBrowser.openWindow(sUrl, 'pds')
	}
	//***************************************************************
	static onClickCal() {
		const oItem = cDetail.oItem

		const sUrl = cBrowser.buildUrl('cal.php', {
			[cSpaceUrlParams.SOL]: oItem.s
		})
		cBrowser.openWindow(sUrl, 'calendar')
	}

	//***************************************************************
	static onClickThumbnails() {
		const oItem = cDetail.oItem

		const sUrl = cBrowser.buildUrl('index.php', {
			[cSpaceUrlParams.SOL]: oItem.s,
			[cSpaceUrlParams.INSTRUMENT]: oItem.i,
			[cSpaceUrlParams.THUMB_PARAM]: 1
		})
		cBrowser.openWindow(sUrl, 'solthumb')
	}

	//***************************************************************
	static onClickHighlights() {
		const oItem = cDetail.oItem

		const sUrl = cBrowser.buildUrl('solhigh.php', { [cSpaceUrlParams.SOL]: oItem.s })
		cBrowser.openWindow(sUrl, 'solthumb')
	}
	//***************************************************************
	static onClickGoogle() {
		const oItem = cDetail.oItem

		const sUrl = 'https://www.google.com/#q=%22' + oItem.p + '%22'
		window.open(sUrl, 'map')
	}

	//***************************************************************
	static update_child(psChild, psText) {
		const oElement = this.get_child(psChild)
		oElement.html(psText)
	}

	//***************************************************************
	static get_child(psChild) {
		const oContainer = cJquery.element(cDetailPageConstants.SOL_CONTROLS_ID)
		const oElement = cJquery.get_child(oContainer, psChild)
		return oElement
	}
}

//###############################################################
//# cDetailImage
//###############################################################
class cDetailImage {
	static populate_image() {
		// no data returned
		const oItem = cDetail.oItem
		var oData = oItem.d

		// empty highligths as there may have been a product before
		cDetailHighlight.clear()

		// set status
		cCommonStatus.set_status('Image Loading')

		//--------------there was no data returned
		if (oData === null) {
			cDebug.warn('product ' + oItem.p + ' was not found')
			var oDiv = cJquery.element(cDetailPageConstants.IMAGE_CONTAINER_ID)
			{
				oDiv.empty()
				oDiv.addClass('image_error')
				oDiv.append('product not found')
			}

			var sUrl
			if (oItem.migrate !== null) {
				sUrl = cBrowser.buildUrl('migrate.php', {
					[cSpaceUrlParams.SOL]: oItem.s,
					[cSpaceUrlParams.INSTRUMENT]: oItem.i,
					[cAppUrlParams.PRODUCT_FROM]: oItem.p,
					[cAppUrlParams.PRODUCT_TO]: oItem.migrate
				})

				cBrowser.openWindow(sUrl, 'migrate')
			} else {
				sUrl = cBrowser.buildUrl('error.php', {
					[cAppUrlParams.MESSAGE]: 'product ' + oItem.p + ' was not found'
				})
				cBrowser.openWindow(sUrl, 'error')
			}
			return
		}

		// there was an image
		var sImgUrl = oData.i
		sImgUrl = sImgUrl.replace('http:', 'https:')

		var oContainer = cJquery.element(cDetailPageConstants.IMAGE_ID)
		const oImg = $('<img>').attr({ src: sImgUrl, id: 'baseimg' })
		{
			oImg.on('load', poEvent => cDetail.OnImageLoaded(poEvent))
			oContainer.empty()
			oContainer.append(oImg)
		}

		//update the FB meta information for the image //should be a separate class
		$("meta[property='og:image']").attr('content', cAppLocations.home + '/' + sImgUrl) // facebook tag for image
	}
}

//###############################################################
//# cDetailHighlight
//###############################################################
class cDetailHighlight {
	static onLoad() {
		const oThis = this
		cImgHilite.onLoad()
		cImgHilite.set_onclick_accept(e => oThis.onClickHighlightAccept(e))
	}

	static clear() {
		cImgHilite.remove_boxes()
	}

	static getHighlights() {
		const oThis = this
		cImgHilite.getHighlights(cDetail.oItem.s, cDetail.oItem.i, cDetail.oItem.p, poHttp => oThis.onGotHighlights(poHttp))
	}

	//***************************************************************
	static onGotHighlights(poHttp) {
		var i, oBox, oNumber
		var oData = poHttp.response
		if (!oData.d) {
			cDebug.write('no highlights')
			return
		}

		var last_top = -1
		var last_left = -1
		for (i = 0; i < oData.d.length; i++) {
			var oItem = oData.d[i]
			if (oItem.t == last_top && oItem.l == last_left) {
				cDebug.warn('duplicate box found')
				continue
			}
			cDebug.write('adding highlight: top=' + oItem.t + ' left=' + oItem.l)
			oBox = cImgHilite.make_fixed_box(oItem.t, oItem.l)

			oNumber = $(oBox).find(cImgHilite.numberID) //find the child element of the number
			oNumber.html(i + 1)

			last_left = oItem.l
			last_top = oItem.t
		}
	}
	//**************************************************
	static onClickHighlightAccept(poEvent) {
		const oBox = cImgHilite.getBoxFromButton(poEvent.currentTarget)
		const oThis = this
		cImgHilite.save_highlight(cDetail.oItem.s, cDetail.oItem.i, cDetail.oItem.p, oBox, poHttp => oThis.onSavedHighlight(poHttp))
	}

	static onSavedHighlight() {
		cImgHilite.remove_boxes()
		this.getHighlights()
	}

	static makeBox(piX, piY) {
		cImgHilite.makeBox(piX, piY, true)
	}
}

//###############################################################
//# cDetailComments
//###############################################################
class cDetailComments {
	//***************************************************************************
	static killWidget() {
		var oComment = cJquery.element(cDetailPageConstants.COMMENTS_CONTAINER_ID)
		const oWidget = oComment.data('ckCommentbox') // capitalise the first letter of the widget
		if (oWidget) oWidget.destroy()
	}

	//***************************************************************************
	static init_widget() {
		this.killWidget()

		var oComment = cJquery.element(cDetailPageConstants.COMMENTS_CONTAINER_ID)
		oComment.commentbox({
			mission: cMission,
			sol: cDetail.sol,
			product: cDetail.product,
			instrument: cDetail.instrument,
			read_only: false
		})
	}
}

//###############################################################
//# cImageButtons
//###############################################################
class cImageButtons {
	static instrument_clicks() {
		const oThis = this
		$('#submittag').on('click', poEvent => oThis.onClickAddTag(poEvent))

		$('#prev_prod_top').on('click', poEvent => oThis.onClickPreviousProduct(poEvent))
		$('#prev_top').on('click', poEvent => oThis.onClickPrevious(poEvent))
		$('#next_top').on('click', poEvent => oThis.onClickNext(poEvent))
		$('#next_prod_top').on('click', poEvent => oThis.onClickNextProduct(poEvent))

		$('#prev_left').on('click', poEvent => oThis.onClickPrevious(poEvent))

		$('#next_right').on('click', poEvent => oThis.onClickNext(poEvent))

		$('#prev_prod_bottom').on('click', poEvent => oThis.onClickPreviousProduct(poEvent))
		$('#prev_bottom').on('click', poEvent => oThis.onClickPrevious(poEvent))
		$('#next_bottom').on('click', poEvent => oThis.onClickNext(poEvent))
		$('#next_prod_bottom').on('click', poEvent => oThis.onClickNextProduct(poEvent))
	}

	//***************************************************************
	static onClickNextProduct() {
		cDetail.pr_fetch_next_product(cSpaceConstants.DIRECTION_NEXT)
	}

	//***************************************************************
	static onClickPreviousProduct() {
		cDetail.pr_fetch_next_product(cSpaceConstants.DIRECTION_PREVIOUS)
	}

	//***************************************************************
	static onClickNext() {
		cDetail.pr_fetch_next_image(cSpaceConstants.DIRECTION_NEXT)
	}

	//***************************************************************
	static onClickPrevious() {
		cDetail.pr_fetch_next_image(cSpaceConstants.DIRECTION_PREVIOUS)
	}
}

//###############################################################
//# cDetail
//###############################################################
class cDetail {
	static oItem = null
	static iNum = null
	static sol = null
	static instrument = null
	static product = null

	//***********************************************************
	static onLoadJQuery() {
		//set click handlers
		//cDetailContainer.render()  //todo
		cDetailSolButtons.render()
		cImageButtons.instrument_clicks()

		// get user data
		cCommonStatus.set_status('loading user data...')
		var sSol = cBrowser.data[cSpaceUrlParams.SOL]
		var sInstr = cBrowser.data[cSpaceUrlParams.INSTRUMENT]
		var sProduct = cBrowser.data[cSpaceUrlParams.PRODUCT]
		this.sol = sSol
		this.instrument = sInstr
		this.product = sProduct

		//get the image data
		this.get_product_data(sSol, sInstr, sProduct)

		//tags
		cDetailTags.render()

		// catch key presses but not on text inputs
		const oThis = this
		$(window).keypress(poEvent => oThis.onKeyPress(poEvent))
		cBrowser.unbindInputKeyPress()

		cDetailHighlight.onLoad()
	}

	//***************************************************************
	static pr_fetch_next_product(psDirection) {
		const oItem = this.oItem
		const sUrl = cBrowser.buildUrl(cAppRest.base_url('nexttime.php'), {
			[cAppUrlParams.DIRECTION]: psDirection,
			[cSpaceUrlParams.PRODUCT]: oItem.p,
			[cSpaceUrlParams.MISSION]: cMission.ID
		})
		cCommonStatus.set_status('fetching next image details...')
		const oHttp = new cHttp2()
		{
			const oThis = this
			bean.on(oHttp, 'result', poHttp => oThis.onNextProduct(poHttp))
			bean.on(oHttp, 'error', poHttp => oThis.onNextError(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}

	//***************************************************************
	static pr_fetch_next_image(psDirection) {
		// find the next image
		cCommonStatus.set_status('fetching next image details...')
		const oItem = this.oItem
		var sUrl = cBrowser.buildUrl(cAppRest.base_url('next.php'), {
			[cAppUrlParams.DIRECTION]: psDirection,
			[cSpaceUrlParams.PRODUCT]: oItem.p,
			[cSpaceUrlParams.MISSION]: cMission.ID
		})
		const oHttp = new cHttp2()
		{
			const oThis = this
			bean.on(oHttp, 'result', poHttp => oThis.onNextImage(poHttp))
			bean.on(oHttp, 'error', poHttp => oThis.onNextError(poHttp))
			oHttp.fetch_json(sUrl)
		}
	}

	//###############################################################
	//# Click Event Handlers
	//###############################################################

	//***************************************************************
	static onKeyPress(poEvent) {
		const sChar = String.fromCharCode(poEvent.which)
		switch (sChar) {
			case 'n':
				this.onClickNext()
				break
			case 'N':
				this.onClickNextProduct()
				break
			case 'p':
				this.onClickPrevious()
				break
			case 'P':
				this.onClickPreviousProduct()
				break
		}
	}

	//***************************************************************
	static OnImageClick(poEvent) {
		if (cAuth.user) cDetailHighlight.makeBox(poEvent.pageX, poEvent.pageY)
		else alert('log in to highlight')
	}

	//###############################################################
	//# Event Handlers
	//###############################################################

	static onNextError(poHttp) {
		const oContainer = cJquery.element(cDetailPageConstants.IMAGE_ID)
		oContainer.empty()
		const oErrorDiv = cRender.errorbox('error retrieving image - press reload for previous image')
		oContainer.append(oErrorDiv)
	}

	//***************************************************************
	static onNextProduct(poHttp) {
		const oData = poHttp.response
		if (!oData) cCommonStatus.set_error_status('unable to find')
		else {
			this.get_product_data(oData.sol, oData.instr, oData.product)
		}
	}

	//***************************************************************
	static onNextImage(poHttp) {
		const oData = poHttp.response

		this.get_product_data(oData.sol, oData.instr, oData.product)
	}

	//***************************************************************
	static OnImageLoaded(poEvent) {
		var iWidth, iHeight, iImgW

		const oImg = $(poEvent.target)
		iHeight = oImg.height()
		iImgW = oImg.width()
		iWidth = iImgW / 4 - 5

		// make the buttons the right size
		$('#next_right').height(iHeight)
		$('#prev_left').height(iHeight)

		$('#prev_prod_top').innerWidth(iWidth)
		$('#prev_top').innerWidth(iWidth)
		$('#next_top').innerWidth(iWidth)
		$('#next_prod_top').innerWidth(iWidth)

		$('#prev_prod_bottom').innerWidth(iWidth)
		$('#prev_bottom').innerWidth(iWidth)
		$('#next_bottom').innerWidth(iWidth)
		$('#next_prod_bottom').innerWidth(iWidth)

		// make the image clickable
		const oThis = this
		$(poEvent.target).on('click', poImgEvent => oThis.OnImageClick(poImgEvent))
		cImgHilite.imgTarget = poEvent.target

		// get the highlights if any
		cDetailHighlight.getHighlights()

		cCommonStatus.set_status('OK')
	}

	//***************************************************************
	static onGotDetails(poHttp) {
		var oData
		cCommonStatus.set_status('received data...')

		// rely upon what came back rather than the query string
		var oResponse = poHttp.response
		this.oItem = oResponse
		oData = oResponse.d

		//----remember the details
		this.sol = oResponse.s
		this.product = oResponse.p
		this.instrument = oResponse.i

		//----these things can be done
		cDetailImage.populate_image()
		this.pr_update_elements(oResponse)
		this.pr_update_doc_title(oResponse)
		if (!oData) return

		this.pr_update_msl(oData.data)

		// update image index details
		this.iNum = oResponse.item
		cDetailSolButtons.update_child(cDetailSolButtons.IMGNO_CHILD_ID, oResponse.item)

		// populate the remaining fields
		cDetailSolButtons.update_child(cDetailSolButtons.UTC_CHILD_ID, oData.du)

		// get the tags
		cDetailTags.get_tags()

		//init the comments widget
		cDetailComments.init_widget()
	}

	//***************************************************************
	//###############################################################
	//# Privates
	//###############################################################
	static pr_update_doc_title(poItem) {
		//---------- THERE WAS DATA -----------------
		// update the title
		document.title = 'detail: s:' + poItem.s + ' i:' + poItem.i + ' p:' + poItem.p + ' (Curiosity Browser)'

		// ------------update the address bar
		var sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), {
			[cSpaceUrlParams.SOL]: poItem.s,
			[cSpaceUrlParams.INSTRUMENT]: poItem.i,
			[cSpaceUrlParams.PRODUCT]: poItem.p
		})
		cBrowser.update_state('Detail', sUrl)
	}

	//***************************************************************
	static pr_update_elements(poItem) {
		cDetailSolButtons.update_child(cDetailSolButtons.SOL_CHILD_ID, poItem.s)
		cDetailSolButtons.update_child(cDetailSolButtons.INSTR_CHILD_ID, poItem.i)
		cDetailSolButtons.update_child(cDetailSolButtons.IMGMAX_CHILD_ID, poItem.max)

		cAppRender.update_title(poItem.p)

		//if not data hide controls
		if (!poItem.d) {
			cDetailSolButtons.update_child(cDetailSolButtons.UTC_CHILD_ID, 'unable to get date')
			var oButton = cDetailSolButtons.get_child(cDetailSolButtons.CAL_CHILD_ID)
			cJquery.disable_element(oButton)

			oButton = cDetailSolButtons.get_child(cDetailSolButtons.PDS_CHILD_ID)
			cJquery.disable_element(oButton)

			oButton = cDetailSolButtons.get_child(cDetailSolButtons.NASA_CHILD_ID)
			cJquery.disable_element(oButton)

			$('#msldata').hide()

			cJquery.element(cDetailPageConstants.COMMENTS_CONTAINER_ID).hide()
			return
		}
	}

	//***************************************************************
	static pr_update_msl(oData) {
		const sDump = cDebug.getvardump(oData, 1)

		var oMSLDiv = cJquery.element(cDetailPageConstants.MSL_ID)
		oMSLDiv.html($('<pre>').append(sDump))
	}

	//***************************************************************
	static get_product_data(psSol, psInstr, psProd) {
		const sUrl = cBrowser.buildUrl(cAppRest.base_url('detail.php'), {
			[cSpaceUrlParams.SOL]: psSol,
			[cSpaceUrlParams.INSTRUMENT]: psInstr,
			[cSpaceUrlParams.PRODUCT]: psProd,
			[cSpaceUrlParams.MISSION]: cMission.ID
		})
		cCommonStatus.set_status('fetching data for ' + psProd)
		const oHttp = new cHttp2()
		{
			const oThis = this
			bean.on(oHttp, 'result', oData => oThis.onGotDetails(oData))
			oHttp.fetch_json(sUrl)
		}
	}
}
