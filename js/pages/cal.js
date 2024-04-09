/**************************************************************************
Copyright (C) Chicken Katsu 2014

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

const loading = true

let current_sol = null
const current_date = null
const oColours = {}

// ###############################################################
// # Event Handlers
// ###############################################################
function onClickGotoSol () {
  const sUrl = cBrowser.buildUrl('index.php', { s: current_sol })
  cBrowser.openWindow(sUrl, 'index')
}

function onClickNext () {
  current_sol = parseInt(current_sol) + 1
  load_widget()
}

function onClickPrevious () {
  current_sol = parseInt(current_sol) - 1
  load_widget()
}

function onClickRefresh () {
  cCommonStatus.set_status('refreshing data')

  const sUrl = cBrowser.buildUrl(cLocations.rest + '/instruments.php', { s: current_sol, r: 'true', m: cMission.ID }) // force a refresh on the server
  const oHttp = new cHttp2()
  bean.on(oHttp, 'result', onLoadJQuery_CAL)
  oHttp.fetch_json(sUrl)
}

function onLoadedCal (poEvent, psSol) {
  current_sol = psSol
  $('#gotoSOL').html(psSol)
  $('#sol').html(psSol)
  const sURL = cBrowser.buildUrl(cBrowser.pageUrl(), { s: current_sol })
  cBrowser.pushState('calendar', sURL)
}

function onClickCal (poEvent, poData) {
  const sUrl = cBrowser.buildUrl('detail.php', poData)
  cBrowser.openWindow(sUrl, 'detail')
}

// ###############################################################
// # Utility functions
// ###############################################################
function onLoadJQuery_CAL () {
  current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING]
  load_widget()
}

function load_widget () {
  const oDiv = $('#calendar')
  var oWidget = oDiv.data('ckSolcalendar')	// capitalise the first letter of the widget
  if (oWidget)	oWidget.destroy()
  $('#calendar').solcalendar({
    mission: cMission,
    sol: current_sol,
    onLoadedCal,
    onClick: onClickCal
  })
}
