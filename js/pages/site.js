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

//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	var sSite = cBrowser.data["site"];
	var sSol = cBrowser.data["sol"];
	var sDrive = cBrowser.data["drive"];
	$("#site").empty();
	if (sSite){
		set_status("fetching sites");
		$("#siteid").html("Site: "+sSite);
		cHttp.fetch_json("php/rest/sites.php?&o=site&site="+sSite, site_callback);
		cHttp.fetch_json("php/rest/sites.php?&o=siteBounds&site="+sSite, bounds_callback);
	}else if (sSol){
		set_status("fetching sols");
		$("#siteid").html("Sol: "+sSol);
		cHttp.fetch_json("php/rest/sites.php?&o=sol&sol="+sSol, site_callback);
		cHttp.fetch_json("php/rest/sites.php?&o=solBounds&sol="+sSol, bounds_callback);
	}else if (sDrive){
		set_status("fetching drive");
		$("#siteid").html("drive: "+sDrive);
		cHttp.fetch_json("php/rest/sites.php?&o=drive&drive="+sDrive, site_callback);
		cHttp.fetch_json("php/rest/sites.php?&o=driveBounds&drive="+sDrive, bounds_callback);
	}else
		set_error_status("invalid paramaters");
}

//###############################################################
//* call backs 
//###############################################################
function bounds_callback(poJS){
	if (poJS == null)
		set_error_status("No site bounds found");
	else{
		set_status("site bounds found");
		$("#site").append("<HR>");
		$("#site").append("(" +poJS.lat1 +","+ poJS.long1 +") (" +poJS.lat2 +","+poJS.long2 + ")" )  ;
	}
}

function site_callback(paJS){
	var i, aItem, sHTML, iDrive, iStart, iEnd, iSite;
	
	if (paJS == null)
		set_error_status("No site data found");
	else{
		for (i=0; i< paJS.length; i++){
			aItem = paJS[i];
			iDrive = parseInt(aItem.drive);
			iStart = parseInt(aItem.startSol);
			iEnd = parseInt(aItem.endSol);
			iSite = parseInt(aItem.site);
			
			sDrive="<a href='?drive="+iDrive+"'>" + iDrive + "</a>";
			sHTML = 
				"<li>Latitude:" + aItem.lat + ", Longitude:" + aItem.lon + 
				", site:" + "<a href='?site="+ iSite +"'>" + iSite + "</a>" +
				", startsol:" + "<a href='?sol="+ iStart +"'>" + iStart + "</a>" +
				", endsol:" + "<a href='?sol="+ iEnd +"'>" + iEnd + "</a>" +
				", drive:" +  "<a href='?drive="+ iDrive +"'>" + iDrive + "</a>" ;
			$("#site").append(sHTML);
		}
		//
		set_status("initialising google earth plugin");
		//google.load("earth", "1");	
	}
	
}

//***********************************************************************
function google_init_callback(){
}


