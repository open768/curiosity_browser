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
var bPluginLoaded = false;
var oCentre = null;


//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	set_status("initialising Google Earth");
	cGoogleEarth.callback = onGoogleEarthLoaded;
	cGoogleEarth.init("map");
}

function onGoogleEarthLoaded(){
	set_status("retrieving sites");
	cHttp.fetch_json("php/rest/sites.php?&o=allSitesBounds", all_sites_callback);
}

//###############################################################
//* call backs 
//###############################################################
function all_sites_callback(paJS){
	var oButton, oBounds, fLat, fLong;
	
	$("#sites").empty();
	if (paJS.d == null)
		set_error_status("No sites found");
	else{
		aSites = paJS.d;
		iCount =0;
		for (i = 0; i < aSites.length; i++){
			// create button to interact with site
			oBounds = aSites[i];
			if ( oBounds != null){
				oButton = $("<button>"+i+"</button>").attr({"value":i}).click(onclickSite);
				$("#sites").append(oButton);
			}
		}
		
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
		sLink = '<a href="site.html?o=site&site=' +i + '">click here</a>';
		oPlace = cGoogleEarth.makePlacemark(fLat, fLong, "site: "+i, "To see more details " + sLink);
		
		oBounds.place = oPlace;
		
		//draw bounds 
		oPlace = cGoogleEarth.makeRect(oBounds);
	}

	//fly to the centre
	oCentre = {lat:(fAll.lat1 + fAll.lat2)/2, lon:(fAll.long1 + fAll.long2)/2};
	cGoogleEarth.addListener( "frameend", lookat_callback);
	cGoogleEarth.flyTo( oCentre.lat, oCentre.lon , 9000.0);
	set_status("waiting for flight to finish");
	bPluginLoaded = true;
}

//****************************************************************
function lookat_callback(){
	cGoogleEarth.removeListener( "frameend", lookat_callback);
	set_status("fetching sites");
	for (i = 0; i < aSites.length; i++)
		cHttp.fetch_json("php/rest/sites.php?&o=site&site="+i, get_site_callback);
	set_status("ok");
}

//****************************************************************
function get_site_callback(paJS){
	var i, aItem, aVector, fLat, fLong, aData;
	
	if (paJS.d == null)	return;
	aData = paJS.d ;
	
	aVector = [];
	
	for (i=0; i< aData.length; i++){
		fLat = parseFloat(aData[i].lat);
		fLong = parseFloat(aData[i].lon);
		aVector.push({lat:fLat, lon:fLong});
	}
	cGoogleEarth.makeVector(aVector);
}
//****************************************************************
function onclickSite(){
	var iSite;
	
	if (!bPluginLoaded){
		set_error_status("wait for google earth plugin to load");
		return;
	}
	
	iSite = parseInt($(this).val());
	set_status("clicked site "+ iSite);
	
	oBounds = aSites[iSite];
	cGoogleEarth.flyTo( (oBounds.lat1 + oBounds.lat2)/2, (oBounds.long1 + oBounds.long2)/2 , 500.0);
}

//****************************************************************
function onclickZoomout(){
	
	if (!bPluginLoaded){
		set_error_status("wait for google earth plugin to load");
		return;
	}
	
	cGoogleEarth.flyTo( oCentre.lat, oCentre.lon , 9000.0);
}

