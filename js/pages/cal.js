/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var DEBUG_ON = true;
var loading = true;

var current_sol = null;
var current_date = null;
var oColours = {};

//###############################################################
//# Event Handlers
//###############################################################
function onClickGotoSol(){
	var sUrl = cBrowser.buildUrl("index.php",{s:current_sol});
	cBrowser.openWindow(sUrl, "index");
}

function onClickNext(){
	current_sol = parseInt(current_sol) +1;
	load_widget();
}

function onClickPrevious(){
	current_sol = parseInt(current_sol) -1;
	load_widget();
}

function onClickRefresh(){
	set_status("refreshing data");
	
	var sUrl = cBrowser.buildUrl("php/rest/instruments.php",{s:current_sol,r:"true",m:cMission.ID}); //force a refresh on the server
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",onLoadJQuery_CAL);
	oHttp.fetch_json(sUrl);

}

function onLoadedCal( poEvent, psSol){
	current_sol = psSol;
	$("#gotoSOL").html(psSol);
	$("#sol").html(psSol);
	var sURL = cBrowser.buildUrl(cBrowser.pageUrl(),{s:current_sol});
	cBrowser.pushState( "calendar", sURL);
}

function onClickCal( poEvent, poData){
	var sUrl = cBrowser.buildUrl("detail.php",poData);
	cBrowser.openWindow(sUrl, "detail");
}

//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_CAL(){
	current_sol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING];
	load_widget();
}

function load_widget(){
	var oDiv = $("#calendar");
	oWidget = oDiv.data("ckSolcalendar");	//capitalise the first letter of the widget
	if ( oWidget)	oWidget.destroy();
	$("#calendar").solcalendar({
		mission: cMission,
		sol: current_sol,
		onLoadedCal: onLoadedCal,
		onClick: onClickCal
	});
}

