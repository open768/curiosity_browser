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
bean.on(cJQueryObj, "OnJqueryLoad", onLoadJQuery_SOLGIG);
function onLoadJQuery_SOLGIG(){
	var sUrl, sSol;
	
	//update sol number
	sSol = cBrowser.data["s"];
	var sTarget = ( SINGLE_WINDOW ? "" : "target='index'");
	$("#sol").html("<a " + sTarget + " href='index.php?s=" +sSol+"'>" + sSol + "</a>");
	current_sol = sSol;
	
	//load tags
	sUrl = "php/rest/gigapans.php?s=" + sSol + "&o=sol";
	set_status("fetching gigapans");
	
	var oHttp = new cHttp2();
	bean.on(oHttp, "result", onHttpGigaResponse);
	oHttp.fetch_json(sUrl);
}

//###############################################################
//* call backs 
//###############################################################
function onHttpGigaResponse(poHttp){
	var i, aItem, oDiv, oNewDiv;
	var aData = poHttp.json;
	
	oDiv = $("#solgiga");
	oDiv.empty();
	
	if (aData == null){
		set_error_status("no gigapans found");
		return;
	}
	
	for (i=0; i< aData.length; i++){
		aItem = aData[i];
		sGigaID = aItem.I;
		sIUrl = "http://static.gigapan.org/gigapans0/"+sGigaID+"/images/"+sGigaID+"-800x279.jpg";
		sGUrl = "http://www.gigapan.com/gigapans/" + sGigaID;
		
	
		oNewDiv = $("<DIV>");
		oA = $("<a>",{target:'giga',href:sGUrl});
		oImg = $("<img>", {src:sIUrl});
		oA.append(oImg);
		oNewDiv.append( oA);
		oNewDiv.append("<br>");
		
		oA = $("<a>",{target:'giga',href:sGUrl});
		oNewDiv.append( oA.append(aItem.D));
		
		oDiv.append(oNewDiv);
		oDiv.append("<p>");
	}
	
	set_status("ok");
}

