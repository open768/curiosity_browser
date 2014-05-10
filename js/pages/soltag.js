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
	$("#sol").html(sSol);
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
	var sInstr, sHTML, aTags,i, sProduct, sTag, oItem, sTagUrl, sProductURL;
	
	sHTML = "<dl>";
	for (sInstr in poJs){
		sHTML += "<dt>Instrument: " + sInstr + "</dt>";
		sHTML += "<dd><ul>";
		aTags = poJs[sInstr];
		
		for (i=0; i< aTags.length; i++){
			oItem = aTags[i];
			sProduct = oItem.p;
			sTag = oItem.t;
			sTagUrl = "<a target='tag' href='tag.html?t=" + sTag + "'>" + sTag + "</a>";
			sProductURL = "<a target='detail' href='detail.html?s=" + current_sol + "&i=" + sInstr + "&p=" + sProduct + "'>" + sProduct + "</a>";
			sHTML += "<li>tag " + sTagUrl + " in " + sProductURL;
		}
		
		sHTML += "</ul></dd>";
	}
	sHTML += "</dl>";
	$("#soltag").html(sHTML);
	set_status("ok");
}

