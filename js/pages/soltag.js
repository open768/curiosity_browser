/**************************************************************************
Copyright (C) Chicken Katsu 2014

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
"use strict";

let current_sol = null
// ###############################################################
// # event handlers
// ###############################################################
//eslint-disable-next-line no-unused-vars
function onClickAllSols () {
  cBrowser.openWindow('allsoltags.php', 'allsoltags')
}

// ###############################################################
// # Utility functions
// ###############################################################
//eslint-disable-next-line no-unused-vars
function onLoadJQuery_SOLTAG () {
  let sUrl, sSol

  // update sol number
  sSol = cBrowser.data.s

  sUrl = cBrowser.buildUrl('index.php', { s: sSol })
  $('#sol').html("<a href='" + sUrl + "'>" + sSol + '</a>')
  current_sol = sSol

  // load tags
  sUrl = cBrowser.buildUrl(cLocations.rest + '/tag.php', { s: sSol, o: 'sol', m: cMission.ID })
  cCommonStatus.set_status('fetching tags')

  const oHttp = new cHttp2()
  bean.on(oHttp, 'result', load_soltag_callback)
  oHttp.fetch_json(sUrl)
}

// ###############################################################
//* call backs
// ###############################################################
function load_soltag_callback (poHttp) {
  let sInstr, aTags, i, sProduct, sTag, oItem, sTagUrl, sProductURL
  let oDiv

  oDiv = $('#soltag')
  oDiv.empty()
  const aData = poHttp.response

  if (aData == null) {
    oDiv.append('No Tags Found')
    return
  }

  for (sInstr in aData) {
    oDiv.append('<h2>' + sInstr + '</h2>')
    aTags = aData[sInstr]

    for (i = 0; i < aTags.length; i++) {
      oItem = aTags[i]
      sProduct = oItem.p
      sTag = oItem.t
      sTagUrl = "<a href='tag.php?t=" + sTag + "'>" + sTag + '</a>'
      sProductURL = "<a href='detail.php?s=" + current_sol + '&i=' + sInstr + '&p=' + sProduct + "'>" + sProduct + '</a>'
      oDiv.append(sTagUrl + ' in ' + sProductURL + '<br>')
    }
  }

  cCommonStatus.set_status('ok')
}
