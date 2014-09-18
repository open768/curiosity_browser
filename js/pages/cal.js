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
var DATE_QUERYSTRING = "t";

var current_sol = null;
var current_date = null;
var oColours = {};

//###############################################################
//# Event Handlers
//###############################################################
function onClick(){
	var sInstr = event.target.attributes.i.value;
	var sProduct = event.target.attributes.p.value;
	var sURL = "detail.html?s=" + current_sol +"&i=" + sInstr + "&p=" +sProduct;
	window.open(sURL, "detail");
}

function onClickNext(){
	var iSol = parseInt(current_sol) +1;
	cBrowser.pushState("Detail", cBrowser.pageUrl() +"?s=" + iSol);
	get_calendar_data(iSol);
}
function onClickPrevious(){
	var iSol = parseInt(current_sol) -1;
	cBrowser.pushState("Detail", cBrowser.pageUrl() +"?s=" + iSol);
	get_calendar_data(iSol);
}

function onClickRefresh(){
	sUrl = "php/rest/instruments.php?s=" + current_sol + "&r=true";
	set_status("refreshing data");
	cHttp.fetch_json(sUrl, onLoadJQuery);
}


//###############################################################
//# Utility functions 
//###############################################################
function onLoadJQuery(){
	current_date = cBrowser.data[DATE_QUERYSTRING];
	get_calendar_data( cBrowser.data[SOL_QUERYSTRING]);
}

//***************************************************************
function get_calendar_data( psSol){
	var sUrl;
	
	document.getElementById("sol").innerHTML = psSol;
	current_sol = psSol;
	
	loading=true;
	sUrl = "php/rest/cal.php?s=" + psSol ;
	set_status("fetching calendar data for sol:"+ psSol);
	cHttp.fetch_json(sUrl, load_cal_callback);
}
//###############################################################
//* call backs 
//###############################################################
function load_cal_callback(paJS){
	var sSol, aDates, aHeadings, aTimes, i,j,k, sDKey, sTKey, sHTML, aItems, oItem, sID, sColour, sStyle;
	var aInstr, oInstr;
	
	set_status("received data...");

	sSol = paJS.sol;
	aDates = paJS.cal;
	aInstr = paJS.instr;
	
	//display the colours and build the colour array
	sHTML = "";
	for (i=0 ; i<aInstr.length; i++){
		oInstr = aInstr[i];
		sHTML += "<span class='greybox'>" + oInstr.name + " <span  style='background-color:" + oInstr.colour + "'>&nbsp;&nbsp;&nbsp;</span></span> ";
		oColours[oInstr.abbr] = oInstr.colour;
	}
	$("#colours").html(sHTML);
	
	
	// get the headings
	aHeadings=Array();
	for (sDKey in aDates)
		aHeadings.push(sDKey);
	
	//get and sort the times
	aTimes = Array();
	for (sDKey in aDates)
		for (sTKey in aDates[sDKey])
			if (aTimes.indexOf(sTKey) == -1)
				aTimes.push(sTKey);
	aTimes.sort();
	
	//build the html
	sHTML = "<table class='cal'>";
		sHTML += "<tr><td></td>";
			for (i=0; i<aHeadings.length; i++)
				sHTML += "<TH class='caldate'>UTC:" + aHeadings[i] +"</TH>";
		sHTML += "</tr>";
		for (i=0; i<aTimes.length; i++){
			sTKey = aTimes[i];
			sHTML += "<tr><TH class='caltime'>" + aTimes[i] +"</TH>";
			for (j=0; j<aHeadings.length; j++){
				sDKey = aHeadings[j];
				sHTML += "<td>" ;
					if (aDates[sDKey].hasOwnProperty(sTKey)){
						aItems = aDates[sDKey][sTKey];
						for (k=0; k<aItems.length; k++){
							oItem = aItems[k];
							sColour = oColours[oItem.i];
							sStyle = "background-color:" + sColour;
							if (oItem.d === current_date){
								cDebug.write("found a match");
								sStyle += ";border:4px double black" 
							}

							
							sHTML += "<button class='calbutton' style='" + sStyle + "' i='" + oItem.i + "'p='" + oItem.p + "' onclick='onClick();' title='" + oItem.i + "'>&nbsp;</button>";
						}
					}
				sHTML += "</td>";
			}
			sHTML += "</tr>";
		}
				
	sHTML += "</table>";
	
	$("#calendar").html(sHTML);
	
	//we're done
	set_status("OK");
}

