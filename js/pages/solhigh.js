/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var MOSAIC_QUERYSTRING = "mos";
var SHEET_QUERYSTRING = "sheet";
var SOL_QUERYSTRING = "s";
var gs_current_sol = null;
var gs_update_url = false;
//###############################################################
//# Utility functions 
//###############################################################
bean.on(cJQueryObj, "OnJqueryLoad", onLoadJQuery);
function onLoadJQuery(){
	var sUrl, iSol;
	
	//change status of checkbox
	if (cBrowser.data[MOSAIC_QUERYSTRING] != null )	$("#chkMosaic").prop('checked', true);

	//update sol number
	iSol = parseInt(cBrowser.data[SOL_QUERYSTRING]);
	load_sol_data(iSol);
}

//********************************************************************
function load_sol_data(piSol){
	$("#sol").html(piSol);
	$("#solbutton").html(piSol);

	gs_current_sol = piSol;
	
	//load tags
	set_status("fetching highlights");
	if (cBrowser.data[MOSAIC_QUERYSTRING] != null){
		sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "=" + piSol + "&o=mosaic";
		cHttp.fetch_json(sUrl, mosaic_callback);
	}
	else if (cBrowser.data[SHEET_QUERYSTRING] != null){
		sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "="+ piSol + "&o=soldata";
		cHttp.fetch_json(sUrl, sheet_callback);
	}else{
		sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "="+ piSol + "&o=soldata";
		cHttp.fetch_json(sUrl, hilite_callback);
	}
}

//***************************************************************
function load_highlights(psSol, psInstr, psProduct){
	sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "="+ psSol + "&i=" + psInstr + "&p=" + psProduct + "&o=thumbs";
	set_status("fetching images");
	cHttp.fetch_json(sUrl, load_thumbs_callback);
}

//###############################################################
//# events
//###############################################################
function onClickPrevious_sol(){
	var iSol = gs_current_sol -1;
	gs_update_url = true;
	load_sol_data(iSol);
}

function onClickNext_sol(){
	var iSol = gs_current_sol +1;
	gs_update_url = true;
	load_sol_data(iSol);
}

function onClickSol(){
	cBrowser.openWindow("index.php?"+ SOL_QUERYSTRING + "=" + gs_current_sol, "index");
}

function onClickDetails(){
	var sUrl;
	
	if ((cBrowser.data[SHEET_QUERYSTRING] == null) &&( cBrowser.data[MOSAIC_QUERYSTRING] == null)) return;
	
	sUrl = "solhigh.php?"+ SOL_QUERYSTRING + "=" +cBrowser.data[SOL_QUERYSTRING];
	cBrowser.pushState("highlights", sUrl);
	set_status("loading..");
	onLoadJQuery();
}

function onClickNoDetails(){
	var sUrl;
	
	if (cBrowser.data[SHEET_QUERYSTRING] != null) return;
	
	sUrl = "solhigh.php?"+ SOL_QUERYSTRING + "=" +cBrowser.data[SOL_QUERYSTRING] + "&" + SHEET_QUERYSTRING;
	cBrowser.pushState("highlights", sUrl);
	set_status("loading..");
	onLoadJQuery();
}

function onClickMosaic(){
	var sUrl;
	
	if (cBrowser.data[MOSAIC_QUERYSTRING] != null) return;
	sUrl = "solhigh.php?"+ SOL_QUERYSTRING+ "=" +cBrowser.data[SOL_QUERYSTRING] + "&" + MOSAIC_QUERYSTRING;
	cBrowser.pushState("highlights", sUrl);
	set_status("loading..");
	onLoadJQuery();
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
	
	if 	(gs_update_url){
		sUrl = "solhigh.php?"+ SOL_QUERYSTRING + "=" + gs_current_sol;
		cBrowser.pushState("highlights", sUrl);
		gs_update_url = false;
	}
	
	set_status("loading..");
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
			sUrl= "detail.php?"+ SOL_QUERYSTRING + "=" + gs_current_sol + "&i=" + sInstr + "&p=" + sProduct ;
			
			oRow.append("<td width=200><a  href='" + sUrl + "'>" + sProduct + "</a><p><div class='soltags' id='T"+sProduct+"'>Loading Tags..<div></td>");
			oRow.append("<td align=left><a  href='" + sUrl + "'><div id='"+sProduct+"'><font class='subtitle'>Loading images</font></div></a></td>");
			
			load_highlights(gs_current_sol, sInstr, sProduct);
			cTagging.getTags(gs_current_sol,sInstr,sProduct, tag_callback);
		}
	}
	
	if (iCount ==0)		set_error_status("no highlights found");
}

//***************************************************************
function sheet_callback(poJs){
	var sInstr, sProduct, sUrl;
	var oDiv, oTable, oRow, iCount;
	
	if 	(gs_update_url){
		sUrl = "solhigh.php?sheet&"+ SOL_QUERYSTRING+ "=" + gs_current_sol;
		cBrowser.pushState("highlights", sUrl);
		gs_update_url = false;
	}

	
	cDebug.write("showing sheet");
	oDiv = $("#solhigh");
	oDiv.empty();
	iCount = 0;
	
	for (sInstr in poJs){
		iCount ++;
		
		//build the table
		aProducts = poJs[sInstr];
		for (sProduct in aProducts)
			load_highlights(gs_current_sol, sInstr, sProduct);
	}
	
	if (iCount ==0)
		set_error_status("no highlights found");
	else
		set_status("ok");
}

//***************************************************************
function mosaic_callback(poJs){
	var oDiv, oImg;
	
	oDiv = $("#solhigh");
	oDiv.empty();
	
	if (poJs.u == null){
		oDiv.append("No highlights found");
	}else{
		oImg = $("<IMG>").attr({"src":poJs.u});
		oDiv.append(oImg);
	}
	set_status("ok");
}
	
//***************************************************************
function tag_callback(paJS){
	var oDiv, sHTML, oA, sTag, i;

	//clear out the div
	oDiv = $("#T" + paJS.p);
	oDiv.empty();
	
	if (paJS.d.length== 0) return;

	//put in the tags
	sHTML = "";
	for (i=0; i<paJS.d.length; i++){
		sTag = paJS.d[i];
		
		oA = $("<A>").attr({"href":"tag.php?t=" + sTag }).append("#"+sTag);
		oDiv.append(oA).append(" ");
	}
}

//***************************************************************
function load_thumbs_callback(poJS){
	var i, oDiv, oA, oImg, aUrls;
	
	aUrls = poJS.u;
	if (cBrowser.data["sheet"] == null){
		var oDiv = $("#" + poJS.p);
		oDiv.empty();
		
		if (aUrls.length == 0)
			oDiv.html("no thumbnails found");
		else
			for (i=0 ; i< aUrls.length; i++){
				oImg = $("<IMG>").attr({"src":aUrls[i],"class":"polaroid"});
				oDiv.append(oImg);
			}
	}else{
		oDiv = $("#solhigh");
		for (i=0 ; i< aUrls.length; i++){
			sUrl= "detail.php?"+ SOL_QUERYSTRING + "=" + poJS.s + "&i=" + poJS.i + "&p=" + poJS.p ;
			oA = $("<A>").attr({href:sUrl});
			oImg = $("<IMG>").attr({"src":aUrls[i],"class":"polaroid"});
			oDiv.append(oA.append(oImg));
		}
	}
	
}

