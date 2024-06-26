// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
$.widget('ck.solinstrumentChooser', {
  // #################################################################
  // # Definition
  // #################################################################
  options: {
    sol: null,
    instrument: null,
    previous_instrument: null,
    onSelect: null,
    onStatus: null,
    mission: null
  },
  consts: {
    THIS_SOL_ID:	'ts',
    SOL_SUMMARY_ID:	'ss',
    SOL_LIST_ID:	'sl',
    MISSIONS_ID:	'mi',
    LATEST_ID:	'la',
    INSTR_ID:	'i',
    SOL_DIVISIONS: 50
  },

  // #################################################################
  // # Constructor
  // #################################################################
  _create: function () {
    // check for necessary classes
    if (!bean) {		$.error('bean class is missing! check includes')	}
    if (!cHttp2) {	$.error('http2 class is missing! check includes')	}
    if (this.options.mission == null) $.error('mission is not set')

    this.render()
    this.prLoadLists()
  },

  //* ******************************************************************
  render: function () {
    let oThis, oElement, sID, sOID, oObj, oList, oHead, oDiv

    oThis = this
    oElement = oThis.element
    oElement.uniqueId()
    sID = oElement.attr('id')

    oElement.empty()
    oElement.addClass('ui-widget')

    // Missions  part of the widget
    oDiv = $('<DIV>', { class: 'ui-widget-content' })
    oHead = $('<DIV>', { class: 'ui-widget-header' })
    oHead.append('Missions: ')
    oDiv.append(oHead)
    oList = $('<SELECT>', { id: sID + this.consts.MISSIONS_ID })
    oList.append($('<Option>', { selected: true, value: 'MSL' }).append('Mars Science Lab (Curiosity)'))
    oDiv.append(oList)
    oElement.append(oDiv)

    // sols part of the widget
    oDiv = $('<DIV>', { class: 'ui-widget-content' })
    oHead = $('<DIV>', { class: 'ui-widget-header' })
    oHead.append('Sol: ')
    sOID = sID + this.consts.THIS_SOL_ID
    oHead.append($('<SPAN>', { id: sOID }).append('???'))
    oDiv.append(oHead)

    oList = $('<SELECT>', { id: sID + this.consts.SOL_SUMMARY_ID })
    oList.append($('<Option>').append('loading...'))
    oDiv.append(oList)

    oList = $('<SELECT>', { id: sID + this.consts.SOL_LIST_ID })
    oList.append($('<Option>').append('loading...'))
    oDiv.append(oList)

    let oTable, oRow, oCell, oButton
    oTable = $('<TABLE>', { border: 0, width: '100%' })
    oRow = $('<TR>')
    oCell = $('<TD>', { align: 'left' })
    oButton = $('<button>', { class: 'solnav leftarrow', title: 'previous Sol ([)' })
    oButton.click(function () { oThis.onPreviousSolClick() })
    oCell.append(oButton)
    oRow.append(oCell)

    sOID = sID + this.consts.LATEST_ID
    oCell = $('<TD>', { align: 'middle' })
    oButton = $('<button>', { class: 'roundbutton', title: 'latest', disabled: 'disabled', id: sOID }).append('latest')
    oButton.click(function () { oThis.onLatestSolClick() })
    oCell.append(oButton)
    oRow.append(oCell)

    oCell = $('<TD>', { align: 'right' })
    oButton = $('<button>', { class: 'solnav rightarrow', title: 'Next Sol (])' })
    oButton.click(function () { oThis.onNextSolClick() })
    oCell.append(oButton)
    oRow.append(oCell)

    oTable.append(oRow)
    oDiv.append(oTable)
    oElement.append(oDiv)

    // instrument part of the widget
    oDiv = $('<DIV>', { class: 'ui-widget-content' })
    oHead = $('<DIV>', { class: 'ui-widget-header' }).append('Instruments')
    oElement.append(oHead)

    oList = $('<SELECT>', { id: sID + this.consts.INSTR_ID })
    oList.append($('<Option>').append('loading...'))
    oDiv.append(oList)

    oElement.append(oDiv)
  },

  // #################################################################
  // # methods
  // #################################################################
  deselectInstrument: function () {
    const sID = this.element.attr('id')
    const sListID = sID + this.consts.INSTR_ID
    $('#' + sListID + ' option:first').prop('selected', true)
    this.options.instrument = null
  },

  // #################################################################
  // # Privates
  // #################################################################
  set_sol: function (psSol) {
    const sID = this.element.attr('id') + this.consts.SOL_LIST_ID
    const sSelector = '#' + sID + ' option[value=' + psSol + ']'
    const oOption = $(sSelector)
    if (oOption.length == 0) { this._trigger('onStatus', null, { data: 'no such sol' + psSol }) } else {
      oOption.attr('selected', true)		// select the options
      oOption.change()					// kick the OnChangeSolList change handler
    }
  },

  //* ****************************************************************
  get_sol_instruments: function (psSol) {
    const oThis = this
    const sListID = this.element.attr('id') + this.consts.INSTR_ID

    this._trigger('onStatus', null, { data: 'getting instruments for sol' + psSol })

    // hide instruments jQUERY
    $('#' + sListID + ' option').each(
      function (pIndex, pObj) { $(pObj).attr({ disabled: 'disabled' }) }
    )

    // get the instruments for this sol
    const sUrl = cBrowser.buildUrl(cLocations.rest + '/instruments.php', { s: psSol, r: 0, m: this.options.mission.ID })
    const oHttp = new cHttp2()
    bean.on(oHttp, 'result', function (poHttp) { oThis.onLoadSolInstruments(poHttp) })
    oHttp.fetch_json(sUrl)
  },

  // #################################################################
  // # Privates
  // #################################################################
  prLoadLists: function () {
    const oThis = this

    const oHttp = new cHttp2()
    bean.on(oHttp, 'result', function (poHttp) { oThis.onLoadInstruments(poHttp) })
    var sUrl = cBrowser.buildUrl(cLocations.rest + '/instruments.php', { m: this.options.mission.ID })
    oHttp.fetch_json(sUrl)

    const oHttp2 = new cHttp2()
    bean.on(oHttp2, 'result', function (poHttp) { oThis.onLoadSols(poHttp) })
    var sUrl = cBrowser.buildUrl(cLocations.rest + '/sols.php', { m: this.options.mission.ID })
    oHttp2.fetch_json(sUrl)
  },

  // #################################################################
  // # button Events
  // #################################################################
  onPreviousSolClick: function () {
    const sID = this.element.attr('id')

    let oSelected, oPrev
    const sListID = sID + this.consts.SOL_LIST_ID

    oSelected = $('#' + sListID + ' option:selected')
    if (oSelected.length == 0)	{
      this._trigger('onStatus', null, { text: 'Select a sol!!!' })
      return true
    }

    oPrev = oSelected.prev('option')
    if (oPrev.attr('disabled') == 'disabled') { oPrev = oPrev.prev('option') }		// skip over disabled items

    if (oPrev.length > 0) { oPrev.prop('selected', true).change() }

    return false
  },

  //* ****************************************************************
  onLatestSolClick: function () {
    const sID = this.element.attr('id')
    cDebug.write('setting latest sol: ')

    // deslect instruments
    this.deselectInstrument()

    // select the list item
    const sListID = sID + this.consts.SOL_LIST_ID
    $('#' + sListID + ' :last').prop('selected', true).change() // call the change event on the sol list
  },

  //* ****************************************************************
  onNextSolClick: function () {
    let oSelected, oNext
    const sID = this.element.attr('id')
    const sListID = sID + this.consts.SOL_LIST_ID

    oSelected = $('#' + sListID + ' option:selected')
    if (oSelected.length == 0)	{
      this._trigger('onStatus', null, { text: 'Select a sol!!!' })
      return true
    }

    oNext = oSelected.next('option')
    if (oNext.attr('disabled') == 'disabled') { oNext = oNext.next('option') } // skip over disabled items

    if (oNext.length > 0) { oNext.prop('selected', true).change() }

    return false
  },

  //* ****************************************************************
  onKeypress: function (poEvent) {
    if (poEvent.target.tagName === 'INPUT') return

    const sChar = String.fromCharCode(poEvent.which)

    switch (sChar) {
      case '[': this.onPreviousSolClick(); break
      case ']': this.onNextSolClick(); break
    }
  },

  //* ****************************************************************
  OnChangeSolList: function (poEvent) {
    this.options.sol = poEvent.target.value
    if (this.options.instrument) {
      this.options.previous_instrument = this.options.instrument
      this.deselectInstrument()
    } else { this._trigger('onSelect', null, { sol: this.options.sol, instrument: this.options.instrument }) }

    // update the caption on the Sol Chooser
    const sID = this.element.attr('id') + this.consts.THIS_SOL_ID
    $('#' + sID).html(this.options.sol)

    // next step in workflow
    this.get_sol_instruments(poEvent.target.value)
  },

  //* ****************************************************************
  OnChangeSolSummaryList: function (poEvent) {
    this.set_sol(poEvent.target.value)
  },

  //* ****************************************************************
  OnChangeInstrList: function (poEvent) {
    this.options.instrument = poEvent.target.value
    this._trigger('onSelect', null, { sol: this.options.sol, instrument: this.options.instrument })
  },

  // #################################################################
  // # data Events
  // #################################################################
  onError: function (poHttp) {
    this._trigger('onStatus', null, { data: 'error when fetching: ' + poHttp.url })
  },

  //* ****************************************************************
  onLoadSolInstruments: function (poHttp) {
    let i, sInstr, oList, oJson

    this._trigger('onStatus', null, { data: 'got instruments for sol' + this.options.sol })

    oJson = poHttp.response
    const sID = this.element.attr('id')
    oList = $('#' + sID + this.consts.INSTR_ID)

    // mark the instruments remaining
    for (i = 0; i < oJson.length; i++) {
      sInstr = oJson[i]
      oList.find('option[value=\"' + sInstr + '\"]').removeAttr('disabled')
    }

    // select the instrument previously selected
    if (this.options.previous_instrument) {
      const oItem = oList.find('option[value=\"' + this.options.previous_instrument + '\"]')
      if (oItem.length > 0) {
        oList.val(this.options.previous_instrument)
        oList.change()
      }
    }
  },

  //* ****************************************************************
  onLoadInstruments: function (poHttp) {
    var i, oInstr, oList, sID
    const oThis = this

    const aData = poHttp.response

    var sID = this.element.attr('id')
    oList = $('#' + sID + this.consts.INSTR_ID)
    oList.empty()

    oList.append($('<option>', { value: '', disabled: 'disabled' }).html('Select an Instrument...'))

    for (i = 0; i < aData.length; i++) {
      oInstr = aData[i]
      oList.append($('<option>', { value: oInstr.name, disabled: 'disabled' }).html(oInstr.caption))
    }

    // click the buttons if stuff was passed in the query string
    if (cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING]) {
      const sInstr = cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING]
      oList.find('option[value=\"' + sInstr + '\"]').attr('selected', true)
    }

    // set up change handler
    oList.change(function (poEvent) { oThis.OnChangeInstrList(poEvent) })
  },

  //* ****************************************************************
  onLoadSols: function (poHttp) {
    let i, oSol, oList, oSumList, oOption, iSol, iLastRange, iRange
    const oThis = this

    const aData = poHttp.response

    const sID = this.element.attr('id')
    oList = $('#' + sID + this.consts.SOL_LIST_ID)
    oList.empty()

    oSumList = $('#' + sID + this.consts.SOL_SUMMARY_ID)
    oSumList.empty()
    iLastRange = -1

    for (i = 0; i < aData.length; i++) {
      oSol = aData[i]
      iSol = parseInt(oSol.sol)
      iRange = Math.floor(iSol / this.consts.SOL_DIVISIONS)

      if (iRange != iLastRange) {
        oOption = $('<option>', { value: iSol }).html(oSol.sol + ' to ...')
        oSumList.append(oOption)

        oOption = $('<option>', { value: 'NaN', disabled: 'disabled' }).html('-- ' + oSol.sol + ' --')
        oList.append(oOption)
        iLastRange = iRange
      }

      oOption = $('<option>', { value: oSol.sol }).html(oSol.sol)
      oList.append(oOption)
    }

    // enable latest button
    sOID = sID + this.consts.LATEST_ID
    $('#' + sOID).removeAttr('disabled')

    // set up the change handler
    oSumList.change(function (poEvent) { oThis.OnChangeSolSummaryList(poEvent) })
    oList.change(function (poEvent) { oThis.OnChangeSolList(poEvent) })

    // select the sol and instrument if there on the querystring
    if (cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING]) { this.options.instrument = cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING] }
    if (cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]) { this.set_sol(cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]) }

    this._on(window, {	keypress: function (poEvent) { oThis.onKeypress(poEvent) } })
  }

})
