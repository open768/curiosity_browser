/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/

//###############################################################
//# HTTP
//###############################################################
function cHttpFailer(){
	//TODO when this fails its not graceful, should call the caller and tell them theres an error
	this.url = null;
	this.fail = function( jqxhr, textStatus, error ){
		set_error_status("call failed: check console" );
		cDebug.write("ERROR: " + textStatus + "," + error + " : " + this.url);		
	}
}

//###############################################################
//###############################################################
var cHttp = {
	//TODO make this OO not a singleton
	
	fetch_json:function(psUrl, pfnCallBack){	
		var oFailer;
		//if the url doesnt contain http
		if (psUrl.search("http:") == -1)
			cDebug.write(cBrowser.baseUrl() + psUrl);
		else
			cDebug.write(psUrl);
		oFailer = new cHttpFailer;
		oFailer.url = psUrl;
		$.getJSON(psUrl, pfnCallBack).fail(oFailer.fail);
	},
	
	//***************************************************************
	post:function(psUrl, poData, pfnCallBack){
		if (psUrl.search("http:") == -1)
			cDebug.write(cBrowser.baseUrl() + psUrl);
		else
			cDebug.write(psUrl);
		oFailer = new cHttpFailer;
		oFailer.url = psUrl;
		
		//- - - - - make the call
		$.post(psUrl, poData, pfnCallBack).fail(oFailer.fail);
	}
}

//###############################################################
//# use bean.on(ohttp,"result",callback);
//###############################################################
function cHttp2(){
	this.url = null;
	this.data = null;
	this.json = null;
		
	//**************************************************************
	this.fetch_json = function(psUrl, poData){
		var oParent = this;
		
		function  prfn__httpCallback(poJson){
			oParent.json = poJson;
			bean.fire(oParent,"result", oParent); //notify subscriber 
		}
		
		this.url = psUrl;
		this.data = poData;
		cHttp.fetch_json(psUrl, prfn__httpCallback);
	};
	
	//**************************************************************
	this.post = function(psUrl, poData){
		var oParent = this;
		function  prfn__httpCallback(poResponse){
			bean.fire(oParent,"result", {u:oParent.url, d:poResponse}); //notify subscriber 
		}
		this.url = psUrl;
		cHttp.post(psUrl, prfn__httpCallback);
	};
}
