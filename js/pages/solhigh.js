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
	$("#sol").html(sSol);
	current_sol = sSol;
	
	//load tags
	sUrl = "php/rest/img_highlight.php?s=" + sSol + "&o=soldata";
	set_status("fetching highlights");
	cHttp.fetch_json(sUrl, hilite_callback);
}


//***************************************************************
function load_highlights(psSol, psInstr, psProduct){
	sUrl = "php/rest/img_highlight.php?s=" + psSol + "&i=" + psInstr + "&p=" + psProduct + "&o=thumbs";
	set_status("fetching images");
	cHttp.fetch_json(sUrl, load_thumbs_callback);
}

//###############################################################
//* call backs 
//###############################################################
function hilite_callback(poJs){
	var sInstr, sProduct;
	var oDiv, oTable, oRow;
	
	oDiv = $("#solhigh");
	oDiv.empty();
	
	for (sInstr in poJs){
		oDiv.append("<h3>" + sInstr + "</h3>")
		oTable = $("<TABLE border=1 cellspacing=0 width=100%>");
		oDiv.append(oTable);
		
		//build the table
		aProducts = poJs[sInstr];
		for (sProduct in aProducts){
			oRow = $("<TR>");
			oTable.append(oRow);
			
			oRow.append("<td width=200><a target='detail' href='detail.html?s=" + current_sol + "&i=" + sInstr + "&p=" + sProduct + "'>" + sProduct + "</a></td>");
			oRow.append("<td align=left><div id='"+sProduct+"'>loading images</div></td>");
			
			load_highlights(current_sol, sInstr, sProduct);
		}
	}
	set_status("ok");
}

//***************************************************************
function load_thumbs_callback(poJS){
	var oDiv = $("#" + poJS.p);
	oDiv.empty();
	var aUrls = poJS.u;
	
	if (aUrls.length == 0)
		oDiv.html("no thumbnails found");
	else{
		var i;
		for (i=0 ; i< aUrls.length; i++)
			oDiv.append($("<IMG>").attr({"src":aUrls[i]}));
	}
}

