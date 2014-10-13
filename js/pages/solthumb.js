/**************************************************************************
Copyright (C) Chicken Katsu 2014 

This code is protected by copyright under the terms of the 
Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License
http://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

For licenses that allow for commercial use please contact cluck@chickenkatsu.co.uk

// USE AT YOUR OWN RISK - NO GUARANTEES OR ANY FORM ARE EITHER EXPRESSED OR IMPLIED
**************************************************************************/


var DEBUG_ON = true;
var current_sol = null;
var current_instr = null;
var COLS=4;
var bReady = false
var sAll = "All";
var current_instrument = null;
var THUMB_SIZE=144;
//###############################################################
//# event handlers
//###############################################################

//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery(){
	//load instruments
	cHttp.fetch_json("php/rest/instruments.php", load_instruments_callback);
	init();
}

//********************************************************************
function init(){
	//update sol number
	current_sol = cBrowser.data["s"];
	current_instr = cBrowser.data["i"];
	var sTarget = ( SINGLE_WINDOW ? "" : "target='solgigsa'");
	$("#sol").html("<a " + sTarget + " href='index.php?s=" +current_sol+"'>" + current_sol + "</a>");
	//load thumbs
	sUrl = "php/rest/solthumbs.php?s=" + current_sol + "&i=" + current_instr;
	cHttp.fetch_json(sUrl, load_thumbs_callback);
}

//********************************************************************
function OnChangeInstrument(poEvent){
	bInListChange = true;
	current_instr = poEvent.target.value;
	sUrl = cBrowser.pageUrl() +"?s=" + current_sol  + "&i=" + poEvent.target.value;
	cBrowser.pushState("Thumbnails", sUrl);
	$("#solthumb").html("Loading...");
	init();
}

//###############################################################
//* call backs 
//###############################################################
function load_instruments_callback(paJS){
	var iIndex, oInstr, oList, sID;
	
	oList = $("#instruments");
	oList.empty();
	oList.append( $("<option>").attr({disabled:"disabled"}).html("Instruments"));
	
	for (iIndex = 0; iIndex < paJS.length; iIndex++){
		oInstr = paJS[iIndex];
		sID= "i" + oInstr.name;
		oList.append( $("<option>").attr({value:oInstr.name,disabled:"disabled",ID:sID}).html(oInstr.caption));
	}
	oList.append( $("<option>").attr({value:sAll,disabled:"disabled",ID:"iAll"}).html("All Instruments"));
	sUrl = "php/rest/instruments.php?r=0&s=" + current_sol;
	cHttp.fetch_json(sUrl, get_sol_instruments_callback);
}

//********************************************************************
function load_thumbs_callback(poJS){
	var oDiv, i, oItem, aData;
	
	oDiv = $("#solthumb");
	oDiv.empty();
	
	aData = poJS.d.data;
	if (aData.Length == 0)
		oDiv.append("<p class='subtitle'>Sorry no thumbnails found</p>");
	else{
		var sTarget = ( SINGLE_WINDOW ? "" : "target='detail'");
		for (i=0; i< aData.length; i++){
			oItem = aData[i];
			oDiv.append("<a " + sTarget + " href='detail.php?s=" + poJS.s + "&i=" + oItem.data.instrument +"&p=" +oItem.p +"'><img border='0' height='"+ THUMB_SIZE +"' src='" +oItem.i + "'></a> ");
		}
	}
	
	set_status("ok");
}

//********************************************************************
function get_sol_instruments_callback(paJS){
	oSelect = $("#instruments");
	
	//mark the instruments remaining
	for ( instr_idx = 0; instr_idx<paJS.length; instr_idx++){
		
		sInstr = paJS[instr_idx];
		oSelect.find('option[value=\"'+ sInstr + '\"]').removeAttr('disabled');
	}
	oSelect.find('option[value=\"'+ sAll + '\"]').removeAttr('disabled');
	
	
	if (!bReady){
		$("#instruments").change(OnChangeInstrument);
		bReady = true;
	}
}

function onClickPrevious(){
	sUrl = cBrowser.pageUrl() +"?s=" + (parseInt(current_sol) -1) + "&i=" + current_instr;
	cBrowser.pushState("Thumbnails", sUrl);
	$("#solthumb").html("Loading...");
	init();
}

function onClickNext(){
	sUrl = cBrowser.pageUrl() +"?s=" + (parseInt(current_sol) +1) + "&i=" + current_instr;
	cBrowser.pushState("Thumbnails", sUrl);
	$("#solthumb").html("Loading...");
	init();
}

function onClickRefresh(){
	sUrl = "php/rest/instruments.php?s=" + current_sol + "&r=true";
	set_status("refreshing data");
	$("#solthumb").html("Loading...");
	cHttp.fetch_json(sUrl, init);
}