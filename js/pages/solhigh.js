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
	var sUrl, iSol;
	
	//update sol number
	iSol = parseInt(cBrowser.data["s"]);
	load_sol_data(iSol);
}

function load_sol_data(piSol){
	$("#sol").html("<a target='title' href='index.html?s=" +piSol+"'>" + piSol + "</a>");
	current_sol = piSol;
	
	//load tags
	sUrl = "php/rest/img_highlight.php?s=" + piSol + "&o=soldata";
	set_status("fetching highlights");
	cHttp.fetch_json(sUrl, hilite_callback);
}


//***************************************************************
function load_highlights(psSol, psInstr, psProduct){
	sUrl = "php/rest/img_highlight.php?s=" + psSol + "&i=" + psInstr + "&p=" + psProduct + "&o=thumbs";
	set_status("fetching images");
	cHttp.fetch_json(sUrl, load_thumbs_callback);
}

function onClickPrevious_sol(){
	var iSol = current_sol -1;
	load_sol_data(iSol);
}

function onClickNext_sol(){
	var iSol = current_sol +1;
	load_sol_data(iSol);
}

//###############################################################
//* call backs 
//###############################################################
function hilite_callback(poJs){
	var sInstr, sProduct, sUrl;
	var oDiv, oTable, oRow, iCount;
	
	oDiv = $("#solhigh");
	oDiv.empty();
	iCount = 0;
	
	for (sInstr in poJs){
		iCount ++;
		oDiv.append("<h3>" + sInstr + "</h3>")
		oTable = $("<TABLE border=1 cellspacing=0 width=100%>");
		oDiv.append(oTable);
		
		//build the table
		aProducts = poJs[sInstr];
		for (sProduct in aProducts){
			oRow = $("<TR>");
			oTable.append(oRow);
			sUrl= "detail.html?s=" + current_sol + "&i=" + sInstr + "&p=" + sProduct ;
			oRow.append("<td width=200><a target='detail' href='" + sUrl + "'>" + sProduct + "</a><p><div class='soltags' id='T"+sProduct+"'>Loading Tags..<div></td>");
			oRow.append("<td align=left><a target='detail' href='" + sUrl + "'><div id='"+sProduct+"'><font class='subtitle'>Loading images</font></div></a></td>");
			
			load_highlights(current_sol, sInstr, sProduct);
			cTagging.getTags(current_sol,sInstr,sProduct, tag_callback);
		}
	}
	
	if (iCount ==0)
		set_error_status("no highlights found");
	else
		set_status("ok");
}

//***************************************************************
function tag_callback(paJS){
	var oDiv, sHTML, sTag, i;

	//clear out the div
	oDiv = $("#T" + paJS.p);
	oDiv.empty();
	
	if (paJS.d.length== 0) return;

	//put in the tags
	sHTML = "";
	for (i=0; i<paJS.d.length; i++){
		sTag = paJS.d[i];
		sHTML += "<a target='tags' href='tag.html?t=" + sTag + "'>#" + sTag + "</a> ";
	}
	oDiv.html( sHTML);
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
			oDiv.append($("<IMG>").attr({"src":aUrls[i],"class":"polaroid"}));
	}
}

