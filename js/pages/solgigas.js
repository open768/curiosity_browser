/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var current_sol = null;

//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	var sUrl, sSol;
	
	//update sol number
	sSol = cBrowser.data["s"];
	$("#sol").html("<a target='title' href='index.php?s=" +sSol+"'>" + sSol + "</a>");
	current_sol = sSol;
	
	//load tags
	sUrl = "php/rest/gigapans.php?s=" + sSol + "&o=sol";
	set_status("fetching gigapans");
	cHttp.fetch_json(sUrl, load_giga_callback);
}

//###############################################################
//* call backs 
//###############################################################
function load_giga_callback(paJs){
	var i, aItem, oDiv;
	
	oDiv = $("#solgiga");
	oDiv.empty();
	
	if (paJs == null){
		set_error_status("no gigapans found");
		return;
	}
	
	for (i=0; i< paJs.length; i++){
		aItem = paJs[i];
		sGigaID = aItem.I;
		sUrl = "http://www.gigapan.com/gigapans/" + sGigaID;
		oDiv.append( "<a href='"+sUrl+"'><img src='http://static.gigapan.org/gigapans0/"+sGigaID+"/images/"+sGigaID+"-800x279.jpg'></a><br>");
		oDiv.append( "<a href='"+sUrl+"'>" + aItem.D +"</a><hr>");
	}
	
	set_status("ok");
}

