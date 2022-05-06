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

var goPds = null;

//###############################################################
//# Event Handlers
//###############################################################

//***************************************************************

function onClickEDRLBL(){
	if (!has_pds_url()) return;
	window.open(goPds.u, "EDR");
}

function onClickDetail(){
	var sSol, sInstr, sProduct, sUrl;
	
	sInstr = cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING];
	sProduct = cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING];
	sSol = cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING];
	
	var sUrl = cBrowser.buildUrl(	"detail.php",	{s:sSol,i:sInstr,p:sProduct}	);
	cBrowser.openWindow(sUrl, "detail");

}

//***************************************************************
function onClickNotebook(){
	if (!has_pds_url()) return;
	cDebug.write(goPds.notebook);
	window.open(goPds.notebook, "notebook");
}


//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery_PDS(){
	set_status("loading pds data...");
	
	var sUrl = cBrowser.buildUrl(
		cLocations.rest + "/pds.php",
		{
			a:"s",
			s:cBrowser.data[cSpaceBrowser.SOL_QUERYSTRING],
			i:cBrowser.data[cSpaceBrowser.INSTR_QUERYSTRING],
			p:cBrowser.data[cSpaceBrowser.PRODUCT_QUERYSTRING],
			m:cMission.ID
		}
	);
	var oHttp = new cHttp2();
	bean.on(oHttp,"result",get_pds_callback);
	oHttp.fetch_json(sUrl);
}

function has_pds_url(){
	if (!goPds)
		set_error_status("Whoa no PDS link found yet");
	return goPds;
}

//###############################################################
//* call backs 
//###############################################################
function get_pds_callback(poHttp){
	var oData = poHttp.response;
	if (oData==null)
		set_error_status("no PDS data found");
	else{
		set_status("PDS data found: OK");
		goPds = oData;
		
		$("#PDS_FRAME").attr("src",goPds.u);
		
		$("#PDS_Images").empty();
		$("#PDS_Images").append($("<a>",{href:goPds.rdr,target:"pds"}).append(goPds.rdr));
		$("#PDS_Images").append("<BR>");
		$("#PDS_Images").append($("<IMG>",{src:goPds.rdr}));
	}
}



