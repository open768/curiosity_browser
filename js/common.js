/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var DEBUG_ON = true;
var query_string = getQueryString();
const STATUS_ID = "status";

//***************************************************************
function set_status(psStatus){
	document.getElementById(STATUS_ID).innerHTML= psStatus;
	debug_console("status: " + psStatus);

}

//***************************************************************
function async_http_get(psUrl, pfnCallBack){
	debug_console(psUrl);
	RGraph.AJAX.getJSON(psUrl, pfnCallBack);
}

//###############################################################
//# DEBUG
//###############################################################
function debug_console(psMessage){
	if (DEBUG_ON && console) console.log("DEBUG> " + psMessage);
}

//***************************************************************
function write_console(psMessage){
	if (console) console.log(psMessage);
}

//***************************************************************
function getRadioButtonValue(psID){
	var oRadios = document.getElementsByName(psID);
	var sValue = null;
	var oRadio;
	
	for (var i = 0; i<oRadios.length; i++){
		oRadio = oRadios[i];
		if (oRadio.checked) {
			debug_console("found a checked radio");
			sValue = oRadio.value;
			break;
		}
	}
		
	return sValue;
}

//***************************************************************
function getQueryString() {
    var result = {}, keyValuePairs = location.search.slice(1).split('&');

    keyValuePairs.forEach(function(keyValuePair) {
        keyValuePair = keyValuePair.split('=');
        result[keyValuePair[0]] = keyValuePair[1] || '';
    });

    return result;
}

//***************************************************************
function getBaseURL(){
	return document.URL.split("?")[0];
}
