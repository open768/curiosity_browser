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
var SOL_ATTR = "sa";
var INSTRUMENT_ATTR = "ia";
var PRODUCT_ATTR = "pa";
var goQueue = null;

//###############################################################
//# Utility functions 
//###############################################################
bean.on(cJQueryObj, "OnJqueryLoad", onLoadJQuery);
function onLoadJQuery(){
	var sUrl, iSol;
	
	pr_stop_queue();
	
	//change status of checkbox
	if (cBrowser.data[MOSAIC_QUERYSTRING] != null )	$("#chkMosaic").prop('checked', true);

	//update sol number
	iSol = parseInt(cBrowser.data[SOL_QUERYSTRING]);
	load_sol_data(iSol);
}

//********************************************************************
function  pr_stop_queue(){
	if (goQueue) {
		goQueue.stop();
		goQueue = null;
	}
}

//********************************************************************
function load_sol_data(piSol){
	$("#sol").html(piSol);
	$("#solbutton").html(piSol);

	gs_current_sol = piSol;
	var oHttp = new cHttp2();
	
	//load tags
	set_status("fetching highlights");
	if (cBrowser.data[MOSAIC_QUERYSTRING] != null){
		sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "=" + piSol + "&o=mosaic";
		bean.on(oHttp, "result", onMosaicResponse);
		oHttp.fetch_json(sUrl);
	}
	else if (cBrowser.data[SHEET_QUERYSTRING] != null){
		sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "="+ piSol + "&o=soldata";
		bean.on(oHttp, "result", onSheetResponse);
		oHttp.fetch_json(sUrl);
	}else{
		sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "="+ piSol + "&o=soldata";
		bean.on(oHttp, "result", onHiliteResponse);
		oHttp.fetch_json(sUrl);
	}
}

//***************************************************************
function load_highlight_thumbs(psSol, psInstr, psProduct){
	
	//get the thumbnail images
	var sUrl = "php/rest/img_highlight.php?"+ SOL_QUERYSTRING + "="+ psSol + "&i=" + psInstr + "&p=" + psProduct + "&o=thumbs";
	set_status("fetching images");
	goQueue.add(psProduct, sUrl);
	goQueue.start();
	
	//get tags 
	if (cBrowser.data[SHEET_QUERYSTRING] !== null) return;
	if (cBrowser.data[MOSAIC_QUERYSTRING] !== null) return;
	cTagging.getTags(psSol,psInstr,psProduct, tag_callback);
}

//###############################################################
//# events
//###############################################################
function onClickPrevious_sol(){
	var iSol = gs_current_sol -1;
	pr_stop_queue();
	gs_update_url = true;
	load_sol_data(iSol);
}

//***************************************************************
function onClickNext_sol(){
	var iSol = gs_current_sol +1;
	pr_stop_queue();
	gs_update_url = true;
	load_sol_data(iSol);
}

//***************************************************************
function onClickSol(){
	pr_stop_queue();
	cBrowser.openWindow("index.php?"+ SOL_QUERYSTRING + "=" + gs_current_sol, "index");
}

//***************************************************************
function onClickDetails(){
	var sUrl;
	
	if ((cBrowser.data[SHEET_QUERYSTRING] == null) &&( cBrowser.data[MOSAIC_QUERYSTRING] == null)) return;
	
	pr_stop_queue();
	sUrl = "solhigh.php?"+ SOL_QUERYSTRING + "=" +cBrowser.data[SOL_QUERYSTRING];
	cBrowser.pushState("highlights", sUrl);
	set_status("loading..");
	onLoadJQuery();
}

//***************************************************************
function onClickNoDetails(){
	var sUrl;
	
	if (cBrowser.data[SHEET_QUERYSTRING] != null) return;
	pr_stop_queue();
	
	sUrl = "solhigh.php?"+ SOL_QUERYSTRING + "=" +cBrowser.data[SOL_QUERYSTRING] + "&" + SHEET_QUERYSTRING;
	cBrowser.pushState("highlights", sUrl);
	set_status("loading..");
	onLoadJQuery();
}

//***************************************************************
function onClickMosaic(){
	var sUrl;
	
	if (cBrowser.data[MOSAIC_QUERYSTRING] != null) return;
	pr_stop_queue();
	sUrl = "solhigh.php?"+ SOL_QUERYSTRING+ "=" +cBrowser.data[SOL_QUERYSTRING] + "&" + MOSAIC_QUERYSTRING;
	cBrowser.pushState("highlights", sUrl);
	set_status("loading..");
	onLoadJQuery();
}

