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


//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	cGoogleEarth.init("map");
	cGoogleEarth.callback = onGoogleEarthLoaded;
	
	set_status("fetching sites");
	cHttp.fetch_json("php/rest/sites.php?&o=allSitesBounds", sites_callback);
}

//###############################################################
//* call backs 
//###############################################################
function sites_callback(paJS){
	var oButton, oBounds, fLat, fLong;
	
	$("#sites").empty();
	if (paJS == null)
		set_error_status("No sites found");
	else{
		aSites = paJS;
		iCount =0;
		for (i = 0; i < paJS.length; i++){
			// create button to interact with site
			oBounds = paJS[i];
			if ( oBounds != null){
				oButton = $("<button>"+i+"</button>").attr({"value":i}).click(onclickSite);
				$("#sites").append(oButton);
			}
			
			// cant add placemark as google earth may not be loaded
		}
		set_status("waiting for google earth plugin");
	}
}

//****************************************************************
function onGoogleEarthLoaded(){
	var i, oBounds;
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
		cGoogleEarth.makePlacemark(fLat, fLong, ""+i);
		
		//start a line
	}
	
	//fly to the centre
	cGoogleEarth.flyTo( (fAll.lat1 + fAll.lat2)/2, (fAll.long1 + fAll.long2)/2 , 9000.0);

	set_status("ok");
}

//****************************************************************
function onclickSite(){
	var iSite;
	
	iSite = parseInt($(this).val());
	set_status("clicked site "+ iSite);
}

