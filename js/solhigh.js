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

function load_data(){
	var sUrl, sSol;
	
	//update sol number
	sSol = cBrowser.data["s"];
	$("#sol").html(sSol);
	current_sol = sSol;
	
	//load tags
	sUrl = "php/img_highlight.php?s=" + sSol + "&o=soldata";
	set_status("fetching highlights");
	cHttp.fetch_json(sUrl, hilite_callback);
}

//###############################################################
//* call backs 
//###############################################################
function hilite_callback(poJs){
	var sInstr, sHTML, sProduct, oItem, sTagUrl, sProductURL;
	
	sHTML = "<dl>";
	for (sInstr in poJs){
		sHTML += "<dt>" + sInstr + "</dt>";
		sHTML += "<dd><ul>";
		aProducts = poJs[sInstr];
		for (sProduct in aProducts)
			sHTML += "<li><a target='detail' href='detail.html?s=" + current_sol + "&i=" + sInstr + "&p=" + sProduct + "'>" + sProduct + "</a>";
		
		sHTML += "</ul></dd>";
	}
	sHTML += "</dl>";
	$("#solhigh").html(sHTML);
	set_status("ok");
}

