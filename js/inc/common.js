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
		//if the url doesnt contain http
		if (psUrl.search("http:") == -1)
			cDebug.write(cBrowser.baseUrl() + psUrl);
		else
			cDebug.write(psUrl);
		$.getJSON(psUrl, pfnCallBack).fail(this.fail);
	},
	
	fail:function( jqxhr, textStatus, error ){
		set_error_status("Json call failed: see javascript console");
		cDebug.write("ERROR: " + textStatus + "," + error);		
	}
	
	
}

//###############################################################
//# STRINGS
//###############################################################
var cString = {
	last:function (psText, psSearch){
		var sReverseTxt = this.reverse(psText);
		var sReverseSearch = this.reverse(psSearch);
		
		var iFound = sReverseTxt.search(sReverseSearch);
		
		if (iFound != -1)
			iFound = psText.length - iFound;
		return iFound;
	},
	
	//***************************************************************
	reverse:function reverse(psText){
		return psText.split("").reverse().join("");
	}
}

//###############################################################
//# DEBUG
//###############################################################
var cDebug = {
	write:function(psMessage){
		if (DEBUG_ON && console) console.log("DEBUG> " + psMessage);
	},
	
	//***************************************************************
	vardump:function(arr, level){
		sDump = this.dump(arr, level);
		this.write(sDump);
	},
	
	//***************************************************************
	dump:function(arr, level){
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "\t";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += this.dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else 
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		return dumped_text;
	},
	
	error:function(psErr){
		throw psErr;
	}
}

//###############################################################
//# BROWSER
//###############################################################
cBrowser = {
	data:null,
	
	//***************************************************************
	init:function (){
		var oResult = {}, aPairs = location.search.slice(1).split('&');

		aPairs.forEach(function(sPair) {
			aPair = sPair.split('=');
			oResult[aPair[0]] = aPair[1] || '';
		});

		this.data = oResult;
	},
	
	//***************************************************************
	pageUrl:function(){
		return document.URL.split("?")[0];
	},
	
	//***************************************************************
	baseUrl:function(){
		var sUrl, iLast, sBase;
		
		sUrl = this.pageUrl();
		cDebug.write("page url: "+ sUrl);
		iLast = cString.last(sUrl, "/");
		if (iLast == -1)
			sBase = "";
		else
			sBase = sUrl.substring(0,iLast);
		
		cDebug.write("url is "+ sBase);
		return sBase;
	},
	
	//***************************************************************
	pushState:function(psTitle, psUrl){
		if (window.history.pushState)
			window.history.pushState("", psTitle, psUrl);
	}
}
cBrowser.init();

//###############################################################
//# MISC
//###############################################################
function set_error_status(psStatus){
	$("#"+STATUS_ID).html("<font color='red'>" + psStatus + "</font>");
	cDebug.write("Error: " + psStatus );
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

