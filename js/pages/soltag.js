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
//# event handlers
//###############################################################
function onClickAllSols(){
	window.open("allsoltags.html", "allsoltags");
}

//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	var sUrl, sSol;
	
	//update sol number
	sSol = cBrowser.data["s"];
	$("#sol").html("<a target='title' href='index.html?s=" +sSol+"'>" + sSol + "</a>");
	current_sol = sSol;
	
	//load tags
	sUrl = "php/rest/tag.php?s=" + sSol + "&o=sol";
	set_status("fetching tags");
	cHttp.fetch_json(sUrl, load_soltag_callback);
}

//###############################################################
//* call backs 
//###############################################################
function load_soltag_callback(poJs){
	var sInstr, aTags,i, sProduct, sTag, oItem, sTagUrl, sProductURL;
	var oDiv;
	
	oDiv = $("#soltag");
	oDiv.empty();
	
	
	for (sInstr in poJs){
		oDiv.append("<h2>"+sInstr +"</h2>");
		aTags = poJs[sInstr];

		for (i=0; i< aTags.length; i++){
			oItem = aTags[i];
			sProduct = oItem.p;
			sTag = oItem.t;
			sTagUrl = "<a target='tag' href='tag.html?t=" + sTag + "'>" + sTag + "</a>";
			sProductURL = "<a target='detail' href='detail.html?s=" + current_sol + "&i=" + sInstr + "&p=" + sProduct + "'>" + sProduct + "</a>";
			oDiv.append( sTagUrl + " in " + sProductURL + "<br>")
		}
	}
	
	set_status("ok");
}
