//uses sceditor https://www.sceditor.com/
/* global cComments */
class cCommentBox {
	COMMENTS_DISPLAY_ID = 'CDI'
	COMMENTS_TEXTAREA_ID = 'CTI'
	COMMENTS_BUTTON_ID = 'CBI'

	widget = null
	element = null
	options = {
		mission: null,
		sol: null,
		product: null,
		instrument: null,
		read_only: true
	}

	//*************************************************************
	constructor(poWidget) {
		this.widget = poWidget
		this.element = poWidget.element
		this.options = poWidget.options
	}

	//*************************************************************
	render() {
		var oElement = this.element
		oElement.addClass('w3-card w3-theme-l3 w3-margin')

		//--- header
		var oHeader = $('<header>', { class: 'w3-container w3-theme' })
		oHeader.append('comments')
		oElement.append(oHeader)

		//--- comments display
		var sDisplay_ID, oDisplayDiv
		sDisplay_ID = cJquery.child_ID(oElement, this.COMMENTS_DISPLAY_ID)
		{
			oDisplayDiv = $('<DIV>', {
				id: sDisplay_ID,
				class: 'w3-container w3-theme-l2'
			})
			oDisplayDiv.append('loading comments')
			oElement.append(oDisplayDiv)
		}

		//-----------if readonly dont enable anything
		if (this.options.read_only) return

		//--- textarea display
		var sTEXT_ID, oTextDiv
		sTEXT_ID = cJquery.child_ID(oElement, this.COMMENTS_TEXTAREA_ID)
		{
			oTextDiv = $('<TEXTAREA>', {
				id: sTEXT_ID,
				rows: 5,
				cols: 120,
				placeholder: 'go on share your thoughts with everyone'
			})
			cJquery.disable_element(oTextDiv)
			oElement.append(oTextDiv)
		}

		var sBUT_ID, oButton
		const oThis = this
		sBUT_ID = cJquery.child_ID(oElement, this.COMMENTS_BUTTON_ID)
		{
			oButton = cAppRender.make_button(sBUT_ID, 'comment', 'submit comment', true, () => oThis.onClick())
			cJquery.disable_element(oButton)
			oElement.append(oButton)
		}
	}

	//*************************************************************
	init() {
		var oElement = this.element
		oElement.empty()
		this.render()
		const oThis = this

		//----------- hook onto facebook user - if readonly skip
		this.get_comments()
	}

	//*************************************************************
	get_comments() {
		const oThis = this
		//get the comments
		var sSOl = this.options.sol
		var sProduct = this.options.product
		var sInstr = this.options.instrument
		cDebug.write('getting comments for s:' + sSOl + ' p:' + sProduct + ' i:' + sInstr)
		cComments.get(sSOl, sInstr, sProduct, d => oThis.onCommentsResponse(d))
	}

	//*************************************************************
	//* Events
	//*************************************************************
	enableEditor() {
		var oElement = this.element

		//-----------if readonly dont enable anything
		if (this.options.read_only) return
		if (cAuth.user == null) return

		//-----------enable the button
		var sBUT_ID = cJquery.child_ID(oElement, this.COMMENTS_BUTTON_ID)
		var oButton = cJquery.element(sBUT_ID)
		cJquery.enable_element(oButton)

		//-----------enable the textbox
		var sTEXT_ID = cJquery.child_ID(oElement, this.COMMENTS_TEXTAREA_ID)
		var oTextBox = cJquery.element(sTEXT_ID)

		oTextBox.sceditor({
			plugins: 'bbcode',
			style: cAppLocations.jsextra + '/sceditor/minified/themes/default.min.css',
			toolbarExclude: 'print,code,email,source,maximize',
			height: 100,
			resizeEnabled: false,
			emoticonsRoot: cAppLocations.jsextra + '/sceditor/'
		})
		const oThis = this
		oTextBox.sceditor('instance').blur(() => oThis.onInputDefocus())
		oTextBox.sceditor('instance').focus(() => oThis.onInputFocus())
	}

	//*************************************************************
	onClick() {
		var oElement = this.element
		var sTEXT_ID = cJquery.child_ID(oElement, this.COMMENTS_TEXTAREA_ID)
		var oTextBox = cJquery.element(sTEXT_ID)

		var sText = oTextBox.sceditor('instance').val() // gets the bbcode - MUST BE PARSED AT SERVER
		const oThis = this
		cComments.set(this.options.sol, this.options.instrument, this.options.product, sText, () => oThis.get_comments())
	}

	//*************************************************************
	onCommentsResponse(poHttp) {
		var oElement = this.element
		var sCommentsID = cJquery.child_ID(oElement, this.COMMENTS_DISPLAY_ID)
		var oData = poHttp.response

		// enable the editor
		this.enableEditor()

		// display the comments
		var oDiv = cJquery.element(sCommentsID)
		oDiv.empty()

		if (!oData) {
			oDiv.append('No Comments - be the first !')
		} else {
			for (var i = 0; i < oData.length; i++) {
				var oItem = oData[i]
				var sText = decodeURIComponent(oItem.c)
				var sUser = oItem.u
				if (sUser === '') sUser = 'anonymous'

				var oCommentDiv = $('<DIV>', {
					class: 'w3-container w3-margin w3-theme-l5'
				})
				{
					var oUserSpan = $('<span>', {
						class: 'w3-theme-tag w3-round w3-padding'
					})
					{
						oUserSpan.append(sUser)
						oCommentDiv.append(oUserSpan)
					}
					var oTextSpan = $('<span>')
					{
						oTextSpan.append(sText)
						oCommentDiv.append(oTextSpan)
					}

					oDiv.append(oCommentDiv)
				}
			}
		}
	}
}

//##################################################################
//##################################################################
$.widget('ck.commentbox', {
	instance: null,
	options: {
		mission: null,
		sol: null,
		product: null,
		instrument: null,
		read_only: true
	},

	//*******************************************************************
	_create: function () {
		//-------checks
		if (typeof cComments === 'undefined') cDebug.error('cComments is not defined')

		//-------proceed
		var oBox = new cCommentBox(this)
		this.instance = oBox
		oBox.init()
	}
})
