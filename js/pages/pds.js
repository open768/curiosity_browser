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
var SOL_QUERYSTRING = "s";
var INSTR_QUERYSTRING = "i";
var PRODUCT_QUERYSTRING = "p";
var TIMESTAMP_QUERYSTRING = "t";

var gsPdsUrl = null;

//###############################################################
//# Event Handlers
//###############################################################

//***************************************************************
function onClickPDS(){
	if (!gsPdsUrl)
		set_error_status("Whoa no PDS link found yet");
	else
		window.open(gsPdsUrl, "_blank_");
}

//***************************************************************
function onClickParsePDS(){
	if (!gsPdsUrl){
		set_error_status("Whoa no PDS link found yet");
		return;
	}
	
	sUrl = "php/rest/pds.php?a=p&debug&u=" + escape(gsPdsUrl);
	
	window.open(sUrl, "parsePDS");
}

//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery(){
	set_status("loading pds data...");
	var sURL = 	
		"php/rest/pds.php?a=s&s="+ cBrowser.data[SOL_QUERYSTRING] + 
		"&i=" + cBrowser.data[INSTR_QUERYSTRING] +
		"&p=" + cBrowser.data[PRODUCT_QUERYSTRING] +
		"&t=" + cBrowser.data[TIMESTAMP_QUERYSTRING];
	cHttp.fetch_json(sURL, get_pds_callback);
}

//###############################################################
//* call backs 
//###############################################################
function get_pds_callback(poJS){
	if (poJS==null)
		set_error_status("no PDS data found");
	else{
		set_status("PDS data found: OK");
		gsPdsUrl = poJS.u;
		$("#PDS_FRAME").attr("src",poJS.u);
	}
}



