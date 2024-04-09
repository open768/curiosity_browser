// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.thumbnailview', {
  // #################################################################
  // # Definition
  // #################################################################
  consts: {
    URL: cLocations.rest + '/solthumbs.php'
  },
  options: {
    ThumbsPerPage: 100,
    sol: null,
    instrument: null,
    onClick: null,
    mission: null
  },

  // #################################################################
  // # Constructor
  // #################################################################
  _create: function () {
    const oThis = this
    const oOptions = this.options

    // check for necessary classes
    if (!bean) {				$.error('bean class is missing! check includes')	}
    if (!cHttp2) {			$.error('http2 class is missing! check includes')	}
    if (!this.element.gSpinner) { 	$.error('gSpinner is missing! check includes')		}
    if (!this.element.thumbnail) { 	$.error('thumbnail is missing! check includes')		}
    cDebug.write('creating widget thumbnailview')

    // check that the options are passed correctly
    if (oOptions.sol == null) $.error('sol is not set')
    if (oOptions.mission == null) $.error('mission is not set')
    this.element.uniqueId()

    // check that the element is a div
    const sElementName = this.element.get(0).tagName
    if (sElementName !== 'DIV') { $.error('thumbnail view needs a DIV. this element is a: ' + sElementName) }

    // clear out the DIV and put some text in it
    this.element.empty()
    const oDiv = $('<DIV>', { class: '.ui-widget-content' })
    const oLoader = $('<DIV>')
    oLoader.gSpinner({ scale: 0.25 })
    oDiv.append(oLoader).append('Loading thumbnails for sol:' + oOptions.sol)
    this.element.append(oDiv)

    if (oOptions.instrument) this.element.append(', instr:' + oOptions.instrument)

    // start the normal thumbnail download
    this._trigger('onStatus', null, { text: 'loading basic thumbnails' })
    const sUrl = cBrowser.buildUrl(
			 this.consts.URL,
      { s: oOptions.sol, i: oOptions.instrument, m: oOptions.mission.ID }
    )
    const oHttp = new cHttp2()
    bean.on(oHttp, 'result', function (poHttp) { oThis.onThumbsJS(poHttp) })
    oHttp.fetch_json(sUrl)
  },

  // #################################################################
  // # methods
  // #################################################################
  stop_queue: function () {
    goBetterThumbQueue.stop()				// have to use a global otherwise cant reset the queue
  },

  // #################################################################
  // # Events
  // #################################################################
  onThumbsJS: function (poHttp) {
    let i, aData, oItem
    const oThis = this
    const oElement = oThis.element

    cDebug.write('got basic thumbnails')
    this._trigger('onStatus', null, { text: 'got basic thumbnails' })
    this._trigger('onBasicThumbnail')

    // ok load the thumbnails
    oElement.empty()

    aData = poHttp.response.d.data
    if (aData.length == 0) {
      const oDiv = $('<DIV>', { class: 'ui-state-error' })
      oDiv.append('Sorry no thumbnails found')
      oElement.append(oDiv)
      this._trigger('onStatus', null, { text: 'No thumbnails found' })
      cDebug.write('no got basic thumbnails')
    } else {
      goBetterThumbQueue.reset()				// have to use a global otherwise cant reset the queue

      for (i = 0; i < aData.length; i++) {
        oItem = aData[i]
        const oThumbnailWidget = $('<SPAN>').thumbnail({
          sol: poHttp.response.s,
          instrument: oItem.data.instrument,
          product: oItem.p,
          url: oItem.i,
          mission: this.options.mission,
          onStatus: function (poEvent, poData) { oThis._trigger('onStatus', poEvent, poData) },
          onClick: function (poEvent, poData) { oThis.onThumbClick(poEvent, poData) }
        })

        // draw the widget;
        oElement.append(oThumbnailWidget)
      }
    }
  },

  //* ***********************************************************************
  onThumbClick: function (poEvent, poData) {
    this.stop_queue()
    this._trigger('onClick', poEvent, poData)
  }

})
