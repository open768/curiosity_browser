/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

var DEBUG_ON = true;
var STATUS_ID = "status";

//###############################################################
//# HTTP
//###############################################################
var cHttp = {
	fetch_json:function(psUrl, pfnCallBack){	
		cDebug.write(psUrl);
		RGraph.AJAX.getJSON(psUrl, pfnCallBack);
	}
}

//###############################################################
//# DEBUG
//###############################################################
var cDebug = {
	write:function(psMessage){
		if (DEBUG_ON && console) console.log("DEBUG> " + psMessage);
	},
	
	vardump:function(arr, level){
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else 
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		return dumped_text;
	}
}


//***************************************************************
function set_status(psStatus){
	document.getElementById(STATUS_ID).innerHTML= psStatus;
	cDebug.write("status: " + psStatus);
}

//***************************************************************
function getRadioButtonValue(psID){
	var oRadios = document.getElementsByName(psID);
	var sValue = null;
	var oRadio;
	
	for (var i = 0; i<oRadios.length; i++){
		oRadio = oRadios[i];
		if (oRadio.checked) {
			cDebug.write("found a checked radio");
			sValue = oRadio.value;
			break;
		}
	}
		
	return sValue;
}

//###############################################################
//# BROWSER
//###############################################################
cBrowser = {
	data:null,
	
	init:function (){
		var result = {}, keyValuePairs = location.search.slice(1).split('&');

		keyValuePairs.forEach(function(keyValuePair) {
			keyValuePair = keyValuePair.split('=');
			result[keyValuePair[0]] = keyValuePair[1] || '';
		});

		this.data = result;
	},
	
	baseUrl:function(){
		return document.URL.split("?")[0];
	},
	
	pushState:function(psTitle, psUrl){
		if (window.history.pushState)
			window.history.pushState("", psTitle, psUrl);
	}
}
cBrowser.init();

