/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var aSites = null;
var aHirise=[];
var bPluginLoaded = false;
var oCentre = null;
var sSiteColor = "ffff0000";
var sHiriseColor = "ff00ff00";
var sSelectedHiriseColor = "ff0000ff";
var oSelectedHiRise=null;


//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_SITES(){
	set_status("initialising Google Earth");
	cGoogleEarth.callback = onGoogleEarthLoaded;
	cGoogleEarth.init("map");
}

function onGoogleEarthLoaded(){
	set_status("retrieving sites");
	var sUrl = cBrowser.buildUrl(cLocations.rest + "/sites.php",{o:"allSitesBounds",m:cMission.ID});
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",all_sites_callback);
	oHttp.fetch_json(sUrl);
}

//###############################################################
//* call backs 
//###############################################################
function all_sites_callback(poHttp){
	var oButton, oBounds, fLat, fLong;
	var oSelect, oOption;
	var oData = poHttp.response;
	
	$("#sites").empty();
	if (oData.d == null)
		set_error_status("No sites found");
	else{
		aSites = oData.d;
		
		oSelect = $("<SELECT>");
		iCount =0;
		for (i = 0; i < aSites.length; i++){
			oBounds = aSites[i];
			if ( oBounds != null){
				oOption = $("<option>").attr({"value":i});
				oOption.html(i);
				oSelect.append(oOption);
			}
		}
		
		//add reset option
		oOption = $("<option>").attr({"value":"reset"});
		oOption.html("Reset Zoom");
		oSelect.append(oOption);
		
		$("#sites").append(oSelect);
		oSelect.change(onClickSite);
		
		render_sites();
	}
}

//****************************************************************
function render_sites(){
	var i, oBounds, sLink, oPlace;
	var fAll =null;
	var bFirst = true;
	
	set_status("adding placemarks");

	for (i = 0; i < aSites.length; i++){
		// create button to interact with site
		oBounds = aSites[i];
		if ( oBounds == null) continue;
		
		//add to overall bounds
		if (bFirst){
			 fAll = {lat1:oBounds.lat1, long1:oBounds.long1, lat2:oBounds.lat2, long2:oBounds.long2};
			 bFirst = false;
		}else{
			fAll.lat1 = Math.min(fAll.lat1, oBounds.lat1);
			fAll.long1 = Math.min(fAll.long1, oBounds.long1);
			fAll.lat2 = Math.max(fAll.lat2, oBounds.lat2);
			fAll.long2 = Math.max(fAll.long2, oBounds.long2);
		}
		
		// make the placemark
		fLat = (oBounds.lat1 + oBounds.lat2)/2;
		fLong = (oBounds.long1 + oBounds.long2)/2;
		sLink = '<a href="site.php?o=site&site=' +i + '">click here</a>';
		oPlace = cGoogleEarth.makePlacemark(fLat, fLong, "site: "+i, "To see more details " + sLink);
		
		oBounds.place = oPlace;
		
		//draw bounds 
		oPlace = cGoogleEarth.makeRect(oBounds);
		cGoogleEarth.setLineColour(oPlace, sSiteColor);	
	}
	//get the hirise targets
	set_status("fetching hirise observations");

	var sUrl = cBrowser.buildUrl("../hirise",{o:"intersect",la1:oBounds.lat1,lo1:oBounds.long1,la2:oBounds.lat2,lo2:oBounds.long2});
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",hirise_callback);
	oHttp.fetch_json(sUrl);
	
	//fly to the centre
	oCentre = {lat:(fAll.lat1 + fAll.lat2)/2, lon:(fAll.long1 + fAll.long2)/2};
	cGoogleEarth.addListener( "frameend", lookat_callback);
	cGoogleEarth.flyTo( oCentre.lat, oCentre.lon , 9000.0);
	set_status("waiting for flight to finish");
	bPluginLoaded = true;
}

//****************************************************************
function hirise_callback(poHttp){
	var oSelect, i, oOption, oItem, oBound;
	
	set_status("got hirise data"); 
	$("#hirise").empty();
	var oData = poHttp.response;
	
	oSelect = $("<SELECT>");
	for (i = 0; i < oData.length; i++){
		oItem = oData[i];
		oOption = $("<option>").attr({"value":i});
		oOption.html(oItem.sID);
		oSelect.append(oOption);
		
		//TBD add it to map
		oPlace = cGoogleEarth.makeRect(oItem.oRect);
		cGoogleEarth.setLineColour(oPlace, sHiriseColor);
		aHirise[i] = oPlace;
	}
	
	$("#hirise").append(oSelect);
	oSelect.change(onClickHirise);
}

//****************************************************************
function lookat_callback(){
	cGoogleEarth.removeListener( "frameend", lookat_callback);
	set_status("fetching sites");
	for (i = 0; i < aSites.length; i++){
		var sUrl = cBrowser.buildUrl(cLocations.rest + "/sites.php",{o:"site",site:i,m:cMission.ID});
		var oHttp = new cHttp2();
		bean.on(oHttp,"result",get_site_callback);
		oHttp.fetch_json(sUrl);
	}
	set_status("ok");
}

//****************************************************************
function get_site_callback(poHttp){
	var i, aItem, aVector, fLat, fLong, aData;
	
	var oData = poHttp.response;
	if (oData.d == null)	return;
	aData = oData.d ;
	
	aVector = [];
	
	for (i=0; i< aData.length; i++){
		fLat = parseFloat(aData[i].lat);
		fLong = parseFloat(aData[i].lon);
		aVector.push({lat:fLat, lon:fLong});
	}
	cGoogleEarth.makeVector(aVector);
}

//###############################################################
//* EVENTS
//###############################################################
function onClickSite(){
	var iSite, sVal;
	
	if (!bPluginLoaded){
		set_error_status("wait for google earth plugin to load");
		return;
	}
	
	sVal = $(this).val();
	if (sVal === "reset")
		cGoogleEarth.flyTo( oCentre.lat, oCentre.lon , 9000.0);
	else{
		iSite = parseInt(sVal);
		set_status("clicked site "+ iSite);
		
		oBounds = aSites[iSite];
		cGoogleEarth.flyTo( (oBounds.lat1 + oBounds.lat2)/2, (oBounds.long1 + oBounds.long2)/2 , 500.0);
	}
}

//****************************************************************
function onClickHirise(){
	var sVal,iIndex,oPlace;
	
	sVal = $(this).val();
	iIndex = parseInt(sVal);
	oPlace = aHirise[iIndex];

	if (oSelectedHiRise != null)
		cGoogleEarth.setLineColour(oSelectedHiRise, sHiriseColor);
	oSelectedHiRise = oPlace;
	cGoogleEarth.setLineColour(oSelectedHiRise, sSelectedHiriseColor);
}