//###############################################################
//* call backs 
//###############################################################
function onHiliteResponse(poHttp){
	var sInstr, sProduct, sUrl;
	var oDiv, oImgDiv, oTable, oRow, oCol, iCount;
	
	oDiv = $("#solhigh");
	oDiv.empty();
	iCount = 0;
	
	if 	(gs_update_url){
		sUrl = "solhigh.php?"+ SOL_QUERYSTRING + "=" + gs_current_sol;
		cBrowser.pushState("highlights", sUrl);
		gs_update_url = false;
	}
	var aData = poHttp.json;
	goQueue= new cActionQueue();
	bean.on(goQueue, "response", OnHighlightImageResult);

	
	set_status("loading..");
	for (sInstr in aData){
		iCount ++;
		oDiv.append($("<h3>").append(sInstr))
		oTable = $("<TABLE>").attr({border:1,cellspacing:0,width:"100%"});
		oDiv.append(oTable);
		
		//build the table
		aProducts = aData[sInstr];
		for (sProduct in aProducts){
			oRow = $("<TR>");
			oTable.append(oRow);
			
			sUrl= "detail.php?"+ SOL_QUERYSTRING + "=" + gs_current_sol + "&i=" + sInstr + "&p=" + sProduct ;
			
			oCol = $("<td>").attr({width:200});
			oRow.append(oCol)
			oCol.append($("<a>").attr({href:sUrl}).append(sProduct));
			oCol.append("<p>");
			oCol.append($("<div>").attr({class:"soltags",id:"T"+sProduct}).append("Loading Tags.."));
			
			
			oCol = $("<td>").attr({align:"left"});
			oRow.append(oCol);
			oImgDiv =$("<DIV>").attr({id:sProduct});
			oCol.append(oImgDiv)
			oImgDiv.append($("<font>").attr({class:"subtitle"}).append("Loading images"));
			
			// go and load the highlights
			load_highlight_thumbs(gs_current_sol, sInstr, sProduct);
		}
	}
	
	if (iCount ==0)		set_error_status("no highlights found");
}

//***************************************************************
function onSheetResponse(poHttp){
	var sInstr, sProduct, sUrl;
	var oDiv, oTable, oRow, iCount;
	
	if 	(gs_update_url){
		sUrl = "solhigh.php?sheet&"+ SOL_QUERYSTRING+ "=" + gs_current_sol;
		cBrowser.pushState("highlights", sUrl);
		gs_update_url = false;
	}

	
	goQueue= new cActionQueue();
	bean.on(goQueue, "response", OnHighlightImageResult);
	
	cDebug.write("showing sheet");
	oDiv = $("#solhigh");
	oDiv.empty();
	iCount = 0;
	var aData = poHttp.json;
	
	for (sInstr in aData){
		iCount ++;
		
		//build the table
		aProducts = aData[sInstr];
		for (sProduct in aProducts)
			load_highlight_thumbs(gs_current_sol, sInstr, sProduct);
	}
	
	if (iCount ==0)
		set_error_status("no highlights found");
	else
		set_status("ok");
}

//***************************************************************
function onMosaicResponse(poHttp){
	var oDiv, oImg;
	
	oDiv = $("#solhigh");
	oDiv.empty();
	var oData = poHttp.json;
	
	if (oData.u == null){
		oDiv.append("No highlights found");
	}else{
		oImg = $("<IMG>").attr({"src":oData.u});
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
function OnHighlightImageResult(paData){
	var i, oDiv, oImg, aUrls;
	
	aUrls = paData.u;
	if (cBrowser.data["sheet"] == null){
		oDiv = $("#" + paData.p);
		oDiv.empty();
		
		if (aUrls.length == 0){
			oDiv.html("no thumbnails found");
			return;
		}
	}else
		oDiv = $("#solhigh");
	
	for (i=0 ; i< aUrls.length; i++){
		oImg = $("<IMG>").attr({"src":aUrls[i],"class":"polaroid"});
		oImg.data(SOL_ATTR,paData.s);
		oImg.data(INSTRUMENT_ATTR,paData.i);
		oImg.data(PRODUCT_ATTR,paData.p);
		oImg.click(onThumbClick);
		oDiv.append(oImg);
	}
	
}

//***************************************************************
function onThumbClick(){
	var oImg = $(this);
	sURL = "detail.php?s=" + oImg.data(SOL_ATTR) + "&i=" + oImg.data(INSTRUMENT_ATTR) +"&p=" + oImg.data(PRODUCT_ATTR);
	cBrowser.openWindow(sURL, "detail");
}


