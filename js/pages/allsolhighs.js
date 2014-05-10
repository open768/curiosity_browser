/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var COLUMNS = 25;
var oSolIndex = null;

//###############################################################
//# Utility functions 
//###############################################################

function onLoadJQuery(){
	set_status("fetching Highlights");
	cHttp.fetch_json("php/rest/img_highlight.php?&o=topsolindex", topsol_callback);
}

//###############################################################
//* call backs 
//###############################################################
function topsol_callback(poJs){
	oSolIndex = poJs;
	if (oSolIndex==null)
		set_error_status("No Highlights found");
	else{
		set_status("fetching sols");
		cHttp.fetch_json("php/rest/sols.php", sols_callback);
	}
}

function sols_callback(paJS){
	var sHTML, i, iCount, sSol;
	
	sHTML = "<form method='get' target='solhigh' action='solhigh.html'><center><table cellpadding=5>";
	iCount =0;
	for (i = 0; i < paJS.length; i++){
		if (iCount == 0) sHTML += "<tr>";
		sSol = paJS[i].sol.toString();
		sHTML += "<TD align=middle>"
		if (oSolIndex[sSol])
			sHTML += "<button name='s' value='"+sSol+"'>"+sSol+"</button>";
		else
			sHTML += sSol;
		sHTML += "</TD>"
			
		iCount++;
		if (iCount >=COLUMNS){
			sHTML+="</tr>";
			iCount = 0;
		}
			
	}
	if (iCount >0) sHTML+="</tr>";

	sHTML += "</table></center></form>";
	
	$("#solhighs").html(sHTML);
	set_status("ok");
}

