/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED

//uses google earth plugin information from https://developers.google.com/earth/documentation/index
**************************************************************************/
var DEBUG_ON = true;
var COLUMNS = 12;
var sOperation = null;
var aSites = null;
var aCache = [];
var bPluginLoaded = false;
var sBound = null;

//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_SITES(){
	set_status("initialising google earth");
	cGoogleEarth.callback = onGoogleEarthLoaded;
	cGoogleEarth.init("map");
}

//***********************************************************************
function onGoogleEarthLoaded(){
	bPluginLoaded = true;
	$("#site").empty();
	
	var sURL =cBrowser.buildUrl("php/rest/sites.php",{o:"allSitesBounds"});
	var oHttp = new cHttp2();
	bean.on(oHttp, "result", all_sites_callback);
	oHttp.fetch_json(sURL);
	
}
	
function do_op( psOper, psValue){
	set_status("fetching " + psOper + " :" + psValue);
	$("#siteid").html(psOper +": "+psValue);

	var oQueryData = {};
	oQueryData["o"] = psOper;
	oQueryData[psOper] = psValue;
	var sURL =cBrowser.buildUrl("php/rest/sites.php",oQueryData);
	var oHttp = new cHttp2();
	bean.on(oHttp, "result", traverse_callback);
	oHttp.fetch_json(sURL);
	
	var oQueryData = {};
	oQueryData["o"] = "siteBounds";
	oQueryData[psOper] = psValue;
	var sURL =cBrowser.buildUrl("php/rest/sites.php",oQueryData);
	var oHttp = new cHttp2();
	bean.on(oHttp, "result", bounds_callback);
	oHttp.fetch_json(sURL);	
}


//###############################################################
//* call backs 
//###############################################################
function all_sites_callback(poHttp){
	var oButton, oBounds, fLat, fLong;
	
	$("#sites").empty();
	if (poHttp.response.d == null)
		set_error_status("No sites found");
	else{
		aSites = poHttp.response.d;
		iCount =0;
		for (i = 0; i < aSites.length; i++){
			// create button to interact with site
			oBounds = aSites[i];
			if ( oBounds != null){
				oButton = $("<button>"+i+"</button>").attr({"value":i}).click(onclickSite);
				$("#site").append(oButton);

				//create geometry in earth
				oPlace = cGoogleEarth.makeRect(oBounds);
				cGoogleEarth.makePlacemark((oBounds.lat1 + oBounds.lat2)/2, (oBounds.long1 + oBounds.long2)/2, "site " + i, "site " + i);
			}
		}
	}
	
	//now do what was asked in the first place
	var sOperation = cBrowser.data["o"];
	var sValue = cBrowser.data[sOperation];
	do_op( sOperation, sValue);
}

//***********************************************************************
function bounds_callback(poHttp){
	var oCentre, oSite;
	
	if (poHttp.response.d == null)
		set_error_status("No site bounds found");
	else{
		oSite = poHttp.response.d;
		set_status("site bounds found");
		oCentre = {lat:(oSite.lat1 + oSite.lat2)/2, lon:(oSite.long1 + oSite.long2)/2};
		cGoogleEarth.flyTo( oCentre.lat, oCentre.lon , 300.0);
	}
}

//***********************************************************************
function traverse_callback(poHttp){
	var i, aItem, aItems, sHTML, iDrive, iStart, iEnd, iSite, fLat, fLon;
	var aVector = [];
	
	if (poHttp.response.d == null){
		set_error_status("No site data found");
		return;
	}
	
	aItems = poHttp.response.d;
	
	set_status("making vector");
	for (i=0; i< aItems.length; i++){
		aItem = aItems[i];
		iDrive = parseInt(aItem.drive);
		iStart = parseInt(aItem.startSol);
		iEnd = parseInt(aItem.endSol);
		iSite = parseInt(aItem.site);
		fLat = parseFloat(aItem.lat);
		fLon = parseFloat(aItem.lon);
		
		aVector.push({lat:fLat, lon:fLon});
		
		sHTML = "site:<a href='?o=site&site="+ iSite +"'>" + iSite + "</a>" +
		", startsol:<a href='?o=sol&sol="+ iStart +"'>" + iStart + "</a>" +
		", endsol:<a href='?o=sol&sol="+ iEnd +"'>" + iEnd + "</a>" +
		", drive:<a href='?o=drive&drive="+ iDrive +"'>" + iDrive + "</a>" ;
			
		set_status("adding placemark");
		oPlace = cGoogleEarth.makePlacemark(fLat, fLon, "", sHTML);
	}
	
	set_status("adding vector");
	cGoogleEarth.makeVector(aVector);
	set_status("ok");
	
	// now fly there
}

//****************************************************************
function onclickSite(){
	var iSite;
	
	if (!bPluginLoaded){
		set_error_status("wait for google earth plugin to load");
		return;
	}
	iSite = $(this).val();
	set_status("clicked site "+ iSite);
	do_op("site", iSite);
}



