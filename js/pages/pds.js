/**************************************************************************
Copyright (C) Chicken Katsu 2014

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

const loading = true

let goPds = null

// ###############################################################
// # Event Handlers
// ###############################################################

//* **************************************************************

function onClickEDRLBL () {
  if (!has_pds_url()) return
  window.open(goPds.u, 'EDR')
}

function onClickDetail () {
  var sSol, sInstr, sProduct, sUrl

  sInstr = cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING]
  sProduct = cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING]
  sSol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]

  var sUrl = cBrowser.buildUrl('detail.php',	{ s: sSol, i: sInstr, p: sProduct })
  cBrowser.openWindow(sUrl, 'detail')
}

//* **************************************************************
function onClickNotebook () {
  if (!has_pds_url()) return
  cDebug.write(goPds.notebook)
  window.open(goPds.notebook, 'notebook')
}

// ###############################################################
// # Utility functions
// ###############################################################
function onLoadJQuery_PDS () {
  cCommonStatus.set_status('loading pds data...')

  const sUrl = cBrowser.buildUrl(
    cLocations.rest + '/pds.php',
    {
      a: 's',
      s: cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING],
      i: cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING],
      p: cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING],
      m: cMission.ID
    }
  )
  const oHttp = new cHttp2()
  bean.on(oHttp, 'result', get_pds_callback)
  oHttp.fetch_json(sUrl)
}

function has_pds_url () {
  if (!goPds) { cCommonStatus.set_error_status('Whoa no PDS link found yet') }
  return goPds
}

// ###############################################################
//* call backs
// ###############################################################
function get_pds_callback (poHttp) {
  const oData = poHttp.response
  if (oData == null) { cCommonStatus.set_error_status('no PDS data found') } else {
    cCommonStatus.set_status('PDS data found: OK')
    goPds = oData

    $('#PDS_FRAME').attr('src', goPds.u)

    $('#PDS_Images').empty()
    $('#PDS_Images').append($('<a>', { href: goPds.rdr, target: 'pds' }).append(goPds.rdr))
    $('#PDS_Images').append('<BR>')
    $('#PDS_Images').append($('<IMG>', { src: goPds.rdr }))
  }
}
