// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// % Definition
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.soltags', {
  // #################################################################
  // # Definition
  // #################################################################
  options: {
    mission: null,
    aSolsWithTags: null
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
    oElement.uniqueId()

    // check that the element is a div
    const sElementName = oElement.get(0).tagName
    if (sElementName !== 'DIV') { $.error('needs a DIV. this element is a: ' + sElementName) }

    // clear out the DIV and put some text in it
    oElement.empty()

    const oLoader = $('<DIV>')
    oLoader.gSpinner({ scale: 0.25 })
    oElement.append(oLoader).append('Loading sol tags:')

    // get the sols with Tags
    const oHttp = new cHttp2()
    bean.on(oHttp, 'result', 	function (poHttp) { oThis.onTagResponse(poHttp) })
    const sUrl = cBrowser.buildUrl(cLocations.rest + '/tag.php', { o: 'topsolindex', m: oOptions.mission.ID })
    oHttp.fetch_json(sUrl)
  },

  // #################################################################
  // # Events
  // #################################################################
  onTagResponse: function (poHttp) {
    const oThis = this
    const oOptions = this.options
    const oElement = this.element

    oOptions.aSolsWithTags = poHttp.response

    if (oOptions.aSolsWithTags == null) {
      oElement.empty()
      oElement.attr('class', '.ui-state-error')
      oElement.append('No Tag information found')
    } else {
      oElement.append('<br>')
      oElement.append('loading Sols...')

      const sUrl = cBrowser.buildUrl(cLocations.rest + '/sols.php', { m: oOptions.mission.ID })
      const oHttp = new cHttp2()
      bean.on(oHttp, 'result', function (poHttp) { oThis.onSolsResponse(poHttp) })
      oHttp.fetch_json(sUrl)
    }
  },

  //* *************************************************************
  onSolsResponse: function (poHttp) {
    const oThis = this
    const oOptions = this.options
    const oElement = this.element
    const aData = poHttp.response
    let sSol, i

    oElement.empty()
    for (i = 0; i < aData.length; i++) {
      sSol = aData[i].sol.toString()
      const oDiv = $('<DIV>', { class: 'solbuttonDiv' })

      if (oOptions.aSolsWithTags[sSol]) {
        const oButton = $('<button>', { class: 'solbutton', sol: sSol }).append(sSol)
        oButton.click(function (poEvent) { oThis.onButtonClick(poEvent) })
        oDiv.append(oButton)
      } else {
        const sUrl = cBrowser.buildUrl('index.php', { s: sSol })
        const oA = $('<a>', { href: sUrl }).append(sSol)
        oDiv.append(oA)
      }

      oElement.append(oDiv)
    }
  },

  //* *************************************************************
  onButtonClick: function (poEvent) {
    const oButton = $(poEvent.target)
    const sSol = oButton.attr('sol')
    const sUrl = cBrowser.buildUrl('soltag.php', { s: sSol })
    cBrowser.openWindow(sUrl, 'soltag')
  }

})
