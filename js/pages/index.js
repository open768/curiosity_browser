/****************************************************************************
Copyright (C) Chicken Katsu 2016 www.chickenkatsu.co.uk

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

const IMAGE_CONTAINER_ID = 'images'
const CHKTHUMBS_ID = 'chkThumbs'
let keep_start_image = true

const cOptions = {
  start_image: 1,
  sol: null,
  instrument: null
}

// ###############################################################
//* JQUERY
// ###############################################################
//eslint-disable-next-line no-unused-vars
class cIndexPage {

  static onLoadJQuery() {
    const self = this
    // show the intro blurb if nothing on the querystring
    if (document.location.search.length == 0) { $('#intro').show() }

    // load the tabs and show the first one
    cAppTabs.instrumentTabs()
    $('#sol-tab').show()

    // remember the start_image if its there
    if (cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING]) {
      cOptions.start_image = parseInt(cBrowser.data[cSpaceBrowser.BEGIN_QUERYSTRING])
    }

    // render the sol instrument chooser widget
    // this widget will kick off the image display thru onSelectSolInstrEvent
    $('#sichooser').solinstrumentChooser({
      onStatus(poEvent, paHash) { self.onStatusEvent(poEvent, paHash) },
      onSelect(poEvent, poData) { self.onSelectSolInstrEvent(poEvent, poData) },
      mission: cMission
    })

    // render the solbuttons
    $('#solButtons').solButtons({
      onStatus(poEvent, paHash) { self.onStatusEvent(poEvent, paHash) },
      mission: cMission,
      onClick() { self.stop_queue() },
      onAllSolThumbs() { self.onClickAllSolThumbs() }
    })

    // disable thumbs checkbox until something happens
    $('#' + CHKTHUMBS_ID).attr('disabled', 'disabled')

    // set up keypress monitor
    $('#search_text').keypress(function (e) { self.onSearchKeypress(e) })

    // load tagcloud
    $('#tags').tagcloud({ mission: cMission })
  }

  // ###############################################################
  // # Event Handlers
  // ###############################################################
  static onClickAllSolThumbs() {
    this.stop_queue()
    cOptions.instrument = null
    cOptions.start_image = -1
    $('#' + CHKTHUMBS_ID).prop('checked', true).attr('disabled', 'disabled')
    $('#sichooser').solinstrumentChooser('deselectInstrument')
    this.load_data()
  }

  //* **************************************************************
  static onSearchKeypress(e) {
    this.stop_queue()
    if (e.which == 13) this.onClickSearch()
  }

  //* **************************************************************
  static onClickSearch() {
    this.stop_queue()
    const sText = $('#search_text').val()
    if (sText == '') return
    cOptions.instrument = null

    if (!isNaN(sText)) { $('#sichooser').solinstrumentChooser('set_sol', sText) } else {
      const sUrl = cBrowser.buildUrl(cLocations.rest + '/search.php', { s: sText, m: cMission.ID })
      const oHttp = new cHttp2()
      bean.on(oHttp, 'result', ()=>this.search_callback())
      oHttp.fetch_json(sUrl)
    }
  }

  //* **************************************************************
  static onCheckThumbsEvent() {
    this.stop_queue()
    this.load_data()
  }

  //* **************************************************************
  static onImageClick(poEvent, poOptions) {
    this.stop_queue()
    const sUrl = cBrowser.buildUrl('detail.php', { s: poOptions.sol, i: poOptions.instrument, p: poOptions.product })
    cBrowser.openWindow(sUrl, 'detail')
  }

  //* **************************************************************
  static onSelectSolInstrEvent(poEvent, poData) {
    this.stop_queue()
    // load the data
    cDebug.write('selected sol ' + poData.sol)
    cOptions.sol = poData.sol
    cDebug.write('selected instr ' + poData.instrument)
    cOptions.instrument = poData.instrument
    if (!keep_start_image) cOptions.start_image = 1
    keep_start_image = false
    this.load_data()
  }

  //* **************************************************************
  static onStatusEvent(poEvent, paHash) {
    cCommonStatus.set_status(paHash.data)
  }

  //* **************************************************************
  static onThumbClickEvent(poEvent, poData) {
    this.stop_queue()
    const sUrl = cBrowser.buildUrl('detail.php', { s: poData.sol, i: poData.instr, p: poData.product })
    cDebug.write('loading page ' + sUrl)
    $('#' + IMAGE_CONTAINER_ID).empty().html('redirecting to: ' + sUrl)
    setTimeout(
      function () { cBrowser.openWindow(sUrl, 'detail') },
      0
    )
  }

  //* **************************************************************
  static onImagesLoadedEvent(poEvent, piStartImage) {
    // enable thumbnails
    $('#solthumbs').removeAttr('disabled')
    cOptions.start_image = piStartImage
    this.update_url()
  }

  // ###############################################################
  // # Utility functions
  // ###############################################################
  static update_url() {
    const oParams = {}
    oParams[cSpaceBrowser.SOL_QUERYSTRING] = cOptions.sol
    if (cOptions.instrument) oParams[cSpaceBrowser.INSTR_QUERYSTRING] = cOptions.instrument
    if (this.is_thumbs_checked()) oParams[cSpaceBrowser.THUMB_QUERYSTRING] = '1'
    if (cOptions.start_image) oParams[cSpaceBrowser.BEGIN_QUERYSTRING] = cOptions.start_image
    const sUrl = cBrowser.buildUrl(cBrowser.pageUrl(), oParams)
    cBrowser.pushState('Index', sUrl)
  }

  //* **************************************************************
  static stop_queue() {
    let oDiv
    try {
      oDiv = $('#' + IMAGE_CONTAINER_ID)
      oDiv.thumbnailview('stop_queue')
    } catch (e) {/* do nothing*/ }
  }

  //* **************************************************************
  static is_thumbs_checked() {
    return $('#' + CHKTHUMBS_ID).is(':checked')
  }

  //* **************************************************************
  static load_data() {
    let oChkThumb
    const self = this
    this.update_url()

    cDebug.write('loading data: ' + cOptions.sol + ':' + cOptions.instrument)

    $('#solButtons').solButtons('set_sol', cOptions.sol)
    oChkThumb = $('#' + CHKTHUMBS_ID)

    if (cOptions.instrument) {
      oChkThumb.removeAttr('disabled')
      oChkThumb.off('change')
      if (cBrowser.data[cSpaceBrowser.THUMB_QUERYSTRING]) {
        oChkThumb.prop('checked', true)
        this.show_thumbs(cOptions.sol, cOptions.instrument)
      } else { this.show_images(cOptions.sol, cOptions.instrument, cOptions.start_image) }
      oChkThumb.on('change', function (poEvent) { self.onCheckThumbsEvent(poEvent) })
    } else {
      oChkThumb.attr('disabled', 'disabled')
      this.show_thumbs(cOptions.sol, cSpaceBrowser.ALL_INSTRUMENTS)
    }
  }

  // ###############################################################
  //* GETTERS
  // ###############################################################
  static show_thumbs(psSol, psInstrument) {
    var oDiv
    cDebug.write('showing  thumbs for ' + psSol + ' : ' + psInstrument)
    const self = this

    oDiv = $('#' + IMAGE_CONTAINER_ID)
    if (oDiv.length == 0) $.error('image DIV not found ')

    if (oDiv.thumbnailview('instance') != undefined) { oDiv.thumbnailview('destroy') }

    cDebug.write('creating widget')
    oDiv.thumbnailview({		 // apply widget
      sol: psSol,
      instrument: psInstrument,
      onStatus(poEvent, paHash) { self.onStatusEvent(poEvent, paHash) }, 			// TODO replace with events
      onClick(poEvent, poData) { self.onThumbClickEvent(poEvent, poData) },
      mission: cMission
    })
  }

  //* **************************************************************
  static show_images(piSol, psInstr, piStartImage) {
    const oThis = this
    cDebug.write('showing  images for ' + piSol + ' : ' + psInstr)

    var oWidget, oDiv

    oDiv = $('#' + IMAGE_CONTAINER_ID)
    if (oDiv.length == 0) $.error('image DIV not found')

    oWidget = oDiv.data('ckImageview')
    if (oWidget) { oWidget.destroy() }

    cDebug.write('creating widget')
    oWidget = oDiv.imageview({		 // apply widget
      sol: piSol,
      instrument: psInstr,
      start_image: piStartImage,
      onStatus(poEvent, paHash) { oThis.onStatusEvent(poEvent, paHash) },
      onLoaded(poEvent, piStartImage) { oThis.onImagesLoadedEvent(poEvent, piStartImage) },
      onClick(poEvent, poOptions) { oThis.onImageClick(poEvent, poOptions) },
      mission: cMission
    })
  }

  // ###############################################################
  //* call backs
  // ###############################################################
  static search_callback(poHttp) {
    var sUrl

    const oData = poHttp.response
    if (!oData) { cCommonStatus.set_status('not a valid search') } else {
      cCommonStatus.set_status('got search callback')
      sUrl = cBrowser.buildUrl('detail.php', { s: oData.s, i: oData.d.instrument, p: oData.d.itemName })
      document.location.href = sUrl
    }
  }
}
