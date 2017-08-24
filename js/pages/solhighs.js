/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var gs_current_sol = null;
var gb_mosaic = false;


//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_SOLHI(){
	gs_current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING];
	if (gs_current_sol==null){
		$("#solhigh").append("no SOL provided!!!!");
		return;
	}

	//change status of checkbox
	if (cBrowser.data[cSpaceBrowser.MOSAIC_QUERYSTRING] != null )	$("#chkMosaic").prop('checked', true);	
	$("#chkMosaic").on("change",onCheckMosaic);
	
	set_browser_url();
	load_widget();
}

//***************************************************************
function load_widget(){
	var oDiv = $("#solhigh");
	oWidget = oDiv.data("ckSolhighlights");	//capitalise the first letter of the widget
	if ( oWidget)	oWidget.destroy();

	
	$("#solhigh").solhighlights({
		sol:gs_current_sol,
		mission:cMission,
		onStatus:onStatusEvent,
		onClick:onHighlightClick
	});
}

//***************************************************************
function onStatusEvent(poEvent, poData){
	set_status(poData.text);
}

function set_browser_url(){
	$("#sol").html(gs_current_sol);
	$("#solbutton").html(gs_current_sol);
	var oParams = {};

	oParams[cSpaceBrowser.SOL_QUERYSTRING]= gs_current_sol;
	if (gb_mosaic)	oParams[cSpaceBrowser.MOSAIC_QUERYSTRING]= 1;
	
	var sUrl = cBrowser.buildUrl(cBrowser.pageUrl() , oParams);
	cBrowser.pushState("solhigh", sUrl);	
}

//###############################################################
//# events
//###############################################################
function onCheckMosaic(){
	gb_mosaic = $("#chkMosaic")[0].checked;
	set_browser_url();
	load_widget();
}

function onClickPrevious_sol(){
	gs_current_sol --;
	set_browser_url();
	load_widget();
}

//***************************************************************
function onClickNext_sol(){
	gs_current_sol ++;
	set_browser_url();
	load_widget();
}

//***************************************************************
function onClickSol(){
	pr_stop_queue();
	var oParams = {};
	oParams[cSpaceBrowser.SOL_QUERYSTRING] = gs_current_sol;
	var sUrl = cBrowser.buildUrl("index.php", oParams);
	cBrowser.openWindow(sUrl, "index");
}


//***************************************************************
function onClickMosaic(){
	var sUrl;
	
	if (cBrowser.data[cSpaceBrowser.MOSAIC_QUERYSTRING] != null) return;
	pr_stop_queue();
	var oParams = {};
	oParams[cSpaceBrowser.SOL_QUERYSTRING] = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING];
	oParams[cSpaceBrowser.MOSAIC_QUERYSTRING] = 1;
	var sUrl = cBrowser.buildUrl("solhigh.php", oParams);
	cBrowser.pushState("highlights", sUrl);
	set_status("loading..");
	onLoadJQuery();
}

//***************************************************************
function onHighlightClick(poEvent, poData){
	var oImg = $(this);
	
	var oParams = {};
	oParams[cSpaceBrowser.SOL_QUERYSTRING] = poData.s;
	oParams[cSpaceBrowser.INSTR_QUERYSTRING] = poData.i;
	oParams[cSpaceBrowser.PRODUCT_QUERYSTRING] = poData.p;
	var sUrl = cBrowser.buildUrl("detail.php", oParams);
	cBrowser.openWindow(sUrl, "detail");
}


