"use strict"

/**************************************************************************
Copyright (C) Chicken Katsu 2013 - 2024

This code is protected by copyright under the terms of the
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var aSites = null
const aHirise = []
var bPluginLoaded = false
var oCentre = null
const sSiteColor = "ffff0000"
const sHiriseColor = "ff00ff00"
const sSelectedHiriseColor = "ff0000ff"
var oSelectedHiRise = null

// ###############################################################
// # Utility functions
// ###############################################################
//eslint-disable-next-line no-unused-vars
function onLoadJQuery_SITES() {
   cCommonStatus.set_status("initialising Google Earth")
   cGoogleEarth.callback = onGoogleEarthLoaded
   cGoogleEarth.init("map")
}

function onGoogleEarthLoaded() {
   cCommonStatus.set_status("retrieving sites")
   const sUrl = cBrowser.buildUrl(cAppLocations.rest + "/sites.php", {
      o: "allSitesBounds",
      m: cMission.ID,
   })
   const oHttp = new cHttp2()
   bean.on(oHttp, "result", all_sites_callback)
   oHttp.fetch_json(sUrl)
}

// ###############################################################
//* call backs
// ###############################################################
function all_sites_callback(poHttp) {
   var oBounds
   var oSelect, oOption
   const oData = poHttp.response

   $("#sites").empty()
   if (oData.d == null) {
      cCommonStatus.set_error_status("No sites found")
   } else {
      aSites = oData.d

      oSelect = $("<SELECT>")
      for (var i = 0; i < aSites.length; i++) {
         oBounds = aSites[i]
         if (oBounds != null) {
            oOption = $("<option>").attr({ value: i })
            oOption.html(i)
            oSelect.append(oOption)
         }
      }

      // add reset option
      oOption = $("<option>").attr({ value: "reset" })
      oOption.html("Reset Zoom")
      oSelect.append(oOption)

      $("#sites").append(oSelect)
      oSelect.change(onClickSite)

      render_sites()
   }
}

//* ***************************************************************
function render_sites() {
   var i, oBounds, sLink, oPlace
   var fAll = null
   var bFirst = true

   cCommonStatus.set_status("adding placemarks")

   for (i = 0; i < aSites.length; i++) {
      // create button to interact with site
      oBounds = aSites[i]
      if (oBounds == null) continue

      // add to overall bounds
      if (bFirst) {
         fAll = {
            lat1: oBounds.lat1,
            long1: oBounds.long1,
            lat2: oBounds.lat2,
            long2: oBounds.long2,
         }
         bFirst = false
      } else {
         fAll.lat1 = Math.min(fAll.lat1, oBounds.lat1)
         fAll.long1 = Math.min(fAll.long1, oBounds.long1)
         fAll.lat2 = Math.max(fAll.lat2, oBounds.lat2)
         fAll.long2 = Math.max(fAll.long2, oBounds.long2)
      }

      // make the placemark
      var fLat = (oBounds.lat1 + oBounds.lat2) / 2
      var fLong = (oBounds.long1 + oBounds.long2) / 2
      sLink = '<a href="site.php?o=site&site=' + i + '">click here</a>'
      oPlace = cGoogleEarth.makePlacemark(
         fLat,
         fLong,
         "site: " + i,
         "To see more details " + sLink,
      )

      oBounds.place = oPlace

      // draw bounds
      oPlace = cGoogleEarth.makeRect(oBounds)
      cGoogleEarth.setLineColour(oPlace, sSiteColor)
   }
   // get the hirise targets
   cCommonStatus.set_status("fetching hirise observations")

   const sUrl = cBrowser.buildUrl("../hirise", {
      o: "intersect",
      la1: oBounds.lat1,
      lo1: oBounds.long1,
      la2: oBounds.lat2,
      lo2: oBounds.long2,
   })
   const oHttp = new cHttp2()
   bean.on(oHttp, "result", hirise_callback)
   oHttp.fetch_json(sUrl)

   // fly to the centre
   oCentre = {
      lat: (fAll.lat1 + fAll.lat2) / 2,
      lon: (fAll.long1 + fAll.long2) / 2,
   }
   cGoogleEarth.addListener("frameend", lookat_callback)
   cGoogleEarth.flyTo(oCentre.lat, oCentre.lon, 9000.0)
   cCommonStatus.set_status("waiting for flight to finish")
   bPluginLoaded = true
}

//* ***************************************************************
function hirise_callback(poHttp) {
   var oSelect, i, oOption, oItem

   cCommonStatus.set_status("got hirise data")
   $("#hirise").empty()
   const oData = poHttp.response

   oSelect = $("<SELECT>")
   for (i = 0; i < oData.length; i++) {
      oItem = oData[i]
      oOption = $("<option>").attr({ value: i })
      oOption.html(oItem.sID)
      oSelect.append(oOption)

      // TBD add it to map
      var oPlace = cGoogleEarth.makeRect(oItem.oRect)
      cGoogleEarth.setLineColour(oPlace, sHiriseColor)
      aHirise[i] = oPlace
   }

   $("#hirise").append(oSelect)
   oSelect.change(onClickHirise)
}

//* ***************************************************************
function lookat_callback() {
   cGoogleEarth.removeListener("frameend", lookat_callback)
   cCommonStatus.set_status("fetching sites")
   for (var i = 0; i < aSites.length; i++) {
      const sUrl = cBrowser.buildUrl(cAppLocations.rest + "/sites.php", {
         o: "site",
         site: i,
         m: cMission.ID,
      })
      const oHttp = new cHttp2()
      bean.on(oHttp, "result", get_site_callback)
      oHttp.fetch_json(sUrl)
   }
   cCommonStatus.set_status("ok")
}

//* ***************************************************************
function get_site_callback(poHttp) {
   var i, aVector, fLat, fLong, aData

   const oData = poHttp.response
   if (oData.d == null) return
   aData = oData.d

   aVector = []

   for (i = 0; i < aData.length; i++) {
      fLat = parseFloat(aData[i].lat)
      fLong = parseFloat(aData[i].lon)
      aVector.push({ lat: fLat, lon: fLong })
   }
   cGoogleEarth.makeVector(aVector)
}

// ###############################################################
//* EVENTS
// ###############################################################
function onClickSite() {
   var iSite, sVal

   if (!bPluginLoaded) {
      cCommonStatus.set_error_status("wait for google earth plugin to load")
      return
   }

   sVal = $(this).val()
   if (sVal === "reset") {
      cGoogleEarth.flyTo(oCentre.lat, oCentre.lon, 9000.0)
   } else {
      iSite = parseInt(sVal)
      cCommonStatus.set_status("clicked site " + iSite)

      var oBounds = aSites[iSite]
      cGoogleEarth.flyTo(
         (oBounds.lat1 + oBounds.lat2) / 2,
         (oBounds.long1 + oBounds.long2) / 2,
         500.0,
      )
   }
}

//* ***************************************************************
function onClickHirise() {
   var sVal, iIndex, oPlace

   sVal = $(this).val()
   iIndex = parseInt(sVal)
   oPlace = aHirise[iIndex]

   if (oSelectedHiRise != null) {
      cGoogleEarth.setLineColour(oSelectedHiRise, sHiriseColor)
   }
   oSelectedHiRise = oPlace
   cGoogleEarth.setLineColour(oSelectedHiRise, sSelectedHiriseColor)
}
