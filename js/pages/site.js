/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var COLUMNS = 12;

//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	var sSite = cBrowser.data["s"];
	set_status("fetching sites");
	$("#siteid").html(sSite);
	cHttp.fetch_json("php/rest/sites.php?&o=site&site="+sSite, site_callback);
}

//###############################################################
//* call backs 
//###############################################################
function site_callback(paJS){
	var i, aItem, sHTML;
	
	if (paJS == null)
		set_error_status("No site data found");
	else{
		$("#site").empty();
		for (i=0; i< paJS.length; i++){
			aItem = paJS[i];
			sHTML = "<li>Latitude:" + aItem.lat + ", Longitude:" + aItem.lon + ", startsol:" + aItem.startSol + ", endsol:" + aItem.endSol + ", drive:" +  aItem.drive ;
			$("#site").append(sHTML);
		}
		set_status("ok");
	}
}


