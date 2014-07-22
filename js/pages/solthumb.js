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
var COLS=4;
//###############################################################
//# event handlers
//###############################################################

//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	var sUrl, sSol;
	
	//update sol number
	sSol = cBrowser.data["s"];
	sInstr = cBrowser.data["i"];
	$("#sol").html("<a target='title' href='index.html?s=" +sSol+"'>" + sSol + "</a>");
	current_sol = sSol;
	
	//load tags
	sUrl = "php/rest/solthumbs.php?s=" + sSol + "&i=" + sInstr;
	set_status("fetching thumbnails");
	cHttp.fetch_json(sUrl, load_thumbs_callback);
}

//###############################################################
//* call backs 
//###############################################################
function load_thumbs_callback(poJS){
	var oDiv, i, oItem;
	
	oDiv = $("#solthumb");
	oDiv.empty();
	
	if (poJS.d.Length == 0)
		oDiv.append("<p class='subtitle'>Sorry no thumbnails found</p>");
	else{
		for (i=0; i< poJS.d.length; i++){
			oItem = poJS.d[i];
			oDiv.append("<a target='detail' href='detail.html?s=" + poJS.s + "&i=" + poJS.i +"&p=" +oItem.p +"'><img border='0' src='" +oItem.i + "'></a> ");
		}
	}
	
	
	set_status("ok");
}

