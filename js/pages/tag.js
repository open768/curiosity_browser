/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/
"use strict"

//###############################################################
//# Utility functions
//###############################################################
//eslint-disable-next-line no-unused-vars
function onLoadJQuery_TAG() {
   const sTag = cBrowser.data.t

   // get the data for the page
   $("#tagname").html(sTag)
   $("#tagcloud").tagcloud({ mission: cMission })
   $("#tagdata").tagview({
      tag: sTag,
      onClick: onImageClick,
      onStatus: onStatusEvent,
      mission: cMission,
   })
}

//***************************************************************
function onStatusEvent(poEvent, paHash) {
   cCommonStatus.set_status(paHash.text)
}

//***************************************************************
function onImageClick(poEvent, poOptions) {
   const sUrl = cBrowser.buildUrl("detail.php", {
      s: poOptions.sol,
      i: poOptions.instrument,
      p: poOptions.product,
   })
   cBrowser.openWindow(sUrl, "detail")
}
