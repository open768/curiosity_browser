//#TODO# use chttpqueue

/* global cQueueRunner */
class cThumbnail {
	static delay = 50
	static thumbqueue

	static {
		cThumbnail.thumbqueue = new cQueueRunner(cThumbnail.delay)
	}

	element = null
	widget = null
	options = null
	consts = {
		SIZE: 144,
		DEFAULT_STYLE: 'polaroid',
		STYLES: {
			ORIG: 'thumb-orig',
			WAITING1: 'thumb-wait',
			WAITING2: 'thumb-wait2',
			WAITING3: 'thumb-wait3',
			WORKING: 'thumb-work',
			ERROR: 'thumb-error',
			FINAL: 'thumb-final',
			MISSING: 'thumb-missing'
		},
		THUMBNAILER_URL: cAppLocations.thumbnailer,
		DEFAULT_THUMBNAIL: cAppLocations.home + '/images/browser/chicken_icon.png',
		WAIT_VISIBLE: 2000,
		CHILD_IMG_ID: 'CID'
	}

	//******************************************************************
	//******************************************************************
	constructor(poWidget) {
		this.widget = poWidget
		this.element = poWidget.element
		this.options = poWidget.options

		// check for necessary classes
		if (!bean) {
			$.error('bean class is missing! check includes')
		}
		if (!cHttp2) {
			$.error('http2 class is missing! check includes')
		}
		if (!$.event.special.inview) {
			$.error('inview class is missing! check includes')
		}
		if (!this.element.visible) $.error('visible class is missing! check includes')

		const oOptions = this.options
		if (oOptions.sol == null) $.error('sol is not set')
		if (oOptions.instrument == null) $.error('instrument is not set')
		if (oOptions.product == null) $.error('product is not set')
		if (oOptions.url == null) $.error('url is not set')
		if (oOptions.mission == null) $.error('mission is not set')
	}

	//******************************************************************
	//******************************************************************
	init() {
		var oImg, oThis, oElement

		oThis = this
		oElement = this.element

		// init
		oElement.uniqueId() // sets a unique ID on the SPAN.

		this.pr__set_style(this.consts.STYLES.ORIG)

		//---------- add img to element
		const sImgID = cJquery.child_ID(oElement, this.consts.CHILD_IMG_ID)
		oImg = $('<IMG>', {
			title: this.options.product,
			border: 0,
			height: this.consts.SIZE,
			src: this.consts.DEFAULT_THUMBNAIL,
			ID: sImgID
		})
		{
			oImg.click(function () {
				oThis.onThumbClick()
			})
			oElement.append(oImg)
		}

		// optimise server requests, only display thumbnail if its in viewport
		oElement.on('inview', function (poEvent, pbIsInView) {
			oThis.onPlaceholderInView(pbIsInView)
		})
	}
	//#################################################################
	//# methods
	//#################################################################
	stop_queue() {
		cQueueRunner.stop()
	}

	//******************************************************************
	pr__set_style(psStyle) {
		this.element.attr('class', this.consts.DEFAULT_STYLE + ' ' + psStyle)
	}

	//#################################################################
	//# events
	//#################################################################
	//******************************************************************
	onPlaceholderInView(pbIsInView) {
		const oThis = this

		if (cThumbnail.thumbqueue.stopping) return
		if (!pbIsInView) return

		this.element.off('inview') // turn off the inview listener
		this.pr__set_style(oThis.consts.STYLES.WAITING1)

		setTimeout(() => oThis.onPlaceholderDelay(), this.consts.WAIT_VISIBLE)
	}

	//******************************************************************
	onPlaceholderDelay() {
		var oImg, oThis
		const oElement = this.element
		oThis = this
		if (cThumbnail.thumbqueue.stopping) return

		if (oElement.visible()) {
			// load the basic thumbnail
			oImg = cJquery.get_child(oElement, this.consts.CHILD_IMG_ID)
			oImg.on('load', () => oThis.onBasicThumbLoaded()) // do something when thumbnail loaded
			oImg.attr('src', this.options.url) // load basic thumbnail
		} else {
			// image is not visible - reset the inview trigger
			cDebug.write('placeholder not visible  ' + this.options.product)
			oElement.on('inview', (e, pbFlag) => oThis.onPlaceholderInView(pbFlag))
		}
	}

	//******************************************************************
	//* Basic thumbnail
	//******************************************************************
	onBasicThumbLoaded() {
		const oThis = this
		const oElement = this.element
		const oImg = cJquery.get_child(oElement, this.consts.CHILD_IMG_ID)

		if (cThumbnail.thumbqueue.stopping) return
		oImg.off('load') // remove the load event so it doesnt fire again

		this.pr__set_style(oThis.consts.STYLES.WAITING2)
		setTimeout(() => oThis.onBasicThumbViewDelay(), this.consts.WAIT_VISIBLE)
	}

	//******************************************************************
	onBasicThumbViewDelay() {
		const oThis = this

		const oElement = this.element
		const oImg = cJquery.get_child(oElement, this.consts.CHILD_IMG_ID)

		const oThumbQ = cThumbnail.thumbqueue
		if (oThumbQ.stopping) return
		if (oImg.visible()) {
			oThumbQ.queue.push(null, this)
			bean.on(oThumbQ, cQueueRunner.EVENT_STEP, oq => oq.onBetterQStep())
			if (!oThumbQ.running) oThumbQ.start()
		} else {
			cDebug.write('Basic thumb not in view: ')
			oElement.on('inview', (e, pbFlag) => oThis.onBasicThumbInView(pbFlag))
		}
	}

	//******************************************************************
	onBasicThumbInView(pbIsInView) {
		if (cThumbnail.thumbqueue.stopping) return

		if (!pbIsInView) return

		this.element.off('inview') // turn off the inview listener
		this.onBasicThumbLoaded() // go back to
	}

	//******************************************************************
	//* Better thumbnail
	//******************************************************************
	onBetterQStep() {
		var oOptions = this.options
		const oElement = this.element
		const oImg = cJquery.get_child(oElement, this.consts.CHILD_IMG_ID)
		var sThumbUrl = cBrowser.buildUrl(this.consts.THUMBNAILER_URL, {
			s: oOptions.sol,
			i: oOptions.instrument,
			p: oOptions.product,
			m: oOptions.mission.ID
		})
		setTimeout(() => oImg.attr('src', sThumbUrl), 100)
		this.pr__set_style(this.consts.STYLES.FINAL)
	}

	//******************************************************************
	//* click
	//******************************************************************
	onThumbClick() {
		const oOptions = this.options
		if (cThumbnail.thumbqueue.stop()) return
		this._trigger('onStatus', null, {
			text: 'clicked: ' + oOptions.product
		})
		this._trigger('onClick', null, {
			sol: oOptions.sol,
			instr: oOptions.instrument,
			product: oOptions.product
		})
	}
}

// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.thumbnail', {
	//#################################################################
	//# Definition
	//#################################################################
	options: {
		sol: null,
		instrument: null,
		product: null,
		base_id: null,
		url: null,
		loaded_better: false,
		mission: null
	},
	instance: null,

	//#################################################################
	//# Constructor
	//#################################################################
	_create() {
		this.instance = new cThumbnail(this)
		this.instance.init()
	}
})
