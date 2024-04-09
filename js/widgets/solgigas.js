// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.solgigas', {
  // #################################################################
  // # Definition
  // #################################################################
  options: {
    mission: null,
    sol: null
  },

  // #################################################################
  // # Constructor
  // #################################################################
  _create: function () {
    const oThis = this
    const oOptions = this.options
    const oElement = this.element

    // check for necessary classes
    if (!bean) {				$.error('bean class is missing! check includes')	}
    if (!cHttp2) {			$.error('http2 class is missing! check includes')	}
    if (!oElement.gSpinner) { 	$.error('gSpinner is missing! check includes')		}

    // check that the options are passed correctly
    if (oOptions.mission == null) $.error('mission is not set')
    if (oOptions.sol == null) $.error('sol is not set')
    oElement.uniqueId()

    // check that the element is a div
    const sElementName = oElement.get(0).tagName
    if (sElementName !== 'DIV') { $.error('needs a DIV. this element is a: ' + sElementName) }

    // clear out the DIV and put some text in it
    oElement.empty()

    const oLoader = $('<DIV>')
    oLoader.gSpinner({ scale: 0.25 })
    oElement.append(oLoader).append('Loading sol gigas:')

    // get the sols with Tags
    const oHttp = new cHttp2()
    bean.on(oHttp, 'result', 	function (poHttp) { oThis.onGigaResponse(poHttp) })
    sUrl = cBrowser.buildUrl(cLocations.rest + '/gigapans.php', { s: oOptions.sol, o: 'sol', m: cMission.ID })
    oHttp.fetch_json(sUrl)
  },

  // #################################################################
  // # Events
  // #################################################################
  onGigaResponse: function (poHttp) {
    const oThis = this
    const oOptions = this.options
    const oElement = this.element
    const aData = poHttp.response

    // --------------------------------------------------------------
    oElement.empty()
    if (aData == null) {
      const oDiv = $('<DIV>', { class: 'ui-state-error' })
      oDiv.append('Sorry no data was found')
      oElement.append(oDiv)
      return
    }

    // --------------------------------------------------------------
    for (let i = 0; i < aData.length; i++) {
      aItem = aData[i]
      sGigaID = aItem.I
      sIUrl = 'http://static.gigapan.org/gigapans0/' + sGigaID + '/images/' + sGigaID + '-800x279.jpg'
      sGUrl = 'http://www.gigapan.com/gigapans/' + sGigaID

      var oNewDiv = $('<DIV>', { class: 'ui-widget-header' })
      oA = $('<a>', { target: 'giga', href: sGUrl })
      oA.append(aItem.D)
      oNewDiv.append(oA)
      oElement.append(oNewDiv)

      var oNewDiv = $('<DIV>', { class: 'ui-widget-body' })
      var oA = $('<a>', { target: 'giga', href: sGUrl })
      const oImg = $('<img>', { src: sIUrl })
      oA.append(oImg)
      oNewDiv.append(oA)
      oNewDiv.append('<br>')

      oElement.append(oNewDiv)
      oElement.append('<p>')
    }
  }

})
