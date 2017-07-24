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
	cBrowser.openWindow("allsoltags.php", "allsoltags");
}

//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_SOLTAG(){
	var sUrl, sSol;
	
	//update sol number
	sSol = cBrowser.data["s"];
	
	sUrl = cBrowser.buildUrl("index.php",{s:sSol});
	$("#sol").html("<a href='"+sUrl+"'>" + sSol + "</a>");
	current_sol = sSol;
	
	//load tags
	sUrl = cBrowser.buildUrl("php/rest/tag.php",{s:sSol,o:"sol"});
	set_status("fetching tags");

	var oHttp = new cHttp2();
	bean.on(oHttp,"result",load_soltag_callback);
	oHttp.fetch_json(sUrl);
}

//###############################################################
//* call backs 
//###############################################################
function load_soltag_callback(poHttp){
	var sInstr, aTags,i, sProduct, sTag, oItem, sTagUrl, sProductURL;
	var oDiv;
	
	oDiv = $("#soltag");
	oDiv.empty();
	var aData = poHttp.response;
	
	if (aData == null){
		oDiv.append("No Tags Found");
		return;
	}
	
	
	for (sInstr in aData){
		oDiv.append("<h2>"+sInstr +"</h2>");
		aTags = aData[sInstr];

		for (i=0; i< aTags.length; i++){
			oItem = aTags[i];
			sProduct = oItem.p;
			sTag = oItem.t;
			sTagUrl = "<a href='tag.php?t=" + sTag + "'>" + sTag + "</a>";
			sProductURL = "<a href='detail.php?s=" + current_sol + "&i=" + sInstr + "&p=" + sProduct + "'>" + sProduct + "</a>";
			oDiv.append( sTagUrl + " in " + sProductURL + "<br>")
		}
	}
	
	set_status("ok");
}

